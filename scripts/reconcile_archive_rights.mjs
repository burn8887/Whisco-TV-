/**
 * ARCHIVE.ORG RIGHTS RECONCILIATION  (Grok lock item 5)
 *
 * Rule from the lock: "iOS true only after human tick: archive.org items whose
 * item page supports the use."
 *
 * So this script does NOT clear anything. It gathers the EVIDENCE and writes it
 * onto the row, then reports how many items qualify and on what basis. The
 * founder ticks the class; only then do we flip clearedForApp true.
 *
 * Why archive.org is the strongest position we hold: each item carries its own
 * machine-readable rights declaration. We record that declaration VERBATIM —
 * we never paraphrase a rights basis, because a paraphrase is not evidence.
 *
 * Examples seen in our catalogue:
 *   licenseurl: http://creativecommons.org/licenses/publicdomain/
 *   collection: prelinger              <- Prelinger Archives, a public-domain film collection
 *
 * Evidence strength classes:
 *   STRONG   explicit public-domain declaration on the item (licenseurl / rights
 *            / possible-copyright-status), verifiable by the reviewer on the
 *            item's own details page
 *   WEAK     item exists but declares nothing -> NOT clearable, recorded as such
 *   GONE     item or identifier no longer resolves -> must be hidden
 *
 * Idempotent and resumable: only touches rows where rightsBasis is null, so it
 * can be re-run after a timeout without redoing work.
 *
 * Usage:
 *   node scripts/reconcile_archive_rights.mjs            # all remaining
 *   node scripts/reconcile_archive_rights.mjs --limit 200
 *   node scripts/reconcile_archive_rights.mjs --report   # no writes, just count
 */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const LIMIT = (() => {
  const i = args.indexOf("--limit");
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : 0;
})();

const CONCURRENCY = 8;
const TIMEOUT_MS = 20000;

