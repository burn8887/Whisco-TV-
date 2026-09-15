/**
 * YOUTUBE PROVENANCE BACKFILL  (Grok lock item 6)
 *
 * "RSS backfill of uploader IDs. Do not block submit on a perfect backfill."
 *
 * Why this does not use RSS: a YouTube channel RSS feed only exposes the ~15 most
 * recent uploads. Our catalogue's oldest items would never be reached, so RSS
 * could resolve a few hundred titles out of 14,728 — not useful as a register.
 *
 * What it uses instead: YouTube's PUBLIC oEmbed endpoint
 * (`youtube.com/oembed?url=...&format=json`). No API key, no quota, and it works
 * per-video for any video regardless of age. It returns the uploader's channel
 * NAME and channel URL, which is the provenance fact we need: who actually
 * published this video, and is that the rights holder.
 *
 * A successful oEmbed response is also meaningful in itself:
 *   - 200 -> the video is public and served in an EMBEDDABLE player, which is the
 *           mechanism our app relies on;
 *   - 401/403 -> the video is NOT embeddable (or is private/unavailable). Those
 *           titles cannot legally play in our app at all and must be hidden;
 *   - 404 -> the video is gone.
 * So this pass gives us provenance AND embeddability AND liveness.
 *
 * What it does NOT prove: that the uploader is the rights holder. That is a
 * judgement a human makes, from the uploader report this script prints, and the
 * official-channel registry we maintain. Hence clearedForApp stays FALSE
 * throughout — Grok's lock requires a human tick before content enters the app.
 *
 * Idempotent and resumable: skips rows that already carry an uploaderUrl.
 *
 * Usage:
 *   node scripts/backfill_youtube_provenance.mjs --limit 500
 *   node scripts/backfill_youtube_provenance.mjs              # everything remaining
 *   node scripts/backfill_youtube_provenance.mjs --report      # where are we
 */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const LIMIT = (() => {
  const i = args.indexOf("--limit");
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : 0;
})();

const CONCURRENCY = 10;
const TIMEOUT_MS = 15000;
const UA = "WhiscoTV-rights-audit/1.0 (+https://whisco.tv; legal@whisco.tv)";

/** https://www.youtube.com/embed/<id> | watch?v=<id> | youtu.be/<id> -> <id> */
function videoIdOf(url) {
  if (!url) return null;
  const m =
    url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/) ||
    url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
    url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
    url.match(/youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

async function oembed(videoId) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const u = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}&format=json`;
    const res = await fetch(u, { signal: ctl.signal, headers: { "User-Agent": UA } });
    if (res.status === 200) {
      const j = await res.json();
      return { state: "EMBEDDABLE", author: j.author_name || null, authorUrl: j.author_url || null, title: j.title || null };
    }
    if (res.status === 401 || res.status === 403) return { state: "NOT_EMBEDDABLE", http: res.status };
    if (res.status === 404) return { state: "GONE", http: 404 };
    return { state: "ERROR", http: res.status };
  } catch {
    return { state: "ERROR" };
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
        done++;
        if (done % 500 === 0) process.stdout.write(`    ... ${done}/${items.length}\n`);
      }
    })
  );
  return out;
}

async function main() {
  const where = { isActive: true, streamUrl: { contains: "youtu" }, rightsBasis: null };

  if (REPORT_ONLY) {
    const total = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" } } });
    const done = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" }, NOT: { rightsBasis: null } } });
    console.log(`=== YouTube provenance: ${done} of ${total} resolved (${((done / total) * 100).toFixed(1)}%) ===`);
    const embeddable = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" }, sourceKind: "youtube-embeddable" } });
    const notEmb = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" }, sourceKind: "youtube-not-embeddable" } });
    const gone = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" }, sourceKind: "youtube-gone" } });
    console.log(`  embeddable     : ${embeddable}`);
    console.log(`  NOT embeddable : ${notEmb}`);
    console.log(`  gone           : ${gone}`);
    return;
  }

  const rows = await p.title.findMany({
    where,
    select: { id: true, name: true, streamUrl: true },
    ...(LIMIT ? { take: LIMIT } : {}),
  });

  console.log(`=== YouTube provenance backfill ===`);
  console.log(`  rows to process: ${rows.length}\n`);
  if (!rows.length) {
    console.log("  nothing remaining. run with --report for the summary.");
    return;
  }

  let embeddable = 0,
    notEmbeddable = 0,
    gone = 0,
    errored = 0,
    noId = 0;
  const uploaderTally = {};

  await pool(rows, CONCURRENCY, async (row) => {
    const vid = videoIdOf(row.streamUrl);
    if (!vid) {
      noId++;
      await p.title.update({
        where: { id: row.id },
        data: { rightsBasis: "UNRESOLVED: no YouTube video id found in the stored URL", clearedForApp: false },
      });
      return;
    }

    const r = await oembed(vid);
    const watch = `https://www.youtube.com/watch?v=${vid}`;

    if (r.state === "EMBEDDABLE") {
      embeddable++;
      uploaderTally[r.author || "(unknown uploader)"] = (uploaderTally[r.author || "(unknown uploader)"] || 0) + 1;
      await p.title.update({
        where: { id: row.id },
        data: {
          sourceKind: "youtube-embeddable",
          uploaderUrl: r.authorUrl,
          evidenceUrl: watch,
          // The uploader is RECORDED, not judged. Whether this channel is the
          // rights holder is a human decision made from the report below.
          rightsBasis: `Embeddable video; uploader channel: ${r.author || "unknown"}${r.authorUrl ? ` (${r.authorUrl})` : ""}`,
          clearedForApp: false,
        },
      });
      return;
    }

    if (r.state === "NOT_EMBEDDABLE") {
      notEmbeddable++;
      await p.title.update({
        where: { id: row.id },
        data: {
          sourceKind: "youtube-not-embeddable",
          evidenceUrl: watch,
          rightsBasis: `NOT EMBEDDABLE (http ${r.http}): the owner has disabled embedding, so this video cannot play in our app and must be hidden`,
          clearedForApp: false,
          // The owner has switched embedding off: the item cannot function, so it
          // is hidden from viewers rather than left as a dead tile.
          isActive: false,
        },
      });
      return;
    }

    if (r.state === "GONE") {
      gone++;
      await p.title.update({
        where: { id: row.id },
        data: {
          sourceKind: "youtube-gone",
          evidenceUrl: watch,
          rightsBasis: "UNAVAILABLE: the video no longer exists on YouTube",
          clearedForApp: false,
          isActive: false,
        },
      });
      return;
    }

    errored++; // leave null so the next run retries
  });

  console.log(`\n  ── RESULTS ──────────────────────────────────────`);
  console.log(`  embeddable + uploader recorded : ${embeddable}`);
  console.log(`  not embeddable (hidden)        : ${notEmbeddable}`);
  console.log(`  gone (hidden)                  : ${gone}`);
  console.log(`  network errors (retry later)   : ${errored}`);
  console.log(`  no video id in URL             : ${noId}`);

  const top = Object.entries(uploaderTally).sort((a, b) => b[1] - a[1]).slice(0, 30);
  if (top.length) {
    console.log(`\n  ── TOP UPLOADER CHANNELS (this is who our catalogue actually comes from) ──`);
    for (const [name, n] of top) console.log(`   ${String(n).padStart(5)}  ${name}`);
  }

  const remaining = await p.title.count({ where: { isActive: true, streamUrl: { contains: "youtu" }, rightsBasis: null } });
  console.log(`\n  remaining: ${remaining}`);
}

main()
  .catch((e) => {
    console.error("failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
