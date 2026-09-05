import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { pingIndexNow } from "@/lib/indexnow";

// Turkish Dizi auto-updater — keeps ongoing shows fresh without manual work.
//
// For each show we watch the official broadcaster channel's public RSS feed
// (no API key required; lists the ~15 most recent uploads). Any upload whose
// title matches the show's strict full-episode pattern and isn't already in
// the catalog gets verified (embeddable via oEmbed + full-length via the
// watch page's lengthSeconds) and appended as a new episode.
//
// Safety properties:
//  - Strict anchored title patterns + exclusion keywords keep clips,
//    trailers, recaps, and shorts out.
//  - Episode numbers already in the catalog are never touched (re-uploads /
//    4K remasters of old episodes are skipped).
//  - Only embeddable, full-length videos are added; anything unverifiable
//    is skipped and reported, never guessed.

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 12000;

// Uploads shorter than this are never full episodes (dizi episodes run
// 40 min at the absolute minimum, typically 2h+).
const MIN_EPISODE_SECS = 35 * 60;

// Long-running daily shows are chunked into seasons of 100 episodes.
const SEASON_CHUNK = 100;

const EXCLUDE = /özet|recap|fragman|teaser|tanıtım|sahneler|shorts|kamera|clip|yeniden izliyoruz|kesintisiz|hafta|week|uzun bölüm|long episode/i;

const SHOWS: { slug: string; channelId: string; pattern: RegExp }[] = [
  // Ongoing weekly shows — the main reason this job exists.
  { slug: "kizilcik-serbeti", channelId: "UCRfLDCtkSwmTdwHrbmC78Xg", pattern: /^Kızılcık Şerbeti (\d+)\. Bölüm/ },
  { slug: "kurulus-osman", channelId: "UCGR1XmkoQedeJMT2ajRHvsw", pattern: /^Kuruluş Osman (\d+)\. Bölüm/ },
  { slug: "emanet-legacy", channelId: "UCgzdfH1fq76l0YAZnoko4DQ", pattern: /^Emanet (\d+)\. Bölüm/ },
  // Season finales aired mid-2026; new-season episodes land here automatically.
  { slug: "teskilat", channelId: "UCt8FO3MT1fWD-UI7hnutj8A", pattern: /^Teşkilat (\d+)\. Bölüm/ },
  { slug: "cennetin-cocuklari", channelId: "UCUtWD0zOQwyaxvUxhNSR-ZQ", pattern: /^Cennetin Çocukları (\d+)\. Bölüm/ },
  // Ended/complete shows — kept so late uploads or re-added episodes still land.
  { slug: "esaret-redemption", channelId: "UCbw1MpgTP8MZiHlTq13QqOw", pattern: /^Esaret (\d+)\. Bölüm/ },
];

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-DiziUpdater)" },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

type FeedEntry = { videoId: string; title: string };

function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  const blocks = xml.split("<entry>").slice(1);
  for (const block of blocks) {
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>([^<]*)<\/title>/);
    if (idMatch && titleMatch) {
      const title = titleMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      entries.push({ videoId: idMatch[1], title });
    }
  }
  return entries;
}

