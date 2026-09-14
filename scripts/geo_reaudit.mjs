/**
 * WHISCO TV — GEO RE-AUDIT (ops script, 2026-09-14)
 *
 * Purpose: verify, per title, whether a YouTube-embedded title is actually
 * watchable in the Gulf, and hide the ones that are not. Founder-approved as a
 * one-off data fix after the 2026-09-14 geo-exposure finding.
 *
 * Why it exists: the production VOD health sweep records a GCC block as
 * "invalid" and no longer writes any "geo" status, so ~2,300 previously
 * geo-hidden titles could drift back onto the site (Leyla, Kızılcık Şerbeti,
 * Sahipsizler were all live when this was found). The permanent code fix
 * ships separately; this script closes the gap before the AdSense review
 * window (Sep 17-19).
 *
 * SAFETY RULES (founder-mandated):
 *  - per-title verification before EVERY write: a title is only hidden when a
 *    SECOND independent probe also returns BLOCKED
 *  - NEVER write on "unknown" (consent stub / 429 / timeout)
 *  - dead videos are classified via oEmbed first (the geo signal only tells us
 *    about licensing, not liveness) and are reported, never hidden, by THIS
 *    script — hiding dead streams is the production sweep's job
 *  - rate-limit circuit breaker: HTTP 429/403 and unreadable pages both count;
 *    the run pauses and then aborts rather than grinding through on garbage
 *
 * Writes ONLY: isActive=false, lastStatus="geo", failCount=0 on confirmed titles.
 * Verified-available titles get lastCheckedAt refreshed (they genuinely were
 * checked just now) so the production rotation doesn't re-probe them next run.
 *
 * Usage:  node scripts/geo_reaudit.mjs [limit] [dryRun]
 *   limit   max titles to examine this run (default 400)
 *   dryRun  "true" = report only, write nothing (default false)
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

const p = new PrismaClient();
const LIMIT = Number(process.argv[2] || 400);
const DRY = String(process.argv[3] || "false").toLowerCase() === "true";

const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};
const CONCURRENCY = 4;
const OUT = "/tmp/geo_reaudit_results.json";
const ytId = (u) => {
  const m = (u || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

const stats = { probes: 0, http429: 0, unreadable: 0, consecutiveBad: 0, paused: 0 };

/** Verdict for ONE video: 'ok' | 'blocked' | 'dead' | 'unknown' */
async function probeVideo(id) {
  stats.probes++;
  // 1. liveness via oEmbed (same signal the production sweep trusts)
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { headers: UA, signal: AbortSignal.timeout(15000) }
    );
    if (r.status === 401 || r.status === 403 || r.status === 404) return "dead";
  } catch {
    /* fall through to the geo probe */
  }
  // 2. GCC availability via the watch page
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
        headers: UA,
        signal: AbortSignal.timeout(20000),
      });
      if (r.status === 429 || r.status === 403) {
        stats.http429++;
        stats.consecutiveBad++;
        await new Promise((res) => setTimeout(res, 5000 * (attempt + 1)));
        continue;
      }
      if (!r.ok) {
        stats.consecutiveBad++;
        return "unknown";
      }
      const html = await r.text();
      if (!html.includes("playabilityStatus")) {
        stats.unreadable++;
        stats.consecutiveBad++;
        return "unknown";
      }
      stats.consecutiveBad = 0;
      const m = html.match(/"availableCountries":\[([^\]]*)\]/);
      if (!m) return "ok";
      const list = m[1].replace(/"/g, "").split(",");
      return GCC.some((c) => list.includes(c)) ? "ok" : "blocked";
    } catch {
      stats.consecutiveBad++;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
  return "unknown";
}

/** Two independent BLOCKED readings required. Any doubt -> not hidden. */
async function classify(id) {
  const a = await probeVideo(id);
  if (a !== "blocked") return a;
  await new Promise((r) => setTimeout(r, 1500));
  const b = await probeVideo(id);
  if (b === "blocked") return "blocked";
  return b === "ok" ? "ok" : "unknown";
}

const started = Date.now();
const results = {
  started: new Date().toISOString(),
  dryRun: DRY,
  limit: LIMIT,
  examined: 0,
  ok: 0,
  dead: [],
  blocked: [],
  partial: [],
  unknown: 0,
  noYouTube: [],
  errors: [],
  aborted: null,
};

const report = (note) => {
  try {
    fs.writeFileSync(OUT, JSON.stringify({ ...results, stats, note }, null, 2));
  } catch {}
  return OUT;
};

