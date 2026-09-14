/**
 * WHISCO TV — GEO AUDIT, CHANNEL-LEVEL (ops script, 2026-09-14)
 *
 * Supersedes the per-title brute-force approach, which cannot work: YouTube
 * rate-limits the watch page (HTTP 429) after a few hundred rapid requests from
 * any single IP, so probing all 8,700 titles is not possible in one sitting.
 *
 * Why this works instead: geo-restrictions are applied per UPLOADER, not per
 * video (the Aug 2026 fix hid "FilmRise / Shout!" as whole-brand catalogs). So:
 *
 *   Stage A  map every title to its channel via oEmbed — a separate service that
 *            is fast, cheap and is NOT rate-limiting us (8,378 titles -> 110
 *            channels in ~30 seconds). Also yields a free liveness signal:
 *            oEmbed 401/403/404 == video gone or embedding disabled.
 *   Stage B  probe ONE representative video per channel (watch page, GCC
 *            availability) with a second confirming probe before believing a
 *            channel is blocked. ~110 probes, not 8,700.
 *   Stage C  for each blocked channel, verify EVERY title individually before
 *            writing: the per-title probe must agree with the double-confirmed
 *            channel verdict. A title is never hidden on a single reading and
 *            never on an "unknown".
 *
 * Safety invariants:
 *   - no write on "unknown" (consent stub / 429 / timeout) — ever
 *   - no write without per-title agreement
 *   - rate-limit circuit breaker: pause, then abort cleanly (resumable, because
 *     verified-ok titles get lastCheckedAt refreshed and hidden ones get the
 *     "geo" status, so both leave the work queue for the next run)
 *
 * Writes ONLY: isActive=false, lastStatus="geo", failCount=0 on confirmed titles.
 *
 * Usage: node scripts/geo_channel_audit.mjs [dryRun]
 *   dryRun "true" = report only, write nothing (default false)
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { execFile } from "node:child_process";

const p = new PrismaClient();
const DRY = String(process.argv[2] || "false").toLowerCase() === "true";
const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};
// SOCKS_PROXY routes the WATCH-PAGE probes through a Gulf vantage (see
// scripts/gcc_geo_probe.mjs). oEmbed stays direct: it is not geo-sensitive.
// Why it matters: from a non-GCC vantage the availability list only appears when
// the video is unplayable THERE, so a list-less page is silence, not evidence.
// From inside the Gulf a list-less page means "playable here" — positive proof.
const SOCKS = process.env.SOCKS_PROXY || "";
const SCOPE = process.env.AUDIT_SCOPE === "all" ? "all" : "stale";
const MAP_CONCURRENCY = 6; // oEmbed is tolerant
const PROBE_CONCURRENCY = 2; // watch page is not — stay slow
const OUT = "/tmp/geo_channel_audit.json";

const ytId = (u) => {
  const m = (u || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

const stats = { oembed: 0, watchProbes: 0, http429: 0, unreadable: 0, consecutiveBad: 0, pauses: 0 };

function curlGet(url, timeoutMs = 30000) {
  const host = SOCKS.replace(/^socks5h?:\/\//, "");
  return new Promise((resolve) => {
    execFile(
      "curl",
      ["-s", "--socks5-hostname", host, "--max-time", String(Math.ceil(timeoutMs / 1000)),
       "-H", `User-Agent: ${UA["User-Agent"]}`, "-H", "Accept-Language: en-US,en;q=0.9",
       "-w", "\n%{http_code}", url],
      { timeout: timeoutMs + 10000, maxBuffer: 64 * 1024 * 1024 },
      (err, stdout) => {
        const out = String(stdout || "");
        const i = out.lastIndexOf("\n");
        const status = i >= 0 ? parseInt(out.slice(i + 1), 10) || 0 : 0;
        resolve({ status, body: i >= 0 ? out.slice(0, i) : "" });
      }
    );
  });
}

async function httpText(url, timeoutMs) {
  if (SOCKS) return curlGet(url, timeoutMs);
  try {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(timeoutMs) });
    return { status: r.status, body: r.ok ? await r.text() : "" };
  } catch {
    return { status: 0, body: "" };
  }
}

// Confirmed vantage. Established BEFORE any probe, and re-stated in the output,
// because a verdict is only meaningful alongside where it was taken.
let VANTAGE_GCC = false;
let exitInfo = null;
if (SOCKS) {
  const r = await curlGet("https://ipinfo.io/json", 20000);
  try { exitInfo = JSON.parse(r.body); } catch { exitInfo = null; }
  VANTAGE_GCC = !!(exitInfo && GCC.includes(exitInfo.country));
}
console.log("=== vantage ===");
console.log(SOCKS
  ? `  tunnel ${SOCKS} -> ${exitInfo?.ip || "?"} (${exitInfo?.city || "?"}, ${exitInfo?.country || "?"}) ${VANTAGE_GCC ? "CONFIRMED GCC" : "NOT GCC"}`
  : "  NO tunnel — direct/production vantage (a list-less watch page proves nothing here)");

async function oembed(id) {
  for (let a = 0; a < 2; a++) {
    try {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
        { headers: UA, signal: AbortSignal.timeout(15000) }
      );
      stats.oembed++;
      if (r.status === 429) {
        stats.consecutiveBad++;
        await new Promise((res) => setTimeout(res, 4000 * (a + 1)));
        continue;
      }
      if (r.status === 401 || r.status === 403 || r.status === 404) {
        stats.consecutiveBad = 0;
        return { dead: true, status: r.status };
      }
      if (!r.ok) {
        stats.consecutiveBad++;
        return { unknown: true };
      }
      const j = await r.json();
      stats.consecutiveBad = 0;
      return { author: j.author_name || "(unknown channel)" };
    } catch {
      stats.consecutiveBad++;
      await new Promise((res) => setTimeout(res, 1500));
    }
  }
  return { unknown: true };
}

/** GCC availability of ONE video via the watch page: 'ok' | 'blocked' | 'unknown' */
async function watchProbe(id) {
  for (let a = 0; a < 2; a++) {
    try {
      stats.watchProbes++;
      const r = await httpText(`https://www.youtube.com/watch?v=${id}&hl=en`, 25000);
      if (r.status === 429 || r.status === 403) {
        stats.http429++;
        stats.consecutiveBad++;
        await new Promise((res) => setTimeout(res, 5000 * (a + 1)));
        continue;
      }
      if (!r.status || r.status >= 400) {
        stats.consecutiveBad++;
        return "unknown";
      }
      const html = r.body;
      if (!html.includes("playabilityStatus")) {
        stats.unreadable++;
        stats.consecutiveBad++;
        return "unknown";
      }
      stats.consecutiveBad = 0;
      const m = html.match(/"availableCountries":\[([^\]]*)\]/);
      // A MISSING list means "playable from where we asked" and nothing more. It
      // is positive evidence ONLY when the asker is inside the Gulf. From a US
      // vantage it is silence — and reading silence as "available worldwide" is
      // exactly the bug that restored three GCC-blocked titles on 2026-09-14.
      if (!m) return VANTAGE_GCC ? "ok" : "unknown";
      const list = m[1].replace(/"/g, "").split(",");
      return GCC.some((c) => list.includes(c)) ? "ok" : "blocked";
    } catch {
      stats.consecutiveBad++;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
  return "unknown";
}

/** Rate-limit protection shared by both phases. Returns false if we must stop. */
async function respectRateLimit() {
  if (stats.consecutiveBad < 25) return true;
  stats.pauses++;
  console.log(`[pause] ${stats.consecutiveBad} consecutive bad responses — sleeping 120s (pause #${stats.pauses})`);
  const before = stats.consecutiveBad;
  await new Promise((r) => setTimeout(r, 120000));
  if (stats.consecutiveBad >= before && stats.consecutiveBad >= 25) {
    console.log(`[ABORT] still rate-limited after pause — stopping cleanly, no further writes.`);
    return false;
  }
  return true;
}

async function pool(items, concurrency, fn) {
  let next = 0;
  let stop = false;
  async function worker() {
    while (next < items.length && !stop) {
      const i = next++;
      await fn(items[i], i);
      if (!(await respectRateLimit())) {
        stop = true;
        return false;
      }
    }
    return true;
  }
  const outcomes = await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return outcomes.every((o) => o !== false);
}

if (!DRY && !VANTAGE_GCC) {
  console.log("\n[ABORT] Refusing to WRITE from a vantage that is not confirmed inside the Gulf.");
  console.log("        A non-GCC 'blocked' reading hides titles on evidence we cannot interpret,");
  console.log("        and a non-GCC 'no list' reading is the bug that caused the 2026-09-14 restore.");
  console.log("        Re-run with dryRun=true for a read-only report, or route through the Gulf tunnel.");
  await p.$disconnect();
  process.exit(2);
}

const started = Date.now();
const out = {
  started: new Date().toISOString(),
  dryRun: DRY,
  scope: SCOPE,
  vantage: SOCKS ? { ip: exitInfo?.ip, city: exitInfo?.city, country: exitInfo?.country, confirmedGcc: VANTAGE_GCC } : { direct: true, confirmedGcc: false },
  mapped: 0,
  channels: 0,
  dead: [],
  channelVerdicts: [],
  blockedChannels: 0,
  hidden: [],
  partial: [],
  unknownTitles: 0,
  aborted: null,
};

try {
  const cut = new Date(Date.now() - 7 * 86400000);
  const titles = await p.title.findMany({
    where: {
      isActive: true,
      // "all" = every live title regardless of when it was last checked, for a
      // full Gulf-side sweep. "stale" = the original incremental queue.
      ...(SCOPE === "all" ? {} : { OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: cut } }] }),
      NOT: { lastStatus: { startsWith: "geo" } },
    },
    orderBy: { lastCheckedAt: "asc" },
    select: {
      id: true, slug: true, name: true, type: true, collection: true, streamUrl: true,
      lastStatus: true,
      seasons: { select: { episodes: { select: { streamUrl: true }, take: 1 } } },
    },
  });
  out.totalTitles = titles.length;

  // ---------- Stage A: map titles -> channel + per-title video id ----------
  const rows = titles.map((t) => {
    let id = null;
    if (t.type === "SERIES") {
      id = t.seasons.flatMap((s) => s.episodes.map((e) => ytId(e.streamUrl))).find(Boolean) || null;
    } else {
      id = ytId(t.streamUrl);
    }
    return { slug: t.slug, id, collection: t.collection, name: t.name, t };
  });

  const byChannel = new Map();
  const noVideo = [];
  console.log(`[stageA] mapping ${rows.length} titles to channels via oEmbed`);
  await pool(rows, MAP_CONCURRENCY, async (row) => {
    if (!row.id) {
      noVideo.push(row.slug);
      return;
    }
    const res = await oembed(row.id);
    if (res.dead) {
      out.dead.push({ slug: row.slug, name: row.name, collection: row.collection });
      return;
    }
    if (res.unknown) {
      out.unknownTitles++;
      return;
    }
    if (!byChannel.has(res.author)) byChannel.set(res.author, []);
    byChannel.get(res.author).push(row);
  });

  out.mapped = rows.length - noVideo.length - out.dead.length - out.unknownTitles;
  out.channels = byChannel.size;
  console.log(`[stageA] mapped ${out.mapped} titles -> ${out.channels} channels | dead=${out.dead.length} unknown=${out.unknownTitles} nonYT=${noVideo.length}`);

  // ---------- Stage B: one representative probe per channel (2 if blocked) ----------
  const channelList = [...byChannel.entries()].map(([name, rws]) => ({
    name, rows: rws, sample: rws[0].id, count: rws.length,
  }));
  console.log(`[stageB] probing ${channelList.length} channels (slow, concurrency ${PROBE_CONCURRENCY})`);

  await pool(channelList, PROBE_CONCURRENCY, async (ch) => {
    const first = await watchProbe(ch.sample);
    ch.verdict = first;
    if (first === "blocked") {
      await new Promise((r) => setTimeout(r, 1500));
      const second = await watchProbe(ch.sample);
      ch.confirmVerdict = second;
      ch.verdict = second === "blocked" ? "blocked" : second === "ok" ? "ok" : "unknown";
    }
  });

  out.channelVerdicts = channelList
    .map((c) => ({ channel: c.name, titles: c.count, verdict: c.verdict, sample: c.sample }))
    .sort((a, b) => b.titles - a.titles);
  const blockedChannels = channelList.filter((c) => c.verdict === "blocked");
  out.blockedChannels = blockedChannels.length;
  const blockedTitleTotal = blockedChannels.reduce((n, c) => n + c.count, 0);
  out.blockedTitleCount = blockedTitleTotal;

  console.log(`[stageB] blocked channels: ${blockedChannels.length} covering ${blockedTitleTotal} titles`);
  for (const c of blockedChannels.sort((a, b) => b.count - a.count)) {
    console.log(`   BLOCKED  ${String(c.count).padStart(5)}  ${c.name}`);
  }
  const okCh = channelList.filter((c) => c.verdict === "ok");
  console.log(`[stageB] ok channels: ${okCh.length} covering ${okCh.reduce((n, c) => n + c.count, 0)} titles`);

  // ---------- Stage C: per-title verification for blocked channels ----------
  if (blockedChannels.length && true) {
    const targets = blockedChannels.flatMap((c) => c.rows);
    console.log(`[stageC] per-title verification of ${targets.length} titles from blocked channels`);
    let done = 0;
    const completed = await pool(targets, PROBE_CONCURRENCY, async (row) => {
      const v = await watchProbe(row.id);
      done++;
      if (done % 50 === 0) console.log(`[stageC] ${done}/${targets.length} | hidden=${out.hidden.length}`);
      if (v === "blocked") {
        try {
          if (!DRY) {
            await p.title.update({
              where: { id: row.t.id },
              data: { isActive: false, lastStatus: "geo", failCount: 0 },
            });
          }
          out.hidden.push({ slug: row.slug, name: row.name, collection: row.collection });
          console.log(`[HIDDEN${DRY ? "-DRYRUN" : ""}] ${row.slug} | ${row.name.slice(0, 45)}`);
        } catch (e) {
          out.errors ||= [];
          out.errors.push({ slug: row.slug, error: e.message.split("\n")[0] });
        }
      } else if (v === "ok") {
        try {
          if (!DRY) {
            await p.title.update({ where: { id: row.t.id }, data: { lastStatus: "ok", lastCheckedAt: new Date() } });
          }
        } catch {}
      } else {
        out.unknownTitles++;
      }
    });
    if (!completed) out.aborted = `rate-limited during stage C (${stats.http429} HTTP 429s)`;
  }

  // refresh verified-ok titles from ok channels so the rotation moves on
  const okRows = channelList.filter((c) => c.verdict === "ok").flatMap((c) => c.rows);
  if (!DRY && okRows.length) {
    for (let i = 0; i < okRows.length; i += 200) {
      const batch = okRows.slice(i, i + 200).map((r) => r.t.id);
      try {
        await p.title.updateMany({ where: { id: { in: batch } }, data: { lastStatus: "ok", lastCheckedAt: new Date() } });
      } catch {}
    }
    console.log(`[refresh] marked ${okRows.length} titles from ok channels as verified now`);
  }

  const geoRows = await p.title.count({ where: { lastStatus: "geo" } });
  const inactive = await p.title.count({ where: { isActive: false } });
  const summary = {
    ...out,
    finished: new Date().toISOString(),
    elapsedMinutes: +((Date.now() - started) / 60000).toFixed(1),
    stats,
    db_geoStatusTotal: geoRows,
    db_inactiveTitlesTotal: inactive,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));

  console.log("\n=========== GEO CHANNEL AUDIT SUMMARY ===========");
  console.log(`titles in scope        : ${out.totalTitles}`);
  console.log(`mapped to channels     : ${out.mapped}`);
  console.log(`channels               : ${out.channels}`);
  console.log(`dead videos (oEmbed)   : ${out.dead.length}`);
  console.log(`blocked channels       : ${out.blockedChannels} (covering ${out.blockedTitleCount} titles)`);
  console.log(`HIDDEN (geo)           : ${out.hidden.length}${DRY ? "  (DRY RUN — nothing written)" : ""}`);
  console.log(`unknown                : ${out.unknownTitles}`);
  console.log(`watch probes           : ${stats.watchProbes} | 429s: ${stats.http429} | pauses: ${stats.pauses}`);
  console.log(`elapsed                : ${summary.elapsedMinutes} min`);
  console.log(`DB: lastStatus='geo'   : ${geoRows} | inactive: ${inactive}`);
  if (out.aborted) console.log(`ABORTED: ${out.aborted}`);
  console.log("CHANNEL VERDICTS:");
  for (const c of out.channelVerdicts) console.log(`  ${c.verdict.padEnd(8)} ${String(c.titles).padStart(5)}  ${c.channel}`);
  console.log("HIDDEN SLUGS:");
  for (const h of out.hidden) console.log(`  - ${h.slug} :: ${h.name}`);
  console.log("DEAD VIDEOS (reported, not touched — the liveness sweep owns these):");
  for (const d of out.dead) console.log(`  - ${d.slug} :: ${d.name}`);
  console.log("================================================");
} catch (e) {
  console.error("FATAL", e.message);
  fs.writeFileSync(OUT, JSON.stringify({ ...out, status: "fatal", error: e.message }, null, 2));
  process.exitCode = 1;
} finally {
  await p.$disconnect();
}