/** archive.org/download/<identifier>/<file> -> <identifier> */
function identifierOf(url) {
  try {
    const m = new URL(url).pathname.match(/^\/(?:download|details|embed|stream)\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

// LICENCE CLASSES, in order of legal safety for an AD-SUPPORTED COMMERCIAL service.
//
// CRITICAL: NonCommercial (NC) licences are NOT usable by us. Whisco TV is funded
// by advertising, which is a commercial use, so "by-nc", "by-nc-sa" and "by-nc-nd"
// must be BLOCKED outright. A first version of this script auto-classified
// "Panorama Ephemera" (CC BY-NC-SA) and "Lost Landscapes of Detroit 2010"
// (CC BY-NC) as clearable — that was a genuine licence violation waiting to ship,
// caught before it did. NC is now an explicit block, never a pass.
//
// Public-domain marks carry no obligations, so they are the clean class:
// "clean" rows can be ticked as a class.
// "attribution" rows (CC BY / BY-SA) are commercially permitted but oblige us to
// credit the creator inside the app, so they are reported separately and are NOT
// auto-included until attribution is displayed.
const NC_PATTERNS = [/by-nc/i, /nc-sa/i, /nc-nd/i, /noncommercial/i, /\bnc\//i];

const PD_CLEAN_PATTERNS = [
  /creativecommons\.org\/(licenses\/)?publicdomain/i, // CC public domain dedication + PDM
  /creativecommons\.org\/publicdomain\/mark/i,
  /creativecommons\.org\/licenses\/cc0/i,
  /\/zero\/1\.0/i,
  /public domain/i,
];

const PD_ATTRIBUTION_PATTERNS = [
  /creativecommons\.org\/licenses\/by\/\d/i,
  /creativecommons\.org\/licenses\/by-sa\/\d/i,
];

/* Note: the copyright-status field is matched directly by PD_STATUS below —
   there is deliberately no combined pattern constant here, because a combined
   pattern is how the NonCommercial leak happened in the first place. */

const PD_STATUS = [/NOT_IN_COPYRIGHT/i, /PUBLIC_DOMAIN/i];

async function fetchMeta(id) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(id)}`, {
      signal: ctl.signal,
      headers: { "User-Agent": "WhiscoTV-rights-audit/1.0 (+https://whisco.tv; legal@whisco.tv)" },
    });
    if (!res.ok) return { state: "GONE", http: res.status };
    const j = await res.json();
    const m = j.metadata || {};
    if (!m.identifier) return { state: "GONE", http: 200 };
    return { state: "OK", meta: m };
  } catch {
    return { state: "ERROR" };
  } finally {
    clearTimeout(t);
  }
}

function classify(meta) {
  const licenseurl = meta.licenseurl || meta.license || "";
  const rights = meta.rights || "";
  const status = meta["possible-copyright-status"] || "";
  const collection = Array.isArray(meta.collection) ? meta.collection.join(", ") : meta.collection || "";

  let basis = null;
  let kind = null;
  const declaresNc = NC_PATTERNS.some((r) => r.test(licenseurl) || r.test(rights));

  if (declaresNc) {
    // Commercial service + NonCommercial licence = we may not carry it. Hard stop.
    kind = "BLOCKED";
    basis = `NOT USABLE BY US: item carries a NonCommercial licence (${licenseurl || rights}) and Whisco TV is an ad-supported commercial service`;
  } else if (licenseurl && PD_CLEAN_PATTERNS.some((r) => r.test(licenseurl))) {
    basis = `Item declares its own licence: ${licenseurl}`;
    kind = "STRONG";
  } else if (status && PD_STATUS.some((r) => r.test(status))) {
    basis = `Item declares copyright status: ${status}`;
    kind = "STRONG";
  } else if (rights && PD_CLEAN_PATTERNS.some((r) => r.test(rights))) {
    basis = `Item states rights: ${rights.slice(0, 160)}`;
    kind = "STRONG";
  } else if (licenseurl && PD_ATTRIBUTION_PATTERNS.some((r) => r.test(licenseurl))) {
    // Permitted commercially, but we owe the creator credit. Held until the app
    // displays attribution, so it is reported, not auto-cleared.
    kind = "ATTRIBUTION";
    basis = `Requires attribution: ${licenseurl}`;
  } else {
    basis = null;
    kind = "WEAK";
  }

  return {
    kind,
    basis,
    licenseurl: licenseurl || null,
    status: status || null,
    collection: collection || null,
    creator: meta.creator || null,
    year: meta.date || meta.year || null,
    title: meta.title || null,
  };
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

async function main() {
  const where = { isActive: true, streamUrl: { contains: "archive.org" } };
  const rows = await p.title.findMany({
    where: REPORT_ONLY ? where : { ...where, rightsBasis: null },
    select: { id: true, name: true, streamUrl: true, releaseYear: true },
    ...(LIMIT ? { take: LIMIT } : {}),
  });

  console.log(`=== archive.org rights reconciliation ===`);
  console.log(`  rows to process: ${rows.length}${REPORT_ONLY ? "  (REPORT ONLY — no writes)" : ""}\n`);
  if (!rows.length) {
    const done = await p.title.count({ where: { ...where, NOT: { rightsBasis: null } } });
    console.log(`  nothing left to do. rows already carrying evidence: ${done}`);
    return;
  }

  let strong = 0,
    attn = 0,
    blocked = 0,
    weak = 0,
    gone = 0,
    errored = 0,
    noId = 0;
  const samplesStrong = [];
  const samplesWeak = [];

  await pool(rows, CONCURRENCY, async (row) => {
    const id = identifierOf(row.streamUrl);
    if (!id) {
      noId++;
      if (!REPORT_ONLY) {
        await p.title.update({
          where: { id: row.id },
          data: {
            sourceKind: "archive-org",
            rightsBasis: "UNRESOLVED: could not extract an archive.org identifier from the stored URL",
            clearedForApp: false,
          },
        });
      }
      return;
    }

    const res = await fetchMeta(id);
    const evidenceUrl = `https://archive.org/details/${encodeURIComponent(id)}`;

    if (res.state === "GONE") {
      gone++;
      if (!REPORT_ONLY) {
        await p.title.update({
          where: { id: row.id },
          data: {
            sourceKind: "archive-org",
            evidenceUrl,
            rightsBasis: `UNAVAILABLE: archive.org item "${id}" no longer resolves (http ${res.http ?? "n/a"})`,
            clearedForApp: false,
          },
        });
      }
      return;
    }
    if (res.state === "ERROR") {
      errored++;
      return; // leave rightsBasis null so a later run retries it
    }

    const c = classify(res.meta);
    if (c.kind === "STRONG") {
      strong++;
      if (samplesStrong.length < 6) samplesStrong.push({ name: row.name, id, ...c });
    } else if (c.kind === "ATTRIBUTION") {
      attn++;
    } else if (c.kind === "BLOCKED") {
      blocked++;
      console.log(`  ⛔ BLOCKED (NonCommercial): ${row.name} — ${c.basis}`);
    } else {
      weak++;
      if (samplesWeak.length < 4) samplesWeak.push({ name: row.name, id, collection: c.collection });
    }

    if (!REPORT_ONLY) {
      await p.title.update({
        where: { id: row.id },
        data: {
          sourceKind: "archive-org",
          evidenceUrl,
          uploaderUrl: `https://archive.org/details/${encodeURIComponent(id)}`,
          // VERBATIM declaration, never a paraphrase. clearedForApp stays FALSE:
          // Grok's lock requires a human tick before anything enters the app.
          rightsBasis:
            c.kind === "STRONG" || c.kind === "ATTRIBUTION" || c.kind === "BLOCKED"
              ? c.basis
              : `NO DECLARATION FOUND on the item page (collection: ${c.collection || "unknown"})`,
          clearedForApp: false,
        },
      });
    }
  });

  console.log(`  ── EVIDENCE CLASSES ─────────────────────────────`);
  console.log(`  STRONG        (public-domain, no obligations): ${strong}`);
  console.log(`  ATTRIBUTION   (CC BY / BY-SA, we owe credit) : ${attn}`);
  console.log(`  BLOCKED       (NonCommercial — unusable)     : ${blocked}`);
  console.log(`  WEAK          (item exists, declares nothing): ${weak}`);
  console.log(`  GONE    (item no longer resolves)          : ${gone}`);
  console.log(`  ERROR   (network, will retry next run)     : ${errored}`);
  console.log(`  NO-ID   (URL had no identifier)            : ${noId}`);

  if (samplesStrong.length) {
    console.log(`\n  sample STRONG evidence (this is what the reviewer will see):`);
    for (const s of samplesStrong) console.log(`   - ${s.name.slice(0, 30).padEnd(30)} | ${s.id}\n       ${s.basis}`);
  }
  if (samplesWeak.length) {
    console.log(`\n  sample WEAK (these do NOT enter the app):`);
    for (const s of samplesWeak) console.log(`   - ${s.name.slice(0, 30).padEnd(30)} | ${s.id} | collection: ${s.collection || "unknown"}`);
  }

  const remaining = await p.title.count({ where: { ...where, rightsBasis: null } });
  console.log(`\n  remaining unprocessed: ${remaining}`);
}

main()
  .catch((e) => {
    console.error("failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
