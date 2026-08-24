// DISASTER RECOVERY: rebuild the entire catalog from the git-committed
// JSON snapshots (prisma/backup_*.json) into a FRESH database.
//
// Usage (after `npx prisma db push` against the new DATABASE_URL):
//   node scripts/restore_from_backup.mjs
//
// Idempotent: skips rows whose unique keys already exist, so it can resume
// after interruption. Restores channels, flat titles (movies/docs), and
// series with all seasons/episodes — including isActive/lastStatus flags
// (geo-hidden titles stay hidden). User accounts/watchlists are NOT in the
// snapshots (privacy) — accounts are optional on Whisco TV; users simply
// re-register.
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const read = (f) => JSON.parse(fs.readFileSync(`prisma/${f}`, 'utf-8'));

// --- Channels ---
const channels = read('backup_channels.json');
{
  const existing = new Set((await prisma.channel.findMany({ select: { streamUrl: true } })).map((c) => c.streamUrl));
  const rows = channels
    .filter((c) => !existing.has(c.streamUrl))
    .map(({ id, epg, ...c }) => ({ ...c, lastCheckedAt: c.lastCheckedAt ? new Date(c.lastCheckedAt) : null }));
  for (let i = 0; i < rows.length; i += 200) {
    await prisma.channel.createMany({ data: rows.slice(i, i + 200), skipDuplicates: true });
  }
  console.log(`channels: +${rows.length} (of ${channels.length})`);
}

// --- Flat titles (movies/docs, no seasons) ---
const flat = read('backup_titles_flat.json');
{
  const existing = new Set((await prisma.title.findMany({ select: { slug: true } })).map((t) => t.slug));
  const rows = flat
    .filter((t) => !existing.has(t.slug))
    .map(({ id, ...t }) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      lastCheckedAt: t.lastCheckedAt ? new Date(t.lastCheckedAt) : null,
    }));
  for (let i = 0; i < rows.length; i += 200) {
    await prisma.title.createMany({ data: rows.slice(i, i + 200), skipDuplicates: true });
    if (i % 2000 === 0) console.log('flat titles progress:', i, '/', rows.length);
  }
  console.log(`flat titles: +${rows.length} (of ${flat.length})`);
}

// --- Series with seasons/episodes ---
const series = read('backup_series_full.json');
{
  let added = 0;
  for (const s of series) {
    const exists = await prisma.title.findUnique({ where: { slug: s.slug }, select: { id: true } });
    if (exists) continue;
    const { id, seasons, ...t } = s;
    const title = await prisma.title.create({
      data: {
        ...t,
        createdAt: new Date(t.createdAt),
        lastCheckedAt: t.lastCheckedAt ? new Date(t.lastCheckedAt) : null,
      },
    });
    for (const season of seasons) {
      const row = await prisma.season.create({ data: { titleId: title.id, number: season.number } });
      const eps = season.episodes.map(({ id: _e, seasonId: _s, ...e }) => ({ ...e, seasonId: row.id }));
      for (let i = 0; i < eps.length; i += 300) {
        await prisma.episode.createMany({ data: eps.slice(i, i + 300) });
      }
    }
    added++;
    if (added % 50 === 0) console.log('series progress:', added, '/', series.length);
  }
  console.log(`series: +${added} (of ${series.length})`);
}

console.log('RESTORE COMPLETE. totals:', {
  channels: await prisma.channel.count(),
  titles: await prisma.title.count(),
  episodes: await prisma.episode.count(),
});
await prisma.$disconnect();
