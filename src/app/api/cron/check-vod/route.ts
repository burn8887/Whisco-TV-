import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// VOD catalog health check — covers every collection including Turkish Dizi.
//
// Strategy per title type:
//  - MOVIE / DOCUMENTARY with an archive.org streamUrl → verify via the
//    Internet Archive metadata API that the item still exists, is not dark,
//    and still lists the exact file we link to. (Cheap JSON call; avoids
//    hammering download endpoints which rate-limit aggressively.)
//  - SERIES with YouTube-embed episodes (Turkish Dizi) → verify a sample of
//    episodes (first, middle, latest) via YouTube's oEmbed endpoint. A 401/
//    403 means embedding was turned off; a 404 means the video was removed.
//    The series is only failed if MOST sampled episodes are dead — a single
//    missing episode shouldn't hide a 400-episode show.
//
// Because archive.org rate-limits, each run checks a rotating batch of the
// least-recently-checked titles rather than the whole catalog. With the
// 6-hourly schedule the entire 1,700+ catalog gets swept about every 3 days.
// Titles need FAIL_THRESHOLD consecutive failures before being hidden, and
// recovered titles are automatically restored.

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// MEASURED 2026-09-14: the batch size is NOT the sweep's bottleneck — the 230s time budget
// is. Three live runs processed 231 / 177 / 179 titles before the deadline fired, so raising
// this number only wastes Neon egress (rows are fetched with their episodes, then never
// reached). 250 keeps the batch just above observed capacity. A full sweep currently takes
// ~1,150 titles/day => ~15 days across the catalog, NOT the "12 days" the old comment
// claimed and not the "<5 days" a bigger batch was expected to buy. The real speed-up is
// skipping the per-episode watch-page probe for titles whose CHANNEL verdict is already
// known in the same run (channel-level geo is per-uploader for whole brand catalogs) —
// designed, not yet built.
const BATCH_SIZE = 250; // titles per run (rotating, least-recently-checked first)
const CONCURRENCY = 10; // gentle on archive.org (fewer parallel calls = fewer 429s)
const FAIL_THRESHOLD = 2;
const TIMEOUT_MS = 10000;

function parseArchive(url: string | null): { item: string; file: string } | null {
  const m = url?.match(/archive\.org\/download\/([^/]+)\/(.+)$/);
  if (!m) return null;
  return { item: m[1], file: decodeURIComponent(m[2]) };
}

function parseYouTube(url: string | null): string | null {
  const m = url?.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-VODHealthCheck)" },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

// "ok" = verified good; "invalid" = verified dead; "unknown" = couldn't
// verify (rate limit/timeouts) — unknown NEVER counts as a failure.
//
// Geo results (added 2026-09-14 after the geo-exposure finding):
//  "geo"         = the title is NOT watchable in the GCC at all. Hidden from
//                  viewers, same as a dead stream, but tracked separately so
//                  the maintenance KPI can never quietly read 0 again.
//                  A GCC block is NOT "invalid": the video is alive, it just
//                  isn't licensed for our audience. Conflating the two is what
//                  let Leyla / Kızılcık Şerbeti / Sahipsizler drift back onto
//                  the site while every dashboard said "ok".
//  "geo-partial" = some sampled episodes are GCC-blocked, some are watchable.
//                  Title stays VISIBLE (viewers can still watch the good
//                  episodes) but is flagged + counted for a human decision.
//                  Deliberately not hidden: hiding a 400-episode series over
//                  one blocked sample would be a worse viewer outcome.
type CheckResult = "ok" | "invalid" | "unknown" | "geo" | "geo-partial";

async function checkArchiveItem(item: string, file: string): Promise<CheckResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(`https://archive.org/metadata/${item}`, TIMEOUT_MS);
      if (res.status === 404) return "invalid";
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      const j = (await res.json()) as { files?: { name: string }[]; is_dark?: boolean };
      if (!j || j.is_dark) return "invalid";
      if (!j.files || j.files.length === 0) return "invalid";
      const found = j.files.some((f) => f.name === file || f.name === file.replace(/\+/g, " "));
      return found ? "ok" : "invalid";
    } catch {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  return "unknown";
}

// GCC countries our audience watches from — a video only counts as "ok" if
// it is watchable there. Broadcasters often geo-block MENA because they sold
// regional rights (e.g. Show TV dizis on local Gulf networks); oEmbed alone
// reports those as fine, so we also parse the watch page's
// availableCountries list.
const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];

