import { NextResponse } from "next/server";
import { getVodShelves, getVodGrid } from "@/lib/cached";
import { isIosStore, isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosVodTitles, getIosCollections } from "@/lib/store-ios";

// Mobile API v1 — VOD.
//  GET /api/mobile/v1/vod                    → shelves (browse mode)
//  GET /api/mobile/v1/vod?collection=X&page= → grid within a collection
//  GET /api/mobile/v1/vod?q=search           → search

export const dynamic = "force-dynamic";
const PAGE_SIZE = 60;

const ORDER = [
  "Turkish Dizi",
  "Hindi Cinema",
  "Hindi Serials & Shows",
  "Pakistani Dramas",
  "Free Movies & TV",
  "Game Shows",
  "Malayalam Cinema",
  "Bangla Natok & Cinema",
  "Tamil Cinema & Serials",
  "Telugu Cinema",
  "Filipino Shows",
  "Arabic Series & Shows",
  "Indonesian Shows",
  "Nepali Cinema",
  "Punjabi Cinema",
  "Sinhala Teledramas",
  "Cartoons & Kids",
  "Comedy Classics",
  "Classic Movies",
  "Sci-Fi & Horror",
  "Crime & Mystery",
  "Westerns",
  "Drama & Romance",
  "Action & Adventure",
  "Classic TV",
  "Documentaries",
  "Science & Space",
  "History & War",
];

const slim = (t: {
  id: string;
  slug: string;
  name: string;
  posterUrl: string;
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
  type: t.type,
  releaseYear: t.releaseYear,
  imdbRating: t.imdbRating,
  collection: t.collection,
  isNew: t.isNew,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collection = url.searchParams.get("collection") || "";
  const q = url.searchParams.get("q") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);

  // ------------------------------------------- iOS BUILD 8: NO ON-DEMAND, EVER
  // Apple 5.2.2, second rejection (2026-09-28): "documentary evidence from the
  // rights holder" for the films, or remove them. We have no signed carriage
  // letters for films, and a public-domain declaration published by the Internet
  // Archive is not a grant issued by a rights holder — nor is there a rights
  // holder to write one for a public-domain work. So the films are gone from the
  // Apple binary, and this endpoint answers EMPTY on every shape of request:
  // shelves, collection, search.
  //
  // 200, not 500 — an app that errors is a different bug Apple would find. An
  // empty list is the honest answer and the one the build renders.
  if (isIosStore(req)) {
    return NextResponse.json(
      {
        store: requestedStore(req),
        mode: collection || q ? "grid" : "shelves",
        onDemand: false,
        collection,
        q,
        page: 1,
        pageSize: 0,
        filteredCount: 0,
        total: 0,
        shelves: [],
        items: [],
      },
      { headers: CLEARED_HEADERS }
    );
  }

  // -------------------------------------------------- cleared store (Android/Play)
  // Unchanged: the Play packet in review carries 8 live + these 8 films. An
  // Apple decision does not get to change what Google is reviewing.
  if (isClearedStore(req)) {
    if (!collection && !q) {
      const [items, collections] = await Promise.all([getIosVodTitles({ limit: 80 }), getIosCollections()]);
      return NextResponse.json(
        {
          store: requestedStore(req),
          mode: "shelves",
          total: items.length,
          // Shelves are derived from the CLEARED set, so no chip or count can
          // advertise a catalogue this build does not carry.
          shelves: collections.map((c) => ({
            name: c.collection,
            count: c.count,
            items: items.filter((t) => t.collection === c.collection).map(slim),
          })),
          items: items.map(slim),
        },
        { headers: CLEARED_HEADERS }
      );
    }
    const items = await getIosVodTitles({ collection, q, limit: 80 });
    return NextResponse.json(
      {
        store: requestedStore(req),
        mode: "grid",
        collection,
        q,
        page: 1,
        pageSize: items.length,
        filteredCount: items.length,
        total: items.length,
        items: items.map(slim),
      },
      { headers: CLEARED_HEADERS }
    );
  }

  if (!collection && !q) {
    const { shelves, shelfTitles, counts, total } = await getVodShelves(ORDER);
    return NextResponse.json(
      {
        mode: "shelves",
        total,
        shelves: shelves.map((name, i) => ({
          name,
          count: (counts as Record<string, number>)[name] ?? 0,
          items: shelfTitles[i].map(slim),
        })),
      },
      { headers: PUBLIC_HEADERS }
    );
  }

  const { titles, filteredCount } = await getVodGrid(collection, q, page, PAGE_SIZE);
  return NextResponse.json(
    {
      mode: "grid",
      collection,
      q,
      page,
      pageSize: PAGE_SIZE,
      filteredCount,
      items: titles.map(slim),
    },
    { headers: PUBLIC_HEADERS }
  );
}
