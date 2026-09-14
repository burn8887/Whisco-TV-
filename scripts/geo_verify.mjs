/**
 * WHISCO TV — TARGETED GEO VERIFY (ops script, 2026-09-14)
 *
 * Verifies named titles against YouTube's GCC availability list and reports the
 * RAW evidence (is the availability list even present? how many countries? are
 * any of the six GCC countries in it?) instead of just a verdict.
 *
 * Why the raw detail matters: the production sweep treats "watch page has no
 * availability list" as "worldwide available". If YouTube serves a list-less
 * page variant, that fallback silently reads a BLOCKED title as OK — which is
 * how Leyla / Sahipsizler / Kızılcık Şerbeti were restored to the live site
 * hours after being hidden. This script never hides on an ambiguous reading.
 *
 * Usage: node scripts/geo_verify.mjs <slug,slug,...> <hide:true|false>
 */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const SLUGS = String(process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
const HIDE = String(process.argv[3] || "false").toLowerCase() === "true";

const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};
const ytId = (u) => {
  const m = (u || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

async function probe(id) {
  const out = { id, http: null, playability: false, listPresent: false, listCountries: 0, gcc: [] };
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
      headers: UA,
      signal: AbortSignal.timeout(20000),
    });
    out.http = r.status;
    const html = await r.text();
    out.playability = html.includes("playabilityStatus");
    const m = html.match(/"availableCountries":\[([^\]]*)\]/);
    if (m) {
      const list = m[1].replace(/"/g, "").split(",");
      out.listPresent = true;
      out.listCountries = list.length;
      out.gcc = GCC.filter((c) => list.includes(c));
    }
  } catch (e) {
    out.http = "ERR";
  }
  // verification, not a rate-limited crawl: this is a handful of videos
  await new Promise((r) => setTimeout(r, 1200));
  return out;
}

const verdictOf = (o) => {
  if (o.http === 429 || o.http === "ERR" || o.http === 403) return "UNVERIFIABLE";
  if (!o.playability) return "UNVERIFIABLE";
  if (!o.listPresent) return "AMBIGUOUS-no-list";
  return o.gcc.length > 0 ? "AVAILABLE" : "BLOCKED";
};

console.log(`=== geo verify | hide=${HIDE} | ${SLUGS.length} slug(s) ===`);
const results = [];
for (const slug of SLUGS) {
  const t = await p.title.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, name: true, type: true, isActive: true, lastStatus: true,
      streamUrl: true,
      seasons: { select: { episodes: { select: { number: true, streamUrl: true }, orderBy: { number: "asc" } } } },
    },
  });
  if (!t) {
    console.log(`\n-- ${slug}: NOT FOUND`);
    continue;
  }
  const eps = t.seasons.flatMap((s) => s.episodes);
  let ids = [];
  if (t.type === "SERIES") {
    const all = eps.map((e) => ytId(e.streamUrl)).filter(Boolean);
    // first, middle, last — the same sampling the production sweep uses
    ids = [...new Set([all[0], all[Math.floor(all.length / 2)], all[all.length - 1]].filter(Boolean))];
  } else {
    const one = ytId(t.streamUrl);
    if (one) ids = [one];
  }

  console.log(`\n-- ${slug}  (${t.name})`);
  console.log(`   db: active=${t.isActive} lastStatus=${t.lastStatus} | type=${t.type} episodes=${eps.length} videosProbed=${ids.length}`);
  if (!ids.length) {
    console.log("   no YouTube video id resolvable — SKIPPED (nothing written)");
    continue;
  }

  const probes = [];
  for (const id of ids) probes.push(await probe(id));
  const verdicts = probes.map(verdictOf);
  for (let i = 0; i < probes.length; i++) {
    const o = probes[i];
    console.log(
      `   ${o.id}  HTTP ${o.http} | playability=${o.playability} | list=${o.listPresent ? o.listCountries + " countries" : "ABSENT"} | GCC=[${o.gcc.join(",")}] => ${verdicts[i]}`
    );
  }

  const blocked = verdicts.filter((v) => v === "BLOCKED").length;
  const avail = verdicts.filter((v) => v === "AVAILABLE").length;
  const ambiguous = verdicts.filter((v) => v === "AMBIGUOUS-no-list").length;
  const unver = verdicts.filter((v) => v === "UNVERIFIABLE").length;
  const allBlocked = blocked > 0 && avail === 0 && ambiguous === 0 && unver === 0;

  console.log(`   summary: blocked=${blocked} available=${avail} ambiguous=${ambiguous} unverifiable=${unver}`);

  if (HIDE && allBlocked && t.isActive) {
    await p.title.update({ where: { id: t.id }, data: { isActive: false, lastStatus: "geo", failCount: 0 } });
    console.log(`   => HIDDEN (every probed episode explicitly BLOCKED, list present, none available)`);
    results.push({ slug, action: "hidden" });
  } else if (HIDE && allBlocked && !t.isActive) {
    console.log("   => already hidden, left as is");
    results.push({ slug, action: "already-hidden" });
  } else if (HIDE) {
    console.log("   => NOT hidden (reading is not a clean, list-backed BLOCKED verdict)");
    results.push({ slug, action: "not-hidden-ambiguous" });
  }
}

console.log("\n=== RESULT ===");
for (const r of results) console.log(`  ${r.slug}: ${r.action}`);
console.log(`  DB: lastStatus='geo' = ${await p.title.count({ where: { lastStatus: "geo" } })} | inactive = ${await p.title.count({ where: { isActive: false } })}`);
console.log(`  active + geo (must be 0) = ${await p.title.count({ where: { lastStatus: "geo", isActive: true } })}`);
await p.$disconnect();
