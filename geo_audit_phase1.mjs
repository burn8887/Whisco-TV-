// GCC geo-availability audit for all YouTube-embed VOD titles.
// Strategy: check per title — movies = its video; series = 3 sampled episodes.
// A video is GCC-OK if it has no country restriction, or its availableCountries
// includes at least one of BH/SA/AE/KW/QA/OM. Titles with all sampled videos
// GCC-blocked get hidden (isActive=false, lastStatus='geo').
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

const GCC = ['BH','SA','AE','KW','QA','OM'];
const vidOf = (u) => (u?.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/) || [])[1];

async function geoCheck(vid) {
  for (let a = 0; a < 2; a++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(`https://www.youtube.com/watch?v=${vid}&hl=en`, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
      clearTimeout(t);
      if (!res.ok) { await new Promise(r => setTimeout(r, 1500)); continue; }
      const html = await res.text();
      const m = html.match(/"availableCountries":\[([^\]]*)\]/);
      if (!m) return 'ok'; // no restriction block → worldwide
      const countries = m[1].replace(/"/g, '').split(',');
      return GCC.some(c => countries.includes(c)) ? 'ok' : 'blocked';
    } catch { await new Promise(r => setTimeout(r, 1500)); }
  }
  return 'unknown';
}

// All YouTube titles
const titles = await prisma.title.findMany({
  where: { OR: [ { streamUrl: { contains: 'youtube.com/embed' } }, { seasons: { some: { episodes: { some: { streamUrl: { contains: 'youtube.com/embed' } } } } } } ] },
  select: { id: true, name: true, type: true, streamUrl: true, director: true, isActive: true,
    seasons: { select: { episodes: { select: { streamUrl: true }, orderBy: { number: 'asc' } } }, orderBy: { number: 'asc' } } },
});
console.log('YouTube titles to audit:', titles.length);

// Phase 1: brand sampling — group by director, sample up to 6 titles per brand
const brands = new Map();
for (const t of titles) {
  const b = t.director || 'unknown';
  if (!brands.has(b)) brands.set(b, []);
  brands.get(b).push(t);
}
console.log('brands:', brands.size);

function sampleVids(t) {
  if (t.type !== 'SERIES') return [vidOf(t.streamUrl)].filter(Boolean);
  const eps = t.seasons.flatMap(s => s.episodes);
  if (!eps.length) return [];
  const idx = [0, Math.floor(eps.length/2), eps.length-1];
  return [...new Set(idx.map(i => vidOf(eps[i].streamUrl)).filter(Boolean))];
}

const brandStatus = new Map();
let done = 0;
for (const [brand, list] of brands) {
  const sample = list.slice(0, 6).flatMap(t => sampleVids(t).slice(0, 2)).slice(0, 8);
  const results = [];
  await Promise.all(sample.map(async v => results.push(await geoCheck(v))));
  const ok = results.filter(r => r === 'ok').length;
  const blocked = results.filter(r => r === 'blocked').length;
  const status = blocked === 0 ? 'clean' : ok === 0 ? 'all-blocked' : 'mixed';
  brandStatus.set(brand, status);
  done++;
  console.log(`[${done}/${brands.size}] ${brand.slice(0,40)}: ${status} (ok=${ok} blocked=${blocked} n=${results.length})`);
}
fs.writeFileSync('/tmp/brand_status.json', JSON.stringify([...brandStatus], null, 1));
console.log('PHASE1 DONE');
await prisma.$disconnect();
