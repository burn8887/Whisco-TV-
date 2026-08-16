import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

// Use archive.org's lightweight metadata API instead of hitting download
// endpoints (which rate-limit and time out under concurrency). For each
// title we confirm the item exists AND the exact file is still listed.
const titles = await prisma.title.findMany({ select: { id: true, slug: true, name: true, streamUrl: true } });
console.log('checking', titles.length, 'titles');

function parseArchive(url) {
  const m = url?.match(/archive\.org\/download\/([^/]+)\/(.+)$/);
  if (!m) return null;
  return { item: m[1], file: decodeURIComponent(m[2]) };
}

const metaCache = new Map();
async function getMeta(item) {
  if (metaCache.has(item)) return metaCache.get(item);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const res = await fetch(`https://archive.org/metadata/${item}`, { signal: ctrl.signal, headers: { 'User-Agent': 'WhiscoTV-VODCheck/1.0' } });
      clearTimeout(t);
      if (res.status === 404) { metaCache.set(item, null); return null; }
      if (!res.ok) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
      const j = await res.json();
      metaCache.set(item, j);
      return j;
    } catch { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); }
  }
  return 'ERR';
}

const dead = [], errors = [], nonArchive = [];
let done = 0;
const queue = [...titles];
async function worker() {
  while (queue.length) {
    const t = queue.shift();
    done++;
    const pa = parseArchive(t.streamUrl);
    if (!pa) { nonArchive.push(t); continue; }
    const meta = await getMeta(pa.item);
    if (meta === 'ERR') { errors.push(t); continue; }
    if (!meta || !meta.files || meta.is_dark) { dead.push({ ...t, reason: meta?.is_dark ? 'dark' : 'missing-item' }); continue; }
    const found = meta.files.some(f => f.name === pa.file || '/' + f.name === pa.file || f.name === pa.file.replace(/\+/g, ' '));
    if (!found) dead.push({ ...t, reason: 'missing-file' });
    if (done % 200 === 0) console.log('progress', done, '/', titles.length, 'dead:', dead.length, 'err:', errors.length);
  }
}
await Promise.all(Array.from({ length: 12 }, worker));
console.log('DONE. dead:', dead.length, 'errors:', errors.length, 'nonArchive:', nonArchive.length);
fs.writeFileSync('/tmp/dead_vod.json', JSON.stringify({ dead, errors, nonArchive: nonArchive.map(t => ({ name: t.name, url: t.streamUrl })) }, null, 1));
await prisma.$disconnect();
