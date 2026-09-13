// Weekly catalog QA scan — read-only. Prints a markdown report to stdout.
// Run from repo root: node scripts/content_qa.mjs  (needs DATABASE_URL + prisma generate)
// Checks (origin: user-testing round 12 Sep 2026):
//   A. Script/language consistency  B. Name-year vs DB-year
//   C. Synopsis-year vs DB-year     D. Placeholder/broken text
//   E. Duplicate active streams
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const findings = [];
const add = (check, slug, detail) => findings.push({ check, slug, detail });

const titles = await p.title.findMany({
  where: { isActive: true },
  select: { name: true, slug: true, releaseYear: true, synopsis: true, language: true, streamUrl: true, collection: true },
});

// --- A. Script vs language ---------------------------------------------------
// A title whose NAME is predominantly in a script that contradicts its language
// tag (e.g. Arabic script on Turkish, Devanagari on Filipino) is a labeling bug.
// Latin script is allowed everywhere (transliteration is normal).
const scripts = {
  arabic: /[\u0600-\u06FF]/g,
  devanagari: /[\u0900-\u097F]/g,
  malayalam: /[\u0D00-\u0D7F]/g,
  tamil: /[\u0B80-\u0BFF]/g,
  telugu: /[\u0C00-\u0C7F]/g,
  bengali: /[\u0980-\u09FF]/g,
  sinhala: /[\u0D80-\u0DFF]/g,
};
// which scripts are LEGITIMATE for each language tag
const okScripts = {
  Arabic: ["arabic"], Hindi: ["devanagari"], Urdu: ["arabic"], Punjabi: ["devanagari", "arabic"],
  Malayalam: ["malayalam"], Tamil: ["tamil"], Telugu: ["telugu"], Bengali: ["bengali"],
  Sinhala: ["sinhala"], Turkish: [], English: [], Filipino: [], Indonesian: [], Nepali: ["devanagari"],
};
for (const t of titles) {
  const lang = t.language;
  if (!(lang in okScripts)) continue;
  for (const [script, re] of Object.entries(scripts)) {
    const hits = (t.name.match(re) || []).length;
    if (hits >= 4 && !okScripts[lang].includes(script)) {
      add("A. script-vs-language", t.slug, `language=${lang} but name is ${script}-script: "${t.name.slice(0, 60)}"`);
      break;
    }
  }
}

// --- B. Name-year vs DB-year --------------------------------------------------
const yearInName = /\((19[3-9]\d|20[0-2]\d)\)/;
for (const t of titles) {
  const m = t.name.match(yearInName);
  if (m) {
    const ny = parseInt(m[1], 10);
    if (Math.abs(ny - t.releaseYear) >= 2)
      add("B. name-year-vs-db", t.slug, `name says ${ny}, database says ${t.releaseYear}: "${t.name.slice(0, 60)}"`);
  }
}

// --- C. Synopsis-year vs DB-year ------------------------------------------------
// DB year very recent but synopsis explicitly states an older release year.
const synYear = /\b(?:released|from|de|circa|\()\s?(19[3-9]\d|20[0-1]\d|202[0-2])\b/i;
for (const t of titles) {
  if (t.releaseYear >= 2024 && t.synopsis) {
    const m = t.synopsis.match(synYear);
    if (m && t.releaseYear - parseInt(m[1], 10) >= 3)
      add("C. synopsis-year-vs-db", t.slug, `db=${t.releaseYear} but synopsis says ${m[1]}: "${t.name.slice(0, 50)}"`);
  }
}

// --- D. Placeholder / broken text ----------------------------------------------
for (const t of titles) {
  // "NaN" must be case-sensitive + word-bounded (else it matches Nandhini, NANAY, Nana Patekar…)
  if (/\b(undefined|null|\[object)\b/i.test(t.name) || /\bNaN\b/.test(t.name))
    add("D. broken-name", t.slug, `name: "${t.name.slice(0, 60)}"`);
  if (!t.synopsis || t.synopsis.trim().length < 10) add("D. empty-synopsis", t.slug, `"${t.name.slice(0, 50)}"`);
}

// --- E. Duplicate active streams --------------------------------------------------
const byUrl = new Map();
for (const t of titles) {
  if (!t.streamUrl) continue;
  if (byUrl.has(t.streamUrl)) add("E. duplicate-stream", t.slug, `same stream as ${byUrl.get(t.streamUrl)}`);
  else byUrl.set(t.streamUrl, t.slug);
}

// --- Report -------------------------------------------------------------------
if (findings.length === 0) {
  console.log(`# Content QA — CLEAN\nScanned ${titles.length} active titles. No findings.`);
} else {
  console.log(`# Content QA report\nFINDINGS: ${findings.length} (scanned ${titles.length} active titles)\n`);
  const byCheck = {};
  for (const f of findings) (byCheck[f.check] ||= []).push(f);
  for (const [check, list] of Object.entries(byCheck)) {
    console.log(`## ${check} — ${list.length}\n`);
    for (const f of list.slice(0, 40)) console.log(`- \`${f.slug}\` — ${f.detail}`);
    if (list.length > 40) console.log(`- …and ${list.length - 40} more`);
    console.log("");
  }
  console.log(`\n_Read-only scan (content-qa.yml, weekly Sat). Fixes: agent/founder. Origin: user-testing 12 Sep 2026._`);
}
await p.$disconnect();
