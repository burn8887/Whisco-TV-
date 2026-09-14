/**
 * STAGE A — channel map via oEmbed (2026-09-14)
 *
 * Geo-blocks on YouTube are set per-uploader, not per-video (the Aug 2026 fix
 * hid "FilmRise / Shout!" as whole-brand catalogs). So instead of burning a
 * rate-limited watch-page probe on all 8,732 titles, map every title to its
 * channel with oEmbed (a different, cheap service that is NOT rate-limiting us)
 * and probe ONE video per channel afterwards.
 *
 * Also a free liveness signal: oEmbed 401/403/404 == embedding disabled or
 * video gone.
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

const p = new PrismaClient();
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};
const CONCURRENCY = 6;
const OUT = "/home/user/channel_map.json";
const ytId = (u) => {
  const m = (u || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

let consecutiveBad = 0;
let aborted = false;

async function oembed(id) {
  for (let a = 0; a < 2; a++) {
    try {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
        { headers: UA, signal: AbortSignal.timeout(15000) }
      );
      if (r.status === 429) {
        consecutiveBad++;
        await new Promise((res) => setTimeout(res, 4000 * (a + 1)));
        continue;
      }
      if (r.status === 401 || r.status === 403 || r.status === 404) {
        consecutiveBad = 0;
        return { dead: true, status: r.status };
      }
      if (!r.ok) {
        consecutiveBad++;
        return { unknown: true, status: r.status };
      }
      const j = await r.json();
      consecutiveBad = 0;
      return { author: j.author_name || "(unknown channel)", title: j.title || "" };
    } catch {
      consecutiveBad++;
      await new Promise((res) => setTimeout(res, 1500));
    }
  }
  return { unknown: true };
}

const started = Date.now();
const channels = {};
const dead = [];
const unknown = [];
let done = 0;

try {
  const cut = new Date(Date.now() - 7 * 86400000);
  const titles = await p.title.findMany({
    where: {
      isActive: true,
      OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: cut } }],
      NOT: { lastStatus: { startsWith: "geo" } },
    },
    orderBy: { lastCheckedAt: "asc" },
    select: {
      slug: true, name: true, type: true, collection: true, streamUrl: true,
      seasons: { select: { episodes: { select: { streamUrl: true }, take: 1 } } },
    },
  });
  console.log(`[stageA] mapping ${titles.length} titles to channels via oEmbed (concurrency ${CONCURRENCY})`);

  let next = 0;
  async function worker() {
    while (next < titles.length && !aborted) {
      const t = titles[next++];
      let ids = [];
      if (t.type === "SERIES") {
        ids = t.seasons.flatMap((s) => s.episodes.map((e) => ytId(e.streamUrl))).filter(Boolean);
      } else {
        const one = ytId(t.streamUrl);
        if (one) ids = [one];
      }
      if (!ids.length) {
        (channels["(non-YouTube)"] ||= { count: 0, slugs: [] }).count++;
        channels["(non-YouTube)"].slugs.push(t.slug);
        done++;
        continue;
      }
      const sampleId = ids[0];
      const res = await oembed(sampleId);
      if (res.dead) {
        dead.push({ slug: t.slug, name: t.name, collection: t.collection, videoId: sampleId, status: res.status });
      } else if (res.unknown) {
        unknown.push({ slug: t.slug, name: t.name });
      } else {
        const c = (channels[res.author] ||= { count: 0, slugs: [], sampleId, collection: t.collection });
        c.count++;
        c.slugs.push(t.slug);
      }
      done++;
      if (done % 250 === 0) {
        const el = (Date.now() - started) / 1000;
        console.log(`[progress] ${done}/${titles.length} | channels=${Object.keys(channels).length} dead=${dead.length} unknown=${unknown.length} | ${(done / el).toFixed(1)}/s`);
        fs.writeFileSync(OUT, JSON.stringify({ status: "running", done, channels, dead, unknown }, null, 2));
      }
      if (consecutiveBad >= 25) {
        console.log(`[ABORT] ${consecutiveBad} consecutive bad oEmbed responses — likely rate-limited.`);
        aborted = true;
        break;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const ranked = Object.entries(channels).sort((a, b) => b[1].count - a[1].count);
  const summary = {
    status: aborted ? "aborted" : "complete",
    finished: new Date().toISOString(),
    elapsedMinutes: +((Date.now() - started) / 60000).toFixed(1),
    totalTitles: titles.length,
    mapped: done - dead.length - unknown.length,
    channelCount: ranked.length,
    deadCount: dead.length,
    unknownCount: unknown.length,
    topChannels: ranked.slice(0, 40).map(([name, v]) => ({ channel: name, titles: v.count, sample: v.sampleId })),
    channels,
    dead,
    unknown,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));

  console.log("\n============ STAGE A — CHANNEL MAP ============");
  console.log(`mapped titles : ${summary.mapped} / ${titles.length}`);
  console.log(`channels      : ${summary.channelCount}`);
  console.log(`dead videos   : ${dead.length}`);
  console.log(`unknown       : ${unknown.length}`);
  console.log(`elapsed       : ${summary.elapsedMinutes} min`);
  console.log("TOP CHANNELS BY TITLE COUNT:");
  for (const r of summary.topChannels) console.log(`  ${String(r.titles).padStart(5)}  ${r.channel}  (sample ${r.sample})`);
  console.log(`-> ${OUT}`);
  console.log("===============================================");
} catch (e) {
  console.error("FATAL", e.message);
  fs.writeFileSync(OUT, JSON.stringify({ status: "fatal", error: e.message, channels, dead, unknown }, null, 2));
} finally {
  await p.$disconnect();
}