async function checkYouTubeVideo(videoId: string): Promise<CheckResult> {
  // Step 1: existence + embeddability via oEmbed.
  let exists = false;
  for (let attempt = 0; attempt < 2 && !exists; attempt++) {
    try {
      const res = await fetchWithTimeout(
        `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`,
        TIMEOUT_MS
      );
      if (res.ok) { exists = true; break; }
      // 401/403 = embedding disabled or video private; 404 = removed
      if (res.status === 401 || res.status === 403 || res.status === 404) return "invalid";
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    } catch {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  if (!exists) return "unknown";

  // Step 2: GCC geo-availability via the watch page's availableCountries.
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/watch?v=${videoId}&hl=en`, TIMEOUT_MS);
    if (!res.ok) return "unknown";
    const html = await res.text();
    if (!html.includes("playabilityStatus")) return "unknown"; // consent/rate-limit stub
    const m = html.match(/"availableCountries":\[([^\]]*)\]/);
    if (!m) return "ok"; // no restriction list → worldwide
    const countries = m[1].replace(/"/g, "").split(",");
    // Blocked for every GCC country = unavailable to our entire audience.
    return GCC.some((c) => countries.includes(c)) ? "ok" : "geo";
  } catch {
    return "unknown";
  }
}

// Second-opinion probe used before restoring a geo-hidden title. Returns true
// only if the title is genuinely watchable in the GCC. Non-YouTube sources are
// not geo-restricted in our catalog, so they pass immediately.
async function confirmGeoAvailable(t: TitleRow): Promise<boolean> {
  const eps = t.seasons.flatMap((s) => s.episodes);
  const target =
    t.type === "SERIES"
      ? (eps.find((e) => parseYouTube(e.streamUrl))?.streamUrl ?? null)
      : t.streamUrl;
  const yt = parseYouTube(target);
  if (!yt) return true;
  return (await checkYouTubeVideo(yt)) === "ok";
}

type TitleRow = {
  id: string;
  name: string;
  type: string;
  streamUrl: string | null;
  failCount: number;
  isActive: boolean;
  seasons: { episodes: { streamUrl: string }[] }[];
};

async function checkTitle(t: TitleRow): Promise<CheckResult> {
  // Series (Turkish Dizi & future embed-based shows): sample episodes.
  if (t.type === "SERIES") {
    const eps = t.seasons.flatMap((s) => s.episodes);
    if (eps.length === 0) return "invalid";
    const sampleIdx = new Set<number>([0, Math.floor(eps.length / 2), eps.length - 1]);
    const results: CheckResult[] = [];
    for (const i of sampleIdx) {
      const yt = parseYouTube(eps[i].streamUrl);
      if (yt) {
        results.push(await checkYouTubeVideo(yt));
      } else {
        const pa = parseArchive(eps[i].streamUrl);
        results.push(pa ? await checkArchiveItem(pa.item, pa.file) : "unknown");
      }
    }
    const invalid = results.filter((r) => r === "invalid").length;
    const ok = results.filter((r) => r === "ok").length;
    const geo = results.filter((r) => r === "geo").length;
    // Every sample is GCC-blocked -> the show cannot be watched by our audience.
    if (geo > 0 && ok === 0 && invalid === 0) return "geo";
    // Mixed: some episodes blocked, some watchable. Keep visible, flag it.
    if (geo > 0 && ok > 0) return "geo-partial";
    if (invalid > ok) return "invalid"; // majority of samples dead
    if (ok > 0) return "ok";
    return "unknown";
  }

  // Movies / documentaries.
  const yt = parseYouTube(t.streamUrl);
  if (yt) return checkYouTubeVideo(yt);
  const pa = parseArchive(t.streamUrl);
  if (pa) return checkArchiveItem(pa.item, pa.file);
  if (!t.streamUrl) return "invalid";
  // Non-archive, non-YouTube direct URL: light GET range probe.
  try {
    const res = await fetchWithTimeout(t.streamUrl, TIMEOUT_MS);
    return res.ok ? "ok" : "invalid";
  } catch {
    return "unknown";
  }
}

// Time-budgeted pool: stops picking NEW items once the deadline passes so the
// route always returns well inside Vercel's maxDuration (the 2026-09-06 failure
// was exit-28: batch of 250 outran the 300s window as the harvest backlog and
// YouTube latency grew). Unprocessed titles stay least-recently-checked and
// are simply first in the next run — nothing is lost, the sweep self-heals.
async function runPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>, deadlineMs = 230_000): Promise<R[]> {
  const results: (R | undefined)[] = new Array(items.length);
  const started = Date.now();
  let next = 0;
  async function worker() {
    while (next < items.length && Date.now() - started < deadlineMs) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results.filter((r): r is R => r !== undefined);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rotating batch: least-recently-checked first (never-checked = highest priority).
  const titles = await prisma.title.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      streamUrl: true,
      failCount: true,
      isActive: true,
      lastStatus: true,
      seasons: { select: { episodes: { select: { streamUrl: true }, orderBy: { number: "asc" } } }, orderBy: { number: "asc" } },
    },
    orderBy: [{ lastCheckedAt: { sort: "asc", nulls: "first" } }],
    take: BATCH_SIZE,
  });

  const now = new Date();
  const results = await runPool(titles, CONCURRENCY, async (t) => ({ t, status: await checkTitle(t as TitleRow) }));

  let ok = 0,
    invalid = 0,
    unknown = 0,
    geo = 0,
    geoPartial = 0,
    newlyHidden = 0,
    restored = 0;

  // Batch the writes: group unchanged-status rows into updateMany calls to
  // minimize Neon egress; only genuinely-changed rows get individual updates.
  const okIdsNoChange: string[] = [];
  const unknownIds: string[] = [];
  for (const { t, status } of results) {
    if (status === "ok") {
      // A geo-hidden title needs a SECOND independent probe before we put it
      // back in front of Gulf viewers. A single flaky "ok" reading is exactly
      // what re-exposed Leyla / Kızılcık Şerbeti / Sahipsizler (Sep 2026):
      // hidden in August, one good reading later, live again with every
      // dashboard reporting "ok".
      if (!t.isActive && t.lastStatus?.startsWith("geo") && !(await confirmGeoAvailable(t as TitleRow))) {
        geo++;
        await prisma.title.update({
          where: { id: t.id },
          data: { isActive: false, lastStatus: "geo", failCount: 0, lastCheckedAt: now },
        });
      } else {
        ok++;
        if (!t.isActive) restored++;
        if (t.isActive && t.failCount === 0 && !t.lastStatus?.startsWith("geo")) {
          okIdsNoChange.push(t.id);
        } else {
          await prisma.title.update({
            where: { id: t.id },
            data: { isActive: true, failCount: 0, lastStatus: "ok", lastCheckedAt: now },
          });
        }
      }
    } else if (status === "invalid") {
      invalid++;
      const failCount = t.failCount + 1;
      const hide = failCount >= FAIL_THRESHOLD;
      if (hide && t.isActive) newlyHidden++;
      await prisma.title.update({
        where: { id: t.id },
        data: { failCount, isActive: hide ? false : t.isActive, lastStatus: "invalid", lastCheckedAt: now },
      });
    } else if (status === "geo") {
      // Verified unavailable across every GCC country. Hide immediately — no
      // FAIL_THRESHOLD wait, because this is not a flaky stream, it is a
      // licensing fact. failCount is reset so a later genuine death is
      // measured from zero.
      geo++;
      if (t.isActive) newlyHidden++;
      await prisma.title.update({
        where: { id: t.id },
        data: { isActive: false, lastStatus: "geo", failCount: 0, lastCheckedAt: now },
      });
    } else if (status === "geo-partial") {
      // Some episodes watchable, some geo-blocked. Stay visible but flagged, so
      // it surfaces in the maintenance KPI split for a human decision. Never
      // counted as a failure.
      geoPartial++;
      await prisma.title.update({
        where: { id: t.id },
        data: { lastStatus: "geo-partial", failCount: 0, lastCheckedAt: now },
      });
    } else {
      unknown++;
      unknownIds.push(t.id);
    }
  }
  if (okIdsNoChange.length) {
    await prisma.title.updateMany({ where: { id: { in: okIdsNoChange } }, data: { lastStatus: "ok", lastCheckedAt: now } });
  }
  if (unknownIds.length) {
    await prisma.title.updateMany({ where: { id: { in: unknownIds } }, data: { lastStatus: "unknown", lastCheckedAt: now } });
  }

  const totalInactive = await prisma.title.count({ where: { isActive: false } });

  // Refresh cached catalog pages so changes appear promptly.
  revalidatePath("/vod");
  revalidatePath("/browse");
  revalidatePath("/");

  return NextResponse.json({
    checked: results.length,
    batchRequested: titles.length,
    ok,
    invalid,
    unknown,
    geo,
    geoPartial,
    restored,
    newlyHidden,
    totalInactive,
    timestamp: now.toISOString(),
  });
}
