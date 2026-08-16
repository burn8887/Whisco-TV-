// Seed prisma/vod_youtube.json (official-channel YouTube VOD harvest) into
// the database. Idempotent: skips slugs that already exist. Run with:
//   node scripts/seed_youtube_vod.mjs
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const rows = JSON.parse(fs.readFileSync('prisma/vod_youtube.json', 'utf-8'));
console.log('harvest rows:', rows.length);

const existing = new Set((await prisma.title.findMany({ select: { slug: true } })).map(t => t.slug));
const fresh = rows.filter(r => !existing.has(r.slug));
console.log('new rows to insert:', fresh.length, '| already present:', rows.length - fresh.length);

const data = fresh.map(r => ({
  name: r.name,
  slug: r.slug,
  type: r.type,
  synopsis: r.synopsis,
  posterUrl: r.posterUrl,
  backdropUrl: r.backdropUrl,
  releaseYear: r.releaseYear,
  rating: r.rating,
  imdbRating: r.imdbRating,
  durationMins: r.durationMins,
  genres: r.genres,
  collection: r.collection,
  cast: r.cast,
  director: r.director,
  country: r.country,
  language: r.language,
  streamUrl: r.streamUrl,
  isActive: true,
}));

const BATCH = 250;
let inserted = 0;
for (let i = 0; i < data.length; i += BATCH) {
  const res = await prisma.title.createMany({ data: data.slice(i, i + BATCH), skipDuplicates: true });
  inserted += res.count;
  if ((i / BATCH) % 10 === 0) console.log('progress:', inserted, '/', data.length);
}
console.log('inserted:', inserted);
console.log('total titles now:', await prisma.title.count());
await prisma.$disconnect();
