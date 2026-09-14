/**
 * WHISCO TV — GCC-VANTAGE GEO PROBE (ops script, 2026-09-14)
 *
 * Runs the same watch-page availability check as scripts/geo_verify.mjs, but
 * through a SOCKS5 tunnel whose exit is INSIDE the Gulf. Why that matters:
 *
 *   - From a US vantage, YouTube serves the `availableCountries` list only when
 *     the video is unplayable THERE. Our Gulf-only blocks (Leyla, Sahipsizler,
 *     Kızılcık Şerbeti) are playable in the US, so the US page carries no list
 *     at all — which taught us nothing and once caused three blocked titles to be
 *     restored to the live site.
 *   - From a Gulf vantage the reading becomes meaningful in BOTH directions:
 *       * list present  -> the video is blocked where we asked, and the list
 *                          itself tells us which Gulf countries can watch it
 *       * list absent   -> the video IS playable in the vantage country. That is
 *                          positive evidence of availability, not silence.
 *
 * Fetching goes through `curl --socks5-hostname` rather than Node fetch: no new
 * npm dependency, and it keeps the exit node a dumb pipe (nothing of ours runs
 * on the rented box).
 *
 * Doctrine (unchanged from geo_verify.mjs): hide ONLY on a clean, list-backed
 * BLOCKED-ALL-GCC reading. A read that cannot be interpreted never writes, and
 * nothing is ever written unless the vantage itself is confirmed to be in a GCC
 * country.
 *
 * Usage:
 *   node scripts/gcc_geo_probe.mjs <slugs,csv> <hide:true|false> [ids,csv]
 *
 * Env: SOCKS_PROXY (default socks5h://127.0.0.1:1080)
 */
import { PrismaClient } from "@prisma/client";
import { execFile } from "node:child_process";
import { writeFileSync } from "node:fs";