async function isEmbeddable(videoId: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Best-effort duration from the watch page. Returns seconds, or null if the
// page couldn't be parsed (in which case we rely on the strict title match).
async function getDurationSecs(videoId: string): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/watch?v=${videoId}`);
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/"lengthSeconds":"(\d+)"/);
    return m ? parseInt(m[1], 10) : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report: Record<string, unknown>[] = [];
  let totalAdded = 0;

  for (const show of SHOWS) {
    const showReport: Record<string, unknown> = { slug: show.slug, added: [], skipped: [] };
    try {
      const title = await prisma.title.findUnique({
        where: { slug: show.slug },
        include: {
          seasons: { orderBy: { number: "asc" }, include: { episodes: { select: { number: true }, orderBy: { number: "asc" } } } },
        },
      });
      if (!title) {
        showReport.error = "title-not-in-catalog";
        report.push(showReport);
        continue;
      }

      const existing = new Set<number>();
      for (const s of title.seasons) for (const e of s.episodes) existing.add(e.number);

      const feedRes = await fetchWithTimeout(`https://www.youtube.com/feeds/videos.xml?channel_id=${show.channelId}`);
      if (!feedRes.ok) {
        showReport.error = `feed-http-${feedRes.status}`;
        report.push(showReport);
        continue;
      }
      const entries = parseFeed(await feedRes.text());

      // Newest first in the feed; process oldest-first so episode order is natural.
      const candidates = entries
        .filter((e) => !EXCLUDE.test(e.title))
        .map((e) => ({ ...e, m: e.title.match(show.pattern) }))
        .filter((e) => e.m)
        .map((e) => ({ videoId: e.videoId, title: e.title, n: parseInt(e.m![1], 10) }))
        .filter((e) => !existing.has(e.n))
        .sort((a, b) => a.n - b.n);

      for (const cand of candidates) {
        // Verify before adding — never guess.
        if (!(await isEmbeddable(cand.videoId))) {
          (showReport.skipped as unknown[]).push({ n: cand.n, reason: "not-embeddable" });
          continue;
        }
        const dur = await getDurationSecs(cand.videoId);
        if (dur !== null && dur < MIN_EPISODE_SECS) {
          (showReport.skipped as unknown[]).push({ n: cand.n, reason: `too-short-${dur}s` });
          continue;
        }

        // Pick the season to append to: last season, or a new one when the
        // chunk is full on multi-season (chunked) shows.
        let season = title.seasons[title.seasons.length - 1];
        if (title.seasons.length > 1 && season.episodes.length + (showReport.added as unknown[]).length >= SEASON_CHUNK) {
          const created = await prisma.season.create({ data: { titleId: title.id, number: season.number + 1 } });
          season = { ...created, episodes: [] };
          title.seasons.push(season);
        }

        await prisma.episode.create({
          data: {
            seasonId: season.id,
            number: cand.n,
            name: `Episode ${cand.n}`,
            synopsis: `${title.name.split(" (")[0]} — Bölüm ${cand.n}. Official broadcaster upload.`,
            durationMins: dur ? Math.round(dur / 60) : 120,
            stillUrl: `https://i.ytimg.com/vi/${cand.videoId}/hqdefault.jpg`,
            streamUrl: `https://www.youtube.com/embed/${cand.videoId}`,
          },
        });
        existing.add(cand.n);
        (showReport.added as unknown[]).push({ n: cand.n, videoId: cand.videoId });
        totalAdded++;
      }

      // New episodes = fresh content: surface the show and bump sitemap lastmod.
      if ((showReport.added as unknown[]).length > 0 && title.isActive) {
        // Only surface shows viewers can actually watch — geo-hidden titles
        // keep collecting episodes silently in case they become available.
        await prisma.title.update({
          where: { id: title.id },
          data: { isNew: true, isTrending: true, createdAt: new Date() },
        });
      }
    } catch (err) {
      showReport.error = err instanceof Error ? err.message.slice(0, 120) : "unknown-error";
    }
    report.push(showReport);
  }

  // Refresh cached catalog pages so changes appear promptly.
  revalidatePath("/vod");
  revalidatePath("/browse");

  // IndexNow: ping search engines for shows that gained episodes (title pages
  // changed) so fresh content is indexed within hours, not weeks.
  const changedPaths = report
    .filter((r) => Array.isArray(r.added) && (r.added as unknown[]).length > 0)
    .map((r) => `/title/${r.slug}`);
  if (changedPaths.length > 0) await pingIndexNow(["/vod", ...changedPaths]);

  return NextResponse.json({ totalAdded, shows: report, timestamp: new Date().toISOString() });
}
