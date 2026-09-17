import { NextResponse } from "next/server";
import { getBrowseRows, getHomeStats } from "@/lib/cached";
import { isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosLiveChannels, getIosShelves, getIosStats } from "@/lib/store-ios";

// Mobile API v1 — home screen payload.
// Public, read-only, served from the same cache layer as the website so the
// app adds ~zero DB load. Versioned under /api/mobile/v1 so future app
// versions can evolve without breaking older installs.
//
// STORE SPLIT (Apple 5.2.2, build 6): the iOS store gets its own small,
// evidence-only home. Critically, its `stats` count what THIS BUILD carries, not
// the public catalogue — advertising 16,841 titles the build does not offer is
// Guideline 2.3.1(a).

export const dynamic = "force-dynamic";

const slim = (t: {
  id: string;
  slug: string;
  name: string;
  posterUrl: string;
  backdropUrl: string;
  type: string;
  releaseYear: number;
  imdbRating: number;
  collection: string;
  isNew: boolean;
}) => ({
  id: t.id,
  slug: t.slug,
  name: t.name,
  posterUrl: t.posterUrl,
  backdropUrl: t.backdropUrl,
  type: t.type,
  releaseYear: t.releaseYear,
  imdbRating: t.imdbRating,
  collection: t.collection,
  isNew: t.isNew,
});

export async function GET(req: Request) {
  // -------------------------------------------------- cleared store (iOS/Android)
  if (isClearedStore(req)) {
    const [stats, { featured, docs, publicDomain }, channels] = await Promise.all([
      getIosStats(),
      getIosShelves(),
      getIosLiveChannels(15),
    ]);

    const rows = [
      { key: "live", label: "Live News & Public Service", items: [] as ReturnType<typeof slim>[] },
      { key: "docs", label: "Documentaries", items: docs.map(slim) },
      { key: "publicdomain", label: "Public Domain Classics", items: publicDomain.map(slim) },
    ].filter((r) => r.items.length > 0 || r.key === "live");

    return NextResponse.json(
      {
        store: requestedStore(req),
        // Counts of what this build actually offers — never the public totals.
        stats: { channels: stats.channels, titles: stats.titles },
        hero: featured.slice(0, 5).map(slim),
        rows,
        // No "Movies" row and no "Series" row: the iOS On Demand surface must not
        // read as a cinema/dizi storefront (Grok's lock, item 4).
        featuredChannels: channels.map((c) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logoUrl,
          category: c.category,
          country: c.country,
        })),
      },
      { headers: CLEARED_HEADERS }
    );
  }

  // ------------------------------------------------------------- public store
  const [{ featured, trending, newReleases, movies, series, docs, channels }, stats] = await Promise.all([
    getBrowseRows(),
    getHomeStats(),
  ]);

  return NextResponse.json(
    {
      stats: { channels: stats.channelCount, titles: stats.titleCount },
      hero: featured.slice(0, 5).map(slim),
      rows: [
        { key: "trending", label: "Trending Now", items: trending.map(slim) },
        { key: "new", label: "New on Whisco", items: newReleases.map(slim) },
        { key: "movies", label: "Movies", items: movies.map(slim) },
        { key: "series", label: "Series", items: series.map(slim) },
        { key: "docs", label: "Documentaries", items: docs.map(slim) },
      ],
      featuredChannels: channels.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        category: c.category,
        country: c.country,
      })),
    },
    { headers: PUBLIC_HEADERS }
  );
}
