import { NextResponse } from "next/server";
import { getVodShelves, getVodGrid } from "@/lib/cached";

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
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
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
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
