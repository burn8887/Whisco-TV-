import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Weekly VOD discovery — keeps shelves fresh with the newest full-length
// uploads from distributor channels we have already vetted (official,
// embeddable, GCC-clean per the geo audit). Uses each channel's public RSS
// feed (latest ~15 uploads, no API key), applies the same strictness as the
// original harvest: junk-title exclusion, minimum duration, oEmbed
// embeddability AND GCC availability verification before insert.

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];
const TIMEOUT_MS = 12000;

// Vetted sources (subset of harvest sources that passed the GCC geo audit).
// key = sourceBatch tag; minDur in seconds.
const SOURCES: {
  key: string;
  channelId: string;
  brand: string;
  type: "MOVIE" | "DOCUMENTARY";
  collection: string;
  language: string;
  country: string;
  minDur: number;
}[] = [
  { key: "goldmines", channelId: "UCyoXW-Dse7fURq30EWl_CUA", brand: "Goldmines", type: "MOVIE", collection: "Hindi Cinema", language: "Hindi", country: "India", minDur: 4200 },
  { key: "shemaroo", channelId: "UCBOmfqgTZi7yDp4-3Lr_3lA", brand: "Shemaroo Movies", type: "MOVIE", collection: "Hindi Cinema", language: "Hindi", country: "India", minDur: 4200 },
  { key: "b4u_plus", channelId: "UC-4wTYoUqurS55YxTyoZ5dg", brand: "B4U Plus", type: "MOVIE", collection: "Hindi Cinema", language: "Hindi", country: "India", minDur: 4200 },
  { key: "harpalgeo", channelId: "UCe9JSDmyqNgA_l2BzGHq1Ug", brand: "HAR PAL GEO", type: "MOVIE", collection: "Pakistani Dramas", language: "Urdu", country: "Pakistan", minDur: 1800 },
  { key: "ary_digital", channelId: "UC4JCksJF76g_MdzPVBJoC3Q", brand: "ARY Digital", type: "MOVIE", collection: "Pakistani Dramas", language: "Urdu", country: "Pakistan", minDur: 1800 },
  { key: "hum_tv", channelId: "UCEeEQxm6qc_qaTE7qTV5aLQ", brand: "HUM TV", type: "MOVIE", collection: "Pakistani Dramas", language: "Urdu", country: "Pakistan", minDur: 1800 },
  { key: "banglavision", channelId: "UCsr6QVeLlkitleHoS0T4IxQ", brand: "Banglavision Drama", type: "MOVIE", collection: "Bangla Natok & Cinema", language: "Bengali", country: "Bangladesh", minDur: 1800 },
  { key: "abscbn", channelId: "UCstEtN0pgOmCf02EdXsGChw", brand: "ABS-CBN Entertainment", type: "MOVIE", collection: "Filipino Shows", language: "Filipino", country: "Philippines", minDur: 1000 },
  { key: "gma_network", channelId: "UCKL5hAuzgFQsyrsQKgU0Qng", brand: "GMA Network", type: "MOVIE", collection: "Filipino Shows", language: "Filipino", country: "Philippines", minDur: 1000 },
  { key: "indosiar", channelId: "UCYqOeAXJm8yV9sJ8Ud3cR7A", brand: "Indosiar", type: "MOVIE", collection: "Indonesian Shows", language: "Indonesian", country: "Indonesia", minDur: 1500 },
  { key: "family_feud", channelId: "UCt8jfvd9skBAOT6XJwc_mJg", brand: "Family Feud (Fremantle)", type: "MOVIE", collection: "Game Shows", language: "English", country: "USA", minDur: 480 },
  { key: "buzzr", channelId: "UCNkETBwkARrGDx-G7P-jLJg", brand: "BUZZR (Fremantle)", type: "MOVIE", collection: "Game Shows", language: "English", country: "USA", minDur: 1000 },
  { key: "dw_documentary", channelId: "UCW39zufHfsuGgpLviKh297Q", brand: "DW Documentary", type: "DOCUMENTARY", collection: "Documentaries", language: "English", country: "Germany", minDur: 1500 },
  { key: "real_stories", channelId: "UCu4XcDBdnZkV6-5z2f16M0g", brand: "Real Stories", type: "DOCUMENTARY", collection: "Documentaries", language: "English", country: "UK", minDur: 1800 },
  { key: "melody_aflam", channelId: "UCSv7clgCIk0CBqCPI3yfX7Q", brand: "Melody Aflam", type: "MOVIE", collection: "Arabic Series & Shows", language: "Arabic", country: "Egypt", minDur: 3600 },
  { key: "millennium_cinemas", channelId: "UCrtwzlQDYRs4vReNd_Ro91w", brand: "Millennium Cinemas", type: "MOVIE", collection: "Malayalam Cinema", language: "Malayalam", country: "India", minDur: 4800 },
];