try {
  const cut = new Date(Date.now() - 7 * 86400000);
  const titles = await p.title.findMany({
    where: {
      isActive: true,
      OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: cut } }],
      NOT: { lastStatus: { startsWith: "geo" } }, // already resolved geo titles: skip
    },
    orderBy: { lastCheckedAt: "asc" },
    take: LIMIT,
    select: {
      id: true, slug: true, name: true, type: true, collection: true,
      streamUrl: true, lastStatus: true, lastCheckedAt: true,
      seasons: { select: { episodes: { select: { streamUrl: true }, take: 3 } } },
    },
  });

  console.log(`[start] examining ${titles.length} titles (limit ${LIMIT}) | dryRun=${DRY} | concurrency ${CONCURRENCY}`);
  let next = 0;
  let done = 0;

  async function worker() {
    while (next < titles.length && !results.aborted) {
      const t = titles[next++];
      let ids = [];
      if (t.type === "SERIES") {
        ids = t.seasons.flatMap((s) => s.episodes.map((e) => ytId(e.streamUrl))).filter(Boolean).slice(0, 3);
      } else {
        const one = ytId(t.streamUrl);
        if (one) ids = [one];
      }

      if (!ids.length) {
        results.noYouTube.push(t.slug);
      } else {
        const verdicts = [];
        for (const id of ids) verdicts.push(await classify(id));
        const blocked = verdicts.filter((v) => v === "blocked").length;
        const ok = verdicts.filter((v) => v === "ok").length;
        const dead = verdicts.filter((v) => v === "dead").length;
        const unk = verdicts.filter((v) => v === "unknown").length;

        if (dead > 0 && ok === 0 && blocked === 0) {
          results.dead.push({ slug: t.slug, name: t.name, collection: t.collection, lastStatus: t.lastStatus });
        } else if (blocked > 0 && ok === 0 && unk === 0 && dead === 0) {
          try {
            if (!DRY) {
              await p.title.update({
                where: { id: t.id },
                data: { isActive: false, lastStatus: "geo", failCount: 0 },
              });
            }
            results.blocked.push({
              slug: t.slug, name: t.name, collection: t.collection,
              episodesSampled: ids.length, verdicts,
              lastCheckedAt: t.lastCheckedAt?.toISOString() ?? null, wasStatus: t.lastStatus,
            });
            console.log(`[HIDDEN${DRY ? "-DRYRUN" : ""}] ${t.slug} | ${t.name.slice(0, 45)} | ${t.collection}`);
          } catch (e) {
            results.errors.push({ slug: t.slug, error: e.message.split("\n")[0] });
          }
        } else if (blocked > 0 && ok > 0) {
          results.partial.push({ slug: t.slug, name: t.name, collection: t.collection, verdicts });
          console.log(`[PARTIAL] ${t.slug} | ${t.name.slice(0, 45)} | ${verdicts.join(",")}`);
        } else if (blocked === 0 && ok > 0) {
          results.ok++;
          // verified available just now -> refresh so the rotation moves on
          try {
            if (!DRY) {
              await p.title.update({ where: { id: t.id }, data: { lastStatus: "ok", lastCheckedAt: new Date() } });
            }
          } catch (e) {
            results.errors.push({ slug: t.slug, error: e.message.split("\n")[0] });
          }
        } else {
          results.unknown++;
        }
      }

      done++;
      results.examined = done;
      if (done % 50 === 0) {
        const el = (Date.now() - started) / 1000;
        console.log(
          `[progress] ${done}/${titles.length} | ok=${results.ok} hidden=${results.blocked.length} partial=${results.partial.length} dead=${results.dead.length} unknown=${results.unknown} | 429s=${stats.http429} | ${((done / el)).toFixed(2)}/s`
        );
        report("running");
      }

      // rate-limit protection: pause, then abort if it keeps happening
      if (stats.consecutiveBad >= 25) {
        stats.paused++;
        console.log(`[pause] ${stats.consecutiveBad} consecutive unreadable/429 responses — sleeping 90s (pause #${stats.paused})`);
        await new Promise((r) => setTimeout(r, 90000));
        if (stats.consecutiveBad >= 25) {
          console.log(`[ABORT] still rate-limited after pause — stopping to protect data quality.`);
          results.aborted = `rate-limited after ${stats.paused} pause(s); ${stats.http429} HTTP 429s`;
          break;
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const geoRows = await p.title.count({ where: { lastStatus: "geo" } });
  const inactive = await p.title.count({ where: { isActive: false } });
  const summary = {
    ...results,
    finished: new Date().toISOString(),
    elapsedMinutes: +((Date.now() - started) / 60000).toFixed(1),
    stats,
    db_geoStatusTotal: geoRows,
    db_inactiveTitlesTotal: inactive,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));

  console.log("\n================= GEO RE-AUDIT SUMMARY =================");
  console.log(`examined          : ${results.examined}`);
  console.log(`ok (GCC-available): ${results.ok}`);
  console.log(`HIDDEN (geo)      : ${results.blocked.length}${DRY ? " (DRY RUN — nothing written)" : ""}`);
  console.log(`partial           : ${results.partial.length}`);
  console.log(`dead (reported)   : ${results.dead.length}`);
  console.log(`unknown           : ${results.unknown}`);
  console.log(`non-YouTube       : ${results.noYouTube.length}`);
  console.log(`YouTube probes    : ${stats.probes} | HTTP 429s: ${stats.http429} | pauses: ${stats.paused}`);
  console.log(`elapsed           : ${summary.elapsedMinutes} min`);
  console.log(`DB: lastStatus='geo' rows = ${geoRows} | inactive titles = ${inactive}`);
  if (results.aborted) console.log(`ABORTED: ${results.aborted}`);
  console.log("HIDDEN SLUGS:");
  for (const b of results.blocked) console.log(`  - ${b.slug}  ::  ${b.name}  ::  ${b.collection}`);
  if (results.partial.length) {
    console.log("PARTIAL (left visible, needs a human call):");
    for (const x of results.partial) console.log(`  - ${x.slug}  ::  ${x.name}  ::  ${x.verdicts.join(",")}`);
  }
  console.log("=======================================================");
} catch (e) {
  console.error("FATAL", e.message);
  fs.writeFileSync(OUT, JSON.stringify({ ...results, status: "fatal", error: e.message }, null, 2));
  process.exitCode = 1;
} finally {
  await p.$disconnect();
}
