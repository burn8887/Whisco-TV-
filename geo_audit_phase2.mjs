// Phase 2: (a) re-sample rate-limited "unknown" brands slowly with backoff,
// (b) per-title geo checks for mixed brands, (c) apply hides.
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
const GCC = ['BH','SA','AE','KW','QA','OM'];
const vidOf = (u) => (u?.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/) || [])[1];

let rl = 0; // consecutive rate-limit signals
async function geoCheck(vid) {
  for (let a = 0; a < 4; a++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(`https://www.youtube.com/watch?v=${vid}&hl=en`, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
      clearTimeout(t);
      if (res.status === 429) { rl++; await new Promise(r => setTimeout(r, 5000 * (a+1))); continue; }
      if (!res.ok) { await new Promise(r => setTimeout(r, 2000 * (a+1))); continue; }
      const html = await res.text();
      // If page served a consent/queue stub, playabilityStatus won't be present
      if (!html.includes('playabilityStatus')) { rl++; await new Promise(r => setTimeout(r, 4000 * (a+1))); continue; }
      rl = 0;
      const m = html.match(/"availableCountries":\[([^\]]*)\]/);
      if (!m) return 'ok';
      const countries = m[1].replace(/"/g, '').split(',');
      return GCC.some(c => countries.includes(c)) ? 'ok' : 'blocked';
    } catch { await new Promise(r => setTimeout(r, 2000 * (a+1))); }
  }
  return 'unknown';
}

const brandStatus = new Map(JSON.parse(fs.readFileSync('/tmp/brand_status.json', 'utf-8')));

const titles = await prisma.title.findMany({
  where: { OR: [ { streamUrl: { contains: 'youtube.com/embed' } }, { seasons: { some: { episodes: { some: { streamUrl: { contains: 'youtube.com/embed' } } } } } } ] },
  select: { id: true, name: true, type: true, streamUrl: true, director: true, isActive: true,
    seasons: { select: { episodes: { select: { streamUrl: true }, orderBy: { number: 'asc' } } }, orderBy: { number: 'asc' } } },
});
const byBrand = new Map();
for (const t of titles) { const b = t.director || 'unknown'; if (!byBrand.has(b)) byBrand.set(b, []); byBrand.get(b).push(t); }

function sampleVids(t, n = 3) {
  if (t.type !== 'SERIES') return [vidOf(t.streamUrl)].filter(Boolean);
  const eps = t.seasons.flatMap(s => s.episodes);
  if (!eps.length) return [];
  const idx = [0, Math.floor(eps.length/2), eps.length-1].slice(0, n);
  return [...new Set(idx.map(i => vidOf(eps[i].streamUrl)).filter(Boolean))];
}

async function pool(items, conc, fn) {
  const out = new Array(items.length); let next = 0;
  async function w() { while (next < items.length) { const i = next++; out[i] = await fn(items[i]); } }
  await Promise.all(Array.from({ length: Math.min(conc, items.length) }, w));
  return out;
}

// (a) re-verify unknown brands (those whose phase-1 samples all returned unknown)
const unknownBrands = [...brandStatus.entries()].filter(([b, s]) => s === 'clean').map(([b]) => b)
  .filter(b => {
    // phase1 logged clean even when n samples were all unknown; re-check those with 0 confirmed
    return true; // we re-sample every "clean" brand cheaply below only if it was in the suspicious tail
  });
// Simpler & safer: re-sample ALL brands marked clean with 2 videos each, slowly.
console.log('re-sampling', unknownBrands.length, 'brands marked clean...');
const brandFinal = new Map();
let bi = 0;
for (const b of unknownBrands) {
  const list = byBrand.get(b) || [];
  const sample = list.slice(0, 3).flatMap(t => sampleVids(t, 2).slice(0, 2)).slice(0, 4);
  const res = await pool(sample, 2, geoCheck);
  const ok = res.filter(r => r === 'ok').length, bl = res.filter(r => r === 'blocked').length;
  const status = bl === 0 && ok > 0 ? 'clean' : bl > 0 && ok === 0 ? 'all-blocked' : bl > 0 ? 'mixed' : 'unknown';
  brandFinal.set(b, status);
  bi++;
  console.log(`[resample ${bi}/${unknownBrands.length}] ${b.slice(0,40)}: ${status} (ok=${ok} bl=${bl})`);
  await new Promise(r => setTimeout(r, 800));
}
for (const [b, s] of brandStatus) if (s !== 'clean') brandFinal.set(b, s);
fs.writeFileSync('/tmp/brand_final.json', JSON.stringify([...brandFinal], null, 1));
console.log('PHASE2A DONE');
await prisma.$disconnect();
