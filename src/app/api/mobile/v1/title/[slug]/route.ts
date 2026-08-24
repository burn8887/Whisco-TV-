import { NextResponse } from "next/server";
import { getTitlePageData } from "@/lib/cached";

// Mobile API v1 — full title detail (movie/doc streamUrl, or series with
// seasons+episodes) + similar titles.

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, similar } = await getTitlePageData(slug);
  if (!title) return NextResponse.json({ error: "not-found" }, { status: 404 });

  return NextResponse.json(
    {
      title: {
        id: title.id,
        slug: title.slug,
        name: title.name,
        type: title.type,
        synopsis: title.synopsis,
        posterUrl: title.posterUrl,
        backdropUrl: title.backdropUrl,
        releaseYear: title.releaseYear,
        rating: title.rating,
        imdbRating: title.imdbRating,
        durationMins: title.durationMins,
        genres: title.genres,
        collection: title.collection,
        cast: title.cast,
        country: title.country,
        language: title.language,
        streamUrl: title.streamUrl,
        seasons: title.seasons.map((s) => ({
          number: s.number,
          episodes: s.episodes.map((e) => ({
            id: e.id,
            number: e.number,
            name: e.name,
            synopsis: e.synopsis,
            durationMins: e.durationMins,
            stillUrl: e.stillUrl,
            streamUrl: e.streamUrl,
          })),
        })),
      },
      similar: similar.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        posterUrl: t.posterUrl,
        type: t.type,
        releaseYear: t.releaseYear,
        imdbRating: t.imdbRating,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