const EXCLUDE = /trailer|teaser|promo|preview|clip|scene|best of|compilation|shorts|#shorts|behind the scenes|interview|song|jukebox|audio|lyrical|making of|recap|highlight|coming soon|first look|title track|video song|full song|ost|precap|upcoming|spoiler|live stream|पूजा|आरती/i;

async function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-VODDiscovery)" }, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

function parseFeed(xml: string): { videoId: string; title: string }[] {
  const out: { videoId: string; title: string }[] = [];
  for (const block of xml.split("<entry>").slice(1)) {
    const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = block
      .match(/<title>([^<]*)<\/title>/)?.[1]
      ?.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    if (id && title) out.push({ videoId: id, title });
  }
  return out;
}

async function isEmbeddable(videoId: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`);
    return res.ok;
  } catch {
    return false;
  }
}

// duration + GCC availability from the watch page (single fetch for both)
async function watchPageInfo(videoId: string): Promise<{ durationSecs: number | null; gccOk: boolean | null }> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/watch?v=${videoId}&hl=en`);
    if (!res.ok) return { durationSecs: null, gccOk: null };
    const html = await res.text();
    if (!html.includes("playabilityStatus")) return { durationSecs: null, gccOk: null };
    const dur = html.match(/"lengthSeconds":"(\d+)"/)?.[1];
    const m = html.match(/"availableCountries":\[([^\]]*)\]/);
    const gccOk = m ? GCC.some((c) => m[1].replace(/"/g, "").split(",").includes(c)) : true;
    return { durationSecs: dur ? parseInt(dur, 10) : null, gccOk };
  } catch {
    return { durationSecs: null, gccOk: null };
  }
}

function slugify(s: string): string {
  return (
    s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").toLowerCase().slice(0, 70) || "title"
  );
}

function cleanName(raw: string): string {
  let s = raw;
  const cut = s.replace(/\s*[|@#].*$/, "");
  if (cut.length >= 8) s = cut;
  return s.replace(/\s+/g, " ").trim().slice(0, 140);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let totalAdded = 0;
  const report: Record<string, unknown>[] = [];

  for (const src of SOURCES) {
    const srcReport: Record<string, unknown> = { key: src.key, added: 0, skipped: [] as string[] };
    try {
      const feedRes = await fetchWithTimeout(`https://www.youtube.com/feeds/videos.xml?channel_id=${src.channelId}`);
      if (!feedRes.ok) {
        srcReport.error = `feed-${feedRes.status}`;
        report.push(srcReport);
        continue;
      }
      const entries = parseFeed(await feedRes.text()).filter((e) => !EXCLUDE.test(e.title));

      for (const e of entries) {
        const streamUrl = `https://www.youtube.com/embed/${e.videoId}`;
        const exists = await prisma.title.findFirst({ where: { streamUrl }, select: { id: true } });
        if (exists) continue;

        if (!(await isEmbeddable(e.videoId))) continue;
        const { durationSecs, gccOk } = await watchPageInfo(e.videoId);
        if (durationSecs !== null && durationSecs < src.minDur) continue;
        if (durationSecs === null) continue; // can't confirm it's full-length — skip, never guess
        if (gccOk === false) {
          (srcReport.skipped as string[]).push(`${e.title.slice(0, 40)} (geo)`);
          continue;
        }

        const name = cleanName(e.title);
        let slug = slugify(name);
        if (await prisma.title.findUnique({ where: { slug }, select: { id: true } })) {
          slug = `${slug.slice(0, 60)}-${e.videoId.slice(0, 6).toLowerCase()}`;
          if (await prisma.title.findUnique({ where: { slug }, select: { id: true } })) continue;
        }

        await prisma.title.create({
          data: {
            name,
            slug,
            type: src.type,
            synopsis: `${name} — full-length ${src.type.toLowerCase()} from ${src.brand}'s official channel. Free and ad-supported on Whisco TV.`,
            posterUrl: `https://i.ytimg.com/vi/${e.videoId}/hqdefault.jpg`,
            backdropUrl: `https://i.ytimg.com/vi/${e.videoId}/maxresdefault.jpg`,
            releaseYear: new Date().getFullYear(),
            rating: "PG-13",
            imdbRating: 6.5,
            durationMins: Math.max(1, Math.round(durationSecs / 60)),
            genres: src.collection,
            collection: src.collection,
            cast: "",
            director: src.brand,
            country: src.country,
            language: src.language,
            streamUrl,
            isActive: true,
            isNew: true,
            lastStatus: "ok",
            lastCheckedAt: new Date(),
          },
        });
        (srcReport.added as number) = (srcReport.added as number) + 1;
        totalAdded++;
      }
    } catch (err) {
      srcReport.error = err instanceof Error ? err.message.slice(0, 80) : "unknown";
    }
    report.push(srcReport);
  }

  if (totalAdded) {
    revalidatePath("/vod");
    revalidatePath("/browse");
  }

  return NextResponse.json({ totalAdded, sources: report, timestamp: new Date().toISOString() });
}
