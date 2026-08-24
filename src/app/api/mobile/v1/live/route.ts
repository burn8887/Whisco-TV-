import { NextResponse } from "next/server";
import { getLivePageData } from "@/lib/cached";

// Mobile API v1 — live TV directory with the same filters as the web page.
// GET /api/mobile/v1/live?country=&category=&language=&q=&page=1

export const dynamic = "force-dynamic";
const PAGE_SIZE = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);

  const { channels, countries, categories, languageGroups, filteredCount, total } = await getLivePageData(
    url.searchParams.get("country") || "",
    url.searchParams.get("category") || "",
    url.searchParams.get("language") || "",
    url.searchParams.get("q") || "",
    page,
    PAGE_SIZE
  );

  return NextResponse.json(
    {
      page,
      pageSize: PAGE_SIZE,
      filteredCount,
      total,
      channels: channels.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        streamUrl: c.streamUrl,
        country: c.country,
        language: c.language,
        category: c.category,
        isHD: c.isHD,
      })),
      facets: {
        countries: countries.map((c) => c.country),
        categories: categories.map((c) => c.category),
        languages: languageGroups.map((g) => ({ language: g.language, count: g._count._all })),
      },
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
