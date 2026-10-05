import { NextResponse } from "next/server";
import { getTitlePageData } from "@/lib/cached";
import { isIosStore, isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getAndroidFilm, getAndroidSimilar } from "@/lib/store-android";

// Mobile API v1 — full title detail (movie/doc streamUrl, or series with
// seasons+episodes) + similar titles.

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ------------------------------------- iOS BUILD 8: every on-demand title is 404
  // Apple 5.2.2, second rejection (2026-09-28). The Apple binary carries eight
  // live news streams and no on-demand title whatsoever, so EVERY title is a
  // hard 404 here — not a filtered one, not a fallback. A deep link from build 6
  // or 7, a bookmark, a shared URL, or a hand-typed archive slug all land on the
  // same 404. There is no input that returns a film or a series on this store.
  if (isIosStore(req)) {
    return NextResponse.json({ error: "not-found" }, { status: 404, headers: CLEARED_HEADERS });
  }

  // ------------------------------------------- cleared store (Android/Play)
  // THE ANDROID SHELF (Desk work order, 2026-10-05): one film can be reached here
  // only if its slug is in ANDROID_FILMS, and it is served with the item page and
  // the licence statement that were read off that page — not with our editorial
  // row's own words. The eight Archive scans that used to be reachable are not.
  if (isClearedStore(req)) {
    const title = await getAndroidFilm(slug);
    if (!title) return NextResponse.json({ error: "not-found" }, { status: 404, headers: CLEARED_HEADERS });
    const similar = await getAndroidSimilar(title.slug);

    return NextResponse.json(
      {
        store: requestedStore(req),
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
          // Shown in the app so the reviewer can check us without emailing us.
          rightsBasis: title.rightsBasis ?? null,
          evidenceUrl: title.evidenceUrl ?? null,
          uploaderUrl: title.uploaderUrl ?? null,
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
      { headers: CLEARED_HEADERS }
    );
  }

  // ------------------------------------------------------------- public store
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
    { headers: PUBLIC_HEADERS }
  );
}