const p = new PrismaClient();
const SLUGS = String(process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
const HIDE = String(process.argv[3] || "false").toLowerCase() === "true";
const RAW_IDS = String(process.argv[4] || "").split(",").map((s) => s.trim()).filter(Boolean);
const SOCKS = process.env.SOCKS_PROXY || "socks5h://127.0.0.1:1080";

const GCC = ["BH", "SA", "AE", "KW", "QA", "OM"];
const GCC_NAMES = { BH: "Bahrain", SA: "Saudi Arabia", AE: "UAE", KW: "Kuwait", QA: "Qatar", OM: "Oman" };
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const SERIES_SAMPLE = 3; // episodes probed per series; a series is 30+ rows otherwise

const ytId = (u) => {
  const m = (u || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

function curl(args, timeoutMs = 30000) {
  return new Promise((resolve) => {
    execFile("curl", args, { timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({ ok: !err, out: String(stdout || ""), err: err ? String(stderr || err.message) : "" });
    });
  });
}

// ---- 1. prove WHERE we are asking from. Nothing is written without this. -----
const exit = await curl(["-s", "--socks5-hostname", SOCKS, "--max-time", "25", "https://ipinfo.io/json"]);
let exitInfo = null;
try { exitInfo = JSON.parse(exit.out); } catch { exitInfo = null; }
const exitCountry = exitInfo && /^[A-Z]{2}$/.test(exitInfo.country || "") ? exitInfo.country : null;
const vantageIsGcc = !!exitCountry && GCC.includes(exitCountry);

console.log("=== GCC geo probe ===");
console.log(`  tunnel      : ${SOCKS}`);
console.log(`  exit IP     : ${exitInfo?.ip || "UNKNOWN"} (${exitInfo?.city || "?"}, ${exitInfo?.country || "?"})`);
console.log(`  exit org    : ${exitInfo?.org || "?"}`);
console.log(`  VANTAGE     : ${exitCountry ? `${GCC_NAMES[exitCountry] || exitCountry}${vantageIsGcc ? "" : " — NOT a GCC country!"}` : "COULD NOT CONFIRM"}`);
if (!vantageIsGcc) {
  console.log("\n  REFUSING TO WRITE: the exit is not confirmed to be inside a GCC country.");
  console.log("  A non-GCC reading is exactly the ambiguity that caused the restore regression.");
  console.log("  Running read-only so the evidence is still visible.\n");
}
console.log(`  mode        : ${HIDE && vantageIsGcc ? "VERIFY + HIDE" : "read-only"}`);

async function probe(id) {
  const r = await curl([
    "-s", "--socks5-hostname", SOCKS, "--max-time", "30",
    "-H", `User-Agent: ${UA}`, "-H", "Accept-Language: en-US,en;q=0.9",
    `https://www.youtube.com/watch?v=${id}&hl=en`,
  ]);
  const o = { id, http: null, playability: false, listPresent: false, listCountries: 0, gcc: [], missing: [] };
  if (!r.ok) { o.http = "ERR"; return o; }
  const html = r.out;
  o.http = html.length > 0 ? 200 : "EMPTY";
  o.playability = html.includes("playabilityStatus");
  const m = html.match(/"availableCountries":\[([^\]]*)\]/);
  if (m) {
    const list = m[1].replace(/"/g, "").split(",").filter(Boolean);
    o.listPresent = true;
    o.listCountries = list.length;
    o.gcc = GCC.filter((c) => list.includes(c));
    o.missing = GCC.filter((c) => !list.includes(c));
  }
  await new Promise((res) => setTimeout(res, 1200)); // verification scale, not a crawl
  return o;
}

// Vocabularies matter here. An earlier version of this function returned
// "PARTIAL-GCC" for ANY list containing a GCC country, which made the known-good
// control (a list containing all six) read as "unverifiable". From inside the
// Gulf there are four distinct readings and each means something specific:
const verdictOf = (o) => {
  if (o.http === "ERR" || o.http === "EMPTY") return "UNVERIFIABLE";
  if (!o.playability) return "UNVERIFIABLE"; // consent / ratelimit stub
  if (!o.listPresent) return `AVAILABLE-IN-${exitCountry}`; // playable where we asked => available here
  if (o.gcc.length === 0) return "BLOCKED-ALL-GCC"; // blocked in every Gulf state
  if (o.gcc.length === GCC.length) return "AVAILABLE-ALL-GCC"; // watchable in all six
  return "PARTIAL-GCC"; // watchable in some Gulf states, not others
};

const results = [];

async function verifyTitle(t) {
  const target = t.type === "SERIES"
    ? t.seasons.flatMap((s) => s.episodes).map((e) => ytId(e.streamUrl)).filter(Boolean).slice(0, SERIES_SAMPLE)
    : [ytId(t.streamUrl)].filter(Boolean);
  if (!target.length) {
    console.log(`\n-- ${t.slug}: no resolvable YouTube id (skipped)`);
    return;
  }
  console.log(`\n-- ${t.slug} :: ${t.name}${t.type === "SERIES" ? ` [series, ${target.length} of its episodes sampled]` : ""}`);
  const probes = [];
  for (const id of target) {
    const o = await probe(id);
    const v = verdictOf(o);
    probes.push({ ...o, verdict: v });
    console.log(`     ${id}  http=${o.http} playability=${o.playability} list=${o.listPresent ? `${o.listCountries} countries` : "ABSENT"} ` +
      `gcc=[${o.gcc.join(",")}] missing=[${o.missing.join(",")}]  -> ${v}`);
  }
  const blocked = probes.filter((x) => x.verdict === "BLOCKED-ALL-GCC");
  // PARTIAL-GCC counts as available for the title decision: it IS watchable
  // somewhere in the Gulf, and only a block across all six is a hide.
  const available = probes.filter((x) => x.verdict.startsWith("AVAILABLE") || x.verdict === "PARTIAL-GCC");
  let verdict;
  if (blocked.length && !available.length) verdict = "BLOCKED-ALL-GCC";
  else if (available.length && !blocked.length) verdict = "AVAILABLE";
  else if (!blocked.length && !available.length) verdict = "UNVERIFIABLE";
  else verdict = "AMBIGUOUS";
  console.log(`     TITLE VERDICT: ${verdict}`);

  results.push({ slug: t.slug, name: t.name, type: t.type, isActive: t.isActive, lastStatus: t.lastStatus, verdict, probes });

  if (HIDE && vantageIsGcc && verdict === "BLOCKED-ALL-GCC" && t.isActive) {
    await p.title.update({ where: { id: t.id }, data: { isActive: false, lastStatus: "geo", failCount: 0 } });
    console.log(`     >>> HIDDEN (list-backed BLOCKED-ALL-GCC from ${GCC_NAMES[exitCountry]})`);
  } else if (HIDE && vantageIsGcc && verdict === "BLOCKED-ALL-GCC" && !t.isActive) {
    await p.title.update({ where: { id: t.id }, data: { lastStatus: "geo", failCount: 0 } });
    console.log(`     >>> already hidden; status refreshed to geo`);
  }
}

// ---- 2. raw video ids (no DB row needed) ------------------------------------
if (RAW_IDS.length) {
  for (const id of RAW_IDS) {
    const o = await probe(id);
    const v = verdictOf(o);
    console.log(`\n-- raw id ${id}: http=${o.http} playability=${o.playability} ` +
      `list=${o.listPresent ? `${o.listCountries} countries` : "ABSENT"} gcc=[${o.gcc.join(",")}] missing=[${o.missing.join(",")}] -> ${v}`);
    results.push({ slug: null, videoId: id, verdict: v, probes: [{ ...o, verdict: v }] });
  }
}

// ---- 3. catalog titles ------------------------------------------------------
for (const slug of SLUGS) {
  const t = await p.title.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, name: true, type: true, isActive: true, lastStatus: true, streamUrl: true,
      seasons: { select: { episodes: { select: { number: true, streamUrl: true }, orderBy: { number: "asc" } } } },
    },
  });
  if (!t) { console.log(`\n-- ${slug}: NOT FOUND`); continue; }
  await verifyTitle(t);
}

writeFileSync("/tmp/gcc_geo_probe.json", JSON.stringify({ when: new Date().toISOString(), exit: exitInfo, vantageIsGcc, hide: HIDE, results }, null, 2));
console.log("\n=== summary ===");
for (const r of results) console.log(`  ${String(r.slug || r.videoId).padEnd(46)} ${r.verdict}`);
if (HIDE && !vantageIsGcc) console.log("\n  (nothing was written: vantage not confirmed GCC)");
await p.$disconnect();
