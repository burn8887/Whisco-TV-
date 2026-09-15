/**
 * IOS STORE QUERIES — the narrowed, evidence-only catalogue.
 *
 * Why this file exists instead of a filter inside `cached.ts`:
 * `getVodShelves` / `getVodGrid` / `getLivePageData` in `cached.ts` serve BOTH
 * the public website and /api/mobile/v1. Gating them would empty the website.
 * Grok's lock is explicit: "Do not gate cached.ts." So the iOS store gets its
 * own small queries here, and the routes choose which to call.
 *
 * Every query below filters on `clearedForApp: true`. That column defaults to
 * false on both Title and Channel, so:
 *   - every harvested row starts invisible to the App Store build;
 *   - a human must set it true with evidence, deliberately, one row at a time;
 *   - forgetting to clear something hides content rather than exposing it.
 * That is the fail-closed direction, and it is the right one for 5.2.2.
 *
 * The cleared catalogue is intentionally small (Grok's floor: 8-15 live, 30-80
 * VOD), so these queries are cheap and need no pagination cleverness.
 */

import { prisma } from "@/lib/prisma";

/** Live channels cleared for the App Store build. Order stable for the reviewer. */
export async function getIosLiveChannels(limit = 60) {
  return prisma.channel.findMany({
    where: { isActive: true, clearedForApp: true },
    orderBy: [{ isFeatured: "desc" }, { number: "asc" }, { name: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      logoUrl: true,
      streamUrl: true,
      country: true,
      language: true,
      category: true,
      isHD: true,
      rightsBasis: true,
      evidenceUrl: true,
    },
  });
}

/** Counts that describe ONLY what this build actually offers.
 *  Deliberately not the public catalogue totals: an app that advertises 16,841
 *  titles it does not carry is Guideline 2.3.1(a) — promoting content the app
 *  does not offer. The iOS home screen must count its own shelves. */
export async function getIosStats() {
  const [channels, titles] = await Promise.all([
    prisma.channel.count({ where: { isActive: true, clearedForApp: true } }),
    prisma.title.count({ where: { isActive: true, clearedForApp: true } }),
  ]);
  return { channels, titles };
}

/**
 * The iOS home shelves. No "Movies" row and no "Series" row — Grok: "iOS On
 * Demand must not look like cinema/dizi/musalsal." What remains is public-domain
 * material and documentary/news, which is what the reviewer is meant to find.
 */
export async function getIosShelves() {
  const base = {
    isActive: true,
    clearedForApp: true,
  } as const;

  const select = {
    id: true,
    slug: true,
    name: true,
    posterUrl: true,
    backdropUrl: true,
    type: true,
    releaseYear: true,
    imdbRating: true,
    collection: true,
    isNew: true,
  } as const;

  const [featured, docs, publicDomain] = await Promise.all([
    prisma.title.findMany({
      where: { ...base, isFeatured: true },
      orderBy: [{ imdbRating: "desc" }],
      take: 5,
      select,
    }),
    prisma.title.findMany({
      where: { ...base, type: "DOCUMENTARY" },
      orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
      take: 20,
      select,
    }),
    prisma.title.findMany({
      where: { ...base, sourceKind: "archive-org" },
      orderBy: [{ releaseYear: "asc" }],
      take: 20,
      select,
    }),
  ]);

  return { featured, docs, publicDomain };
}

/** Cleared on-demand titles, optionally within one collection. No fallback. */
export async function getIosVodTitles(opts: { collection?: string; q?: string; limit?: number } = {}) {
  const { collection = "", q = "", limit = 80 } = opts;
  return prisma.title.findMany({
    where: {
      isActive: true,
      clearedForApp: true,
      ...(collection ? { collection } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      name: true,
      posterUrl: true,
      backdropUrl: true,
      type: true,
      releaseYear: true,
      imdbRating: true,
      collection: true,
      isNew: true,
      rightsBasis: true,
      evidenceUrl: true,
    },
  });
}

/** Collection facets computed from the CLEARED set only, so the chips never
 *  advertise a catalogue this build does not carry. */
export async function getIosCollections() {
  const rows = await prisma.title.groupBy({
    by: ["collection"],
    where: { isActive: true, clearedForApp: true, NOT: { collection: "" } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ collection: r.collection, count: r._count._all }))
    .sort((a, b) => b.count - a.count);
}

/** One cleared channel, or null. Null means the route returns 404 — never a fallback. */
export async function getIosChannel(id: string) {
  return prisma.channel.findFirst({
    where: { id, isActive: true, clearedForApp: true },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      streamUrl: true,
      country: true,
      language: true,
      category: true,
      isHD: true,
      isActive: true,
      rightsBasis: true,
      evidenceUrl: true,
    },
  });
}

/** One cleared on-demand title with its episodes, or null. */
export async function getIosTitle(slug: string) {
  return prisma.title.findFirst({
    where: { slug, isActive: true, clearedForApp: true },
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      synopsis: true,
      posterUrl: true,
      backdropUrl: true,
      releaseYear: true,
      rating: true,
      imdbRating: true,
      durationMins: true,
      genres: true,
      collection: true,
      cast: true,
      country: true,
      language: true,
      streamUrl: true,
      sourceKind: true,
      uploaderUrl: true,
      rightsBasis: true,
      evidenceUrl: true,
      seasons: {
        select: {
          number: true,
          episodes: {
            select: { id: true, number: true, name: true, synopsis: true, stillUrl: true, streamUrl: true, durationMins: true },
            orderBy: { number: "asc" as const },
          },
        },
        orderBy: { number: "asc" as const },
      },
    },
  });
}

/** Related titles for the iOS store — cleared only. */
export async function getIosSimilar(titleId: string, collection: string, take = 8) {
  return prisma.title.findMany({
    where: {
      isActive: true,
      clearedForApp: true,
      collection,
      NOT: { id: titleId },
    },
    orderBy: [{ imdbRating: "desc" }],
    take,
    select: { id: true, slug: true, name: true, posterUrl: true, type: true, releaseYear: true, imdbRating: true },
  });
}
