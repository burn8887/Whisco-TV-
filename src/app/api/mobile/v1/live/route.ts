import { NextResponse } from "next/server";
import { getLivePageData } from "@/lib/cached";
import { isIosStore, IOS_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosLiveChannels } from "@/lib/store-ios";
import { excludeIosOnly } from "@/lib/store-public";

// Mobile API v1 — live TV directory with the same filters as the web page.
// GET /api/mobile/v1/live?country=&category=&language=&q=&page=1
//
// STORE SPLIT (Apple 5.2.2, build 6):
//   X-Whisco-Store: ios  -> ONLY channels cleared for the App Store build.
//   anything else        -> the full public directory (website + Android).
// The iOS path never falls back to the public catalogue: if nothing is cleared,
// it returns an empty list, which is the honest answer.

export const dynamic = "force-dynamic";
const PAGE_SIZE = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);

  // ---------------------------------------------------------------- iOS store
  if (isIosStore(req)) {
    const channels = await getIosLiveChannels();

    return NextResponse.json(
      {
        store: "ios",
        page: 1,
        pageSize: channels.length,
        filteredCount: channels.length,
        total: channels.length,
        channels: channels.map((c) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logoUrl,
          streamUrl: c.streamUrl,
          country: c.country,
          language: c.language,
          category: c.category,
          isHD: c.isHD,
          rightsBasis: c.rightsBasis ?? null,
          evidenceUrl: c.evidenceUrl ?? null,
        })),
        // Deliberately NO facets. The public directory advertises language chips
        // ("Arabic 164", "Hindi 142") describing a catalogue this build does not
        // carry — that is Guideline 2.3.1(a), promoting content the app does not
        // offer, and it is also the exact frame Apple screenshotted on 15 Sep.
        facets: null,
      },
      { headers: IOS_HEADERS }
    );
  }

  // ------------------------------------------------------------- public store
  const publicFilters = {
    country: url.searchParams.get("country") || "",
    category: url.searchParams.get("category") || "",
    language: url.searchParams.get("language") || "",
    q: url.searchParams.get("q") || "",
  };
  const pageData = await getLivePageData(
    publicFilters.country,
    publicFilters.category,
    publicFilters.language,
    publicFilters.q,
    page,
    PAGE_SIZE
  );
  // App-Store-only rows never appear in the public directory, and neither do their
  // counts or chips. See src/lib/store-public.ts for why this is not in cached.ts.
  const { channels, countries, categories, languageGroups, filteredCount, total } =
    await excludeIosOnly(pageData, publicFilters);

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
    { headers: PUBLIC_HEADERS }
  );
}
