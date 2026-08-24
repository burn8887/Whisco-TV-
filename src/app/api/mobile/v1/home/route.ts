import { NextResponse } from "next/server";
import { getBrowseRows, getHomeStats } from "@/lib/cached";

// Mobile API v1 — home screen payload.
// Public, read-only, served from the same cache layer as the website so the
// app adds ~zero DB load. Versioned under /api/mobile/v1 so future app
// versions can evolve without breaking older installs.

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

export async function GET() {
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
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
