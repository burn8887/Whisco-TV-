import { NextResponse } from "next/server";
import { getBrowseRows, getHomeStats } from "@/lib/cached";
import { isIosStore, isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosLiveOnlyChannels, toIosLivePayload } from "@/lib/store-ios-live";
import { getAndroidFilms, getAndroidLiveChannels, ANDROID_SHELF_LABEL } from "@/lib/store-android";

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
  // ------------------------------------------- iOS BUILD 8: live eight, no rails
  // Apple 5.2.2, second rejection (2026-09-28). The Home payload for the Apple
  // binary is the eight live rows and nothing else:
  //   hero        -> [] (hero renders on-demand artwork — a poster wall)
  //   rows        -> [] (the docs / publicdomain rails were the films)
  //   stats.titles-> 0  (this build carries no on-demand title at all)
  // featuredChannels keeps the eight, because that is the list the Home screen
  // draws and the reviewer's path starts there.
  if (isIosStore(req)) {
    const channels = toIosLivePayload(await getIosLiveOnlyChannels());

    return NextResponse.json(
      {
        store: requestedStore(req),
        // Counts of what this binary actually offers. Never the public totals:
        // advertising titles the build does not carry is Guideline 2.3.1(a).
        stats: { channels: channels.length, titles: 0 },
        hero: [],
        rows: [],
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

  // -------------------------------------------------- cleared store (Android/Play)
  // THE ANDROID HOME (Desk work order, 2026-10-05 21:30 AST): news first, then the
  // colour shelf.
  //
  //   featuredChannels -> the thirty official news lives, first in the payload
  //                       and first on the screen, which is where the home has
  //                       started since build 8;
  //   rows             -> ONE shelf: the colour on-demand titles, no others. The
  //                       shelf that used to be here was the eight Archive scans
  //                       (seven of them black and white) and it is gone from the
  //                       Android store;
  //   hero             -> [] — the hero was five black-and-white posters. No
  //                       black-and-white card sits anywhere on this home;
  //   stats            -> not sent. "No 'Free'. No 600 or 15,000." (Desk order.)
  //                       Build 8's home screen stopped drawing the count line; the
  //                       payload now stops carrying the numbers as well. Nothing
  //                       in the app reads `stats` (grep across app/ and src/ of
  //                       whisco-mobile, 2026-10-05).
  //
  // No "Movies" row and no "Series" row: this surface must not read as a
  // cinema/dizi storefront (Grok's lock, item 4).
  if (isClearedStore(req)) {
    const [films, channels] = [await getAndroidFilms(), getAndroidLiveChannels()];

    return NextResponse.json(
      {
        store: requestedStore(req),
        // Backward compatibility for the Play versionCode 7 client: its bundled
        // HomeScreen dereferences data.stats before it renders. This API field was
        // removed before that client could be replaced; derive truthful counts
        // from the exact Android allow-lists returned in this same response.
        stats: { channels: channels.length, titles: films.length },
        featuredChannels: channels.map((c) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logoUrl,
          category: c.category,
          country: c.country,
        })),
        hero: [],
        rows: [{ key: "pdcc", label: ANDROID_SHELF_LABEL, items: films.map(slim) }],
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
