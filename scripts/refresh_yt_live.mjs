/**
 * REFRESH LIVE YOUTUBE EMBEDS — keeps iOS live rows pointing at a stream that exists.
 *
 * WHY THIS EXISTS
 * A pinned YouTube live video id is the CURRENT broadcast, not a permanent address.
 * When a 24/7 channel restarts its stream, YouTube issues a new id and the stored
 * embed URL goes dead. Shipping a frozen id without this job means a reviewer can
 * open the app weeks later and see a dead player.
 *
 * WHAT IT WRITES — and what it must never touch
 * It updates ONLY:   streamUrl, evidenceUrl, lastCheckedAt, lastStatus, failCount
 * It NEVER writes:   clearedForApp, clearedBy, clearedAt
 *
 * That separation is the whole point. Apple clearance is a human act: a person
 * looks at a channel, decides we may carry it, and ticks it. A machine refreshing
 * a URL is maintenance. If this job could clear a row, then clearance would drift
 * back to being automatic, which is exactly what the 5.2.2 fix was about.
 * The guard below enforces this in code rather than in a comment.
 *
 * Usage:
 *   node scripts/refresh_yt_live.mjs                 # dry run, prints what would change
 *   node scripts/refresh_yt_live.mjs --apply         # writes
 *   node scripts/refresh_yt_live.mjs --probe <handle># resolve one handle, no database
 *   node scripts/refresh_yt_live.mjs --limit 5
 */
import { PrismaClient } from "@prisma/client";

const APPLY = process.argv.includes("--apply");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 999;
})();
const PROBE_INDEX = process.argv.indexOf("--probe");
const PROBE = PROBE_INDEX >= 0 ? process.argv[PROBE_INDEX + 1] : null;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const TIMEOUT = 25000;

/** Only these columns may ever be written by this script. */
const WRITABLE = new Set(["streamUrl", "evidenceUrl", "lastCheckedAt", "lastStatus", "failCount"]);
function assertSafe(payload) {
  for (const key of Object.keys(payload)) {
    if (!WRITABLE.has(key)) {
      throw new Error(
        `refusing to write '${key}' — this job may only touch ${[...WRITABLE].join(", ")}. ` +
          `Clearing is a human act and must never be automated.`
      );
    }
  }
}

