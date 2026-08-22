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

const BATCH_SIZE = 120; // titles per run (rotating, oldest-checked first)
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
type CheckResult = "ok" | "invalid" | "unknown";

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
    return GCC.some((c) => countries.includes(c)) ? "ok" : "invalid";
  } catch {
    return "unknown";
  }
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

async function runPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
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
    newlyHidden = 0,
    restored = 0;

  // Batch the writes: group unchanged-status rows into updateMany calls to
  // minimize Neon egress; only genuinely-changed rows get individual updates.
  const okIdsNoChange: string[] = [];
  const unknownIds: string[] = [];
  for (const { t, status } of results) {
    if (status === "ok") {
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
    } else if (status === "invalid") {
      invalid++;
      const failCount = t.failCount + 1;
      const hide = failCount >= FAIL_THRESHOLD;
      if (hide && t.isActive) newlyHidden++;
      await prisma.title.update({
        where: { id: t.id },
        data: { failCount, isActive: hide ? false : t.isActive, lastStatus: "invalid", lastCheckedAt: now },
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
    checked: titles.length,
    ok,
    invalid,
    unknown,
    restored,
    newlyHidden,
    totalInactive,
    timestamp: now.toISOString(),
  });
}
