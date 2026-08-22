import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Cached catalog reads.
//
// WHY: the catalog changes at most every few hours (health-check / updater
// crons), but every page render was querying Neon directly. With ~17k pages
// in the sitemap, crawler traffic alone blew through Neon's 5GB/month
// transfer allowance. These helpers serve repeated reads from Vercel's data
// cache instead, cutting DB egress by ~95% while keeping content at most
// 15 minutes stale (invisible next to the cron cadence).
//
// Personalization (auth, watchlist state, progress) is NEVER cached — those
// queries stay live in the pages, and only run for logged-in users.
// ---------------------------------------------------------------------------

const REVAL = 900; // 15 minutes
const REVAL_SLOW = 3600; // 1 hour — sitemap/stats

// Slim episode selection — full rows were the biggest payload on Neon egress.
const EPISODE_SELECT = {
  id: true,
  number: true,
  name: true,
  synopsis: true,
  durationMins: true,
  stillUrl: true,
  streamUrl: true,
} as const;

export const getTitlePageData = unstable_cache(
  async (slug: string) => {
    const title = await prisma.title.findUnique({
      where: { slug },
      include: {
        seasons: {
          include: { episodes: { select: EPISODE_SELECT, orderBy: { number: "asc" } } },
          orderBy: { number: "asc" },
        },
      },
    });
    if (!title || !title.isActive) return { title: null, similar: [] };
    const similar = await prisma.title.findMany({
      where: {
        type: title.type,
        id: { not: title.id },
        isActive: true,
        genres: { contains: title.genres.split(",")[0].trim() },
      },
      take: 12,
    });
    return { title, similar };
  },
  ["title-page"],
  { revalidate: REVAL }
);

export const getEpisodePageData = unstable_cache(
  async (id: string) => {
    return prisma.episode.findUnique({
      where: { id },
      include: {
        season: {
          include: {
            title: {
              include: {
                seasons: {
                  include: { episodes: { select: EPISODE_SELECT, orderBy: { number: "asc" } } },
                  orderBy: { number: "asc" },
                },
              },
            },
          },
        },
      },
    });
  },
  ["episode-page"],
  { revalidate: REVAL }
);

export const getMoviePageData = unstable_cache(
  async (id: string) => prisma.title.findUnique({ where: { id } }),
  ["movie-page"],
  { revalidate: REVAL }
);

export const getChannelPageData = unstable_cache(
  async (id: string) => {
    const channel = await prisma.channel.findUnique({ where: { id } });
    if (!channel) return { channel: null, related: [] };
    const related = await prisma.channel.findMany({
      where: { category: channel.category, id: { not: channel.id }, isActive: true },
      take: 8,
    });
    return { channel, related };
  },
  ["channel-page"],
  { revalidate: REVAL }
);

export const getLivePageData = unstable_cache(
  async (country: string, category: string, language: string, q: string, page: number, pageSize: number) => {
    const where: Record<string, unknown> = { isActive: true };
    if (country) where.country = country;
    if (category) where.category = category;
    if (language) where.language = language;
    if (q) where.name = { contains: q, mode: "insensitive" };
    const [channels, countries, categories, languageGroups, filteredCount, total] = await Promise.all([
      prisma.channel.findMany({
        where,
        orderBy: [{ country: "asc" }, { number: "asc" }],
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true }, orderBy: { country: "asc" } }),
      prisma.channel.findMany({ distinct: ["category"], where: { isActive: true }, select: { category: true }, orderBy: { category: "asc" } }),
      prisma.channel.groupBy({ by: ["language"], where: { isActive: true }, _count: { _all: true }, orderBy: { _count: { language: "desc" } } }),
      prisma.channel.count({ where }),
      prisma.channel.count({ where: { isActive: true } }),
    ]);
    return { channels, countries, categories, languageGroups, filteredCount, total };
  },
  ["live-page"],
  { revalidate: REVAL }
);

export const getVodShelves = unstable_cache(
  async (order: string[]) => {
    const [groups, total] = await Promise.all([
      prisma.title.groupBy({ by: ["collection"], where: { isActive: true }, _count: { _all: true } }),
      prisma.title.count({ where: { isActive: true } }),
    ]);
    const counts = new Map(groups.map((g) => [g.collection, g._count._all]));
    const shelves = order.filter((c) => (counts.get(c) ?? 0) > 0);
    const shelfTitles = await Promise.all(
      shelves.map((c) =>
        prisma.title.findMany({
          where: { collection: c, isActive: true },
          orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
          take: 12,
        })
      )
    );
    return { shelves, shelfTitles, counts: Object.fromEntries(counts), total };
  },
  ["vod-shelves"],
  { revalidate: REVAL }
);

export const getVodGrid = unstable_cache(
  async (collection: string, q: string, page: number, pageSize: number) => {
    const where: Record<string, unknown> = { isActive: true };
    if (collection) where.collection = collection;
    if (q) where.name = { contains: q, mode: "insensitive" };
    const [titles, filteredCount] = await Promise.all([
      prisma.title.findMany({
        where,
        orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.title.count({ where }),
    ]);
    return { titles, filteredCount };
  },
  ["vod-grid"],
  { revalidate: REVAL }
);

export const getBrowseRows = unstable_cache(
  async () => {
    const [featured, trending, newReleases, movies, series, docs, channels] = await Promise.all([
      prisma.title.findMany({ where: { isFeatured: true, isActive: true }, take: 5 }),
      prisma.title.findMany({ where: { isTrending: true, isActive: true }, take: 16 }),
      prisma.title.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 16 }),
      prisma.title.findMany({ where: { type: "MOVIE", isActive: true }, take: 16 }),
      prisma.title.findMany({ where: { type: "SERIES", isActive: true }, take: 16 }),
      prisma.title.findMany({ where: { type: "DOCUMENTARY", isActive: true }, take: 16 }),
      prisma.channel.findMany({ where: { isActive: true, isFeatured: true }, take: 12 }),
    ]);
    return { featured, trending, newReleases, movies, series, docs, channels };
  },
  ["browse-rows"],
  { revalidate: REVAL }
);

export const getHomeStats = unstable_cache(
  async () => {
    const [channelCount, titleCount, countries, featuredTitles] = await Promise.all([
      prisma.channel.count({ where: { isActive: true } }),
      prisma.title.count({ where: { isActive: true } }),
      prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true } }),
      prisma.title.findMany({ where: { isFeatured: true, isActive: true }, take: 8 }),
    ]);
    return { channelCount, titleCount, countries, featuredTitles };
  },
  ["home-stats"],
  { revalidate: REVAL_SLOW }
);

export const getSitemapData = unstable_cache(
  async () => {
    const [titles, channels] = await Promise.all([
      prisma.title.findMany({
        where: { isActive: true },
        select: { slug: true, createdAt: true, isTrending: true, language: true },
      }),
      prisma.channel.findMany({ where: { isActive: true }, select: { id: true } }),
    ]);
    return { titles, channels };
  },
  ["sitemap-data"],
  { revalidate: REVAL_SLOW }
);

export const getAboutStats = unstable_cache(
  async () => {
    const [channels, titles, countries] = await Promise.all([
      prisma.channel.count({ where: { isActive: true } }),
      prisma.title.count({ where: { isActive: true } }),
      prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true } }),
    ]);
    return { channels, titles, countryCount: countries.length };
  },
  ["about-stats"],
  { revalidate: REVAL_SLOW }
);