async function get(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    });
    return { status: res.status, url: res.url, text: await res.text() };
  } catch (e) {
    return { status: 0, url, text: "", error: String(e).slice(0, 60) };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Resolve a channel's current live stream.
 * We read the page's `currentVideoEndpoint` rather than the player response:
 * from a datacenter IP YouTube answers the player with LOGIN_REQUIRED, which
 * tells us nothing about the video. The page data is served normally.
 */
/**
 * Collect candidate video ids for a channel's current live stream, best first.
 *
 * We read the page's `currentVideoEndpoint` rather than the player response:
 * from a datacenter IP YouTube answers the player with LOGIN_REQUIRED, which tells
 * us nothing about the video. The page data is served normally.
 *
 * NOTE: the fallback below is a HEURISTIC — on 2026-09-15 it returned a video from a
 * completely different broadcaster for @dwnews. Every candidate therefore has to pass
 * verifyCandidate() before it is allowed anywhere near the database.
 */
async function collectCandidates(handle) {
  const r = await get(`https://www.youtube.com/@${handle}/live`);
  if (r.status !== 200 || !r.text) return { ok: false, why: `channel page http ${r.status}` };

  const ids = [];
  const i = r.text.indexOf('"currentVideoEndpoint"');
  if (i >= 0) {
    const m = r.text.slice(i, i + 700).match(/"url":"\/watch\?v=([A-Za-z0-9_-]{11})"/);
    if (m) ids.push(m[1]);
  }
  const counts = {};
  for (const m of r.text.matchAll(/"watchEndpoint":\{"videoId":"([A-Za-z0-9_-]{11})"/g)) {
    counts[m[1]] = (counts[m[1]] || 0) + 1;
  }
  for (const [id] of Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)) {
    if (!ids.includes(id)) ids.push(id);
  }
  if (!ids.length) return { ok: false, why: "no candidate video ids on the channel page" };
  return { ok: true, ids };
}

/** Embeddability is the rights holder's own setting — if oEmbed fails, we cannot ship it. */
async function checkEmbed(videoId) {
  const u = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;
  const r = await get(u);
  if (r.status !== 200) return { embeddable: false, http: r.status };
  try {
    const j = JSON.parse(r.text);
    return { embeddable: true, author: j.author_name, authorUrl: j.author_url, title: j.title };
  } catch {
    return { embeddable: false, http: r.status };
  }
}

function handleFromAuthorUrl(u) {
  const m = String(u || "").match(/youtube\.com\/@([A-Za-z0-9_.-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

/**
 * A candidate is only usable if the video actually belongs to the channel we asked
 * about. oEmbed tells us who published it, so we require the author handle to match.
 * This is what stops a "recommended video" from being stored as the broadcaster's
 * live stream — the failure mode this file previously had.
 */
async function verifyCandidate(videoId, handle) {
  const emb = await checkEmbed(videoId);
  if (!emb.embeddable) return { ok: false, why: `not embeddable (http ${emb.http})` };
  const author = handleFromAuthorUrl(emb.authorUrl);
  if (!author) return { ok: false, why: `cannot read uploader handle from ${emb.authorUrl}` };
  if (author !== handle.toLowerCase()) {
    return { ok: false, why: `belongs to @${author}, not @${handle} — refused` };
  }
  return { ok: true, videoId, author: emb.author, authorUrl: emb.authorUrl };
}

/** Resolve AND identity-check. The only resolver the seed/refresh paths may use. */
export async function resolveLive(handle) {
  const cand = await collectCandidates(handle);
  if (!cand.ok) return cand;
  const notes = [];
  for (const id of cand.ids) {
    const v = await verifyCandidate(id, handle);
    if (v.ok) return { ok: true, videoId: v.videoId, author: v.author, authorUrl: v.authorUrl };
    notes.push(`${id}: ${v.why}`);
  }
  return { ok: false, why: `no usable live stream for @${handle} (${notes.join("; ")})` };
}

function handleFromProvenance(provenanceUrl) {
  const m = String(provenanceUrl || "").match(/youtube\.com\/@([A-Za-z0-9_.-]+)/);
  return m ? m[1] : null;
}

async function main() {
  if (PROBE) {
    console.log(`probe @${PROBE}`);
    const live = await resolveLive(PROBE);
    if (!live.ok) return console.log(`  ✗ ${live.why}`);
    const emb = await checkEmbed(live.videoId);
    console.log(`  live id     : ${live.videoId}${live.viaFallback ? " (fallback match)" : ""}`);
    console.log(`  embeddable  : ${emb.embeddable ? "yes" : "NO"}`);
    console.log(`  uploader    : ${emb.author || "-"}`);
    console.log(`  would store : https://www.youtube.com/embed/${live.videoId}`);
    return;
  }

  const prisma = new PrismaClient();
  const rows = await prisma.channel.findMany({
    where: { sourceKind: "youtube-live" },
    select: { id: true, name: true, streamUrl: true, provenanceUrl: true, isActive: true },
    take: LIMIT,
  });

  console.log(`live YouTube rows: ${rows.length}   mode: ${APPLY ? "APPLY" : "dry run"}`);
  if (!rows.length) {
    console.log("  nothing to refresh yet (no rows with sourceKind='youtube-live').");
    await prisma.$disconnect();
    return;
  }

  let changed = 0;
  let dead = 0;

  for (const row of rows) {
    const handle = handleFromProvenance(row.provenanceUrl);
    if (!handle) {
      console.log(`  ⚠ ${row.name}: no @handle in provenanceUrl — cannot refresh, leaving untouched`);
      continue;
    }

    const live = await resolveLive(handle);
    if (!live.ok) {
      dead++;
      console.log(`  ✗ ${row.name.padEnd(28)} ${live.why}`);
      // A row whose broadcast has ended is not something we silently delete or hide —
      // it is reported. Whether the channel stays in the build is a human decision.
      // Note this path never rewrites streamUrl, so a channel-form row keeps its URL.
      if (APPLY) {
        const payload = { lastCheckedAt: new Date(), lastStatus: "no-live-stream" };
        assertSafe(payload);
        await prisma.channel.update({ where: { id: row.id }, data: payload });
      }
      continue;
    }

    const emb = await checkEmbed(live.videoId);
    if (!emb.embeddable) {
      dead++;
      console.log(`  ✗ ${row.name.padEnd(28)} live id ${live.videoId} is NOT embeddable (http ${emb.http})`);
      if (APPLY) {
        const payload = { lastCheckedAt: new Date(), lastStatus: "not-embeddable" };
        assertSafe(payload);
        await prisma.channel.update({ where: { id: row.id }, data: payload });
      }
      continue;
    }

    // ------------------------------------------------------------------ channel form
    // If the row embeds the CHANNEL (live_stream?channel=UC...), there is no stored
    // video id and therefore nothing to refresh. This branch must exist or the job
    // would overwrite the stable channel URL with a pinned one — reintroducing exactly
    // the id rot the channel form removes. So: verify, record, and do NOT rewrite.
    if (String(row.streamUrl).includes("live_stream?channel=")) {
      console.log(`  ✓ ${row.name.padEnd(28)} channel form, live now (${live.videoId}, "${(emb.author || "").slice(0, 22)}") — URL left alone`);
      if (APPLY) {
        const payload = { lastCheckedAt: new Date(), lastStatus: "ok" };
        assertSafe(payload);
        await prisma.channel.update({ where: { id: row.id }, data: payload });
      }
      continue;
    }

    const next = `https://www.youtube.com/embed/${live.videoId}`;
    const watch = `https://www.youtube.com/watch?v=${live.videoId}`;

    if (row.streamUrl === next) {
      console.log(`  = ${row.name.padEnd(28)} unchanged (${live.videoId})`);
      if (APPLY) {
        const payload = { lastCheckedAt: new Date(), lastStatus: "ok" };
        assertSafe(payload);
        await prisma.channel.update({ where: { id: row.id }, data: payload });
      }
      continue;
    }

    changed++;
    console.log(`  → ${row.name.padEnd(28)} ${live.videoId}  "${(emb.author || "").slice(0, 24)}"`);
    if (APPLY) {
      const payload = {
        streamUrl: next,
        evidenceUrl: watch,
        lastCheckedAt: new Date(),
        lastStatus: "ok",
      };
      assertSafe(payload);
      await prisma.channel.update({ where: { id: row.id }, data: payload });
    }
  }

  console.log(`\n  ${changed} would change · ${dead} have no live stream or are not embeddable`);
  console.log(`  clearedForApp / clearedBy / clearedAt: NOT touched, by construction.`);
  if (!APPLY) console.log("  dry run — nothing written. Re-run with --apply.");
  await prisma.$disconnect();
}

// Run only when invoked directly. seed_yt_live.mjs imports resolveLive() from this
// file, and without this guard the import would execute the refresh job too — so
// `seed_yt_live.mjs --apply` would silently also run a refresh pass.
const invokedDirectly =
  process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (invokedDirectly) {
  main().catch((e) => {
    console.error("failed:", e.message);
    process.exitCode = 1;
  });
}
