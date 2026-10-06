import { NextResponse } from "next/server";
import { getLivePageData } from "@/lib/cached";
import { isIosStore, isClearedStore, requestedStore, CLEARED_HEADERS, PUBLIC_HEADERS } from "@/lib/store-gate";
import { getIosLiveOnlyChannels, toIosLivePayload } from "@/lib/store-ios-live";
import { getAndroidLiveChannels } from "@/lib/store-android";
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

  // ------------------------------------------- iOS BUILD 8: the live eight only
  // Apple 5.2.2, second rejection (2026-09-28). The Apple binary carries eight
  // official news live streams and nothing else. The list is an allow-list in
  // src/lib/store-ios-live.ts, not a database flag: a row cannot reach this
  // response unless its streamUrl is that broadcaster's own YouTube live embed.
  if (isIosStore(req)) {
    const channels = toIosLivePayload(await getIosLiveOnlyChannels());

    return NextResponse.json(
      {
        store: requestedStore(req),
        page: 1,
        pageSize: channels.length,
        filteredCount: channels.length,
        total: channels.length,
        channels,
        // Empty facets, never null. The public directory advertises language
        // chips describing a catalogue this build does not carry — Guideline
        // 2.3.1(a), and the exact frame Apple screenshotted on 15 Sep. Build 6
        // also taught us it must be an empty OBJECT: the shipped app renders
        // `data?.facets.languages`, and optional chaining guards `data`, not
        // `facets`, so a null facets crashed the Live screen on arrival.
        facets: { countries: [], categories: [], languages: [] },
      },
      { headers: CLEARED_HEADERS }
    );
  }

  // -------------------------------------------------- cleared store (Android/Play)
  // THE ANDROID SHELF (Desk work order, 2026-10-05 21:30 AST): thirty official
  // news lives, from src/lib/store-android.ts. Keep the eight that already ship;
  // every addition had to be the broadcaster's own YouTube channel, live when it
  // was checked, and its embed has to be the channel form. This list is the
  // catalogue — no database flag, no fallback to the public directory, so a row
  // that is not in that file cannot appear in this response.
  if (isClearedStore(req)) {
    const channels = getAndroidLiveChannels();

    return NextResponse.json(
      {
        store: requestedStore(req),
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
        // Deliberately EMPTY facets — never null.
        // The public directory advertises language chips ("Arabic 164", "Hindi 142")
        // describing a catalogue this build does not carry — that is Guideline
        // 2.3.1(a), promoting content the app does not offer, and it is the exact
        // frame Apple screenshotted on 15 Sep. So there are no chips to show.
        //
        // But it must be an empty OBJECT, not null. The shipped build 6 renders
        // `data?.facets.languages` — optional chaining guards `data`, not `facets`,
        // so a null facets crashed the Live TV screen the moment the response
        // arrived. Empty arrays render no chips, which has exactly the same effect
        // as the doctrine above, without the crash.
        facets: { countries: [], categories: [], languages: [] },
      },
      { headers: CLEARED_HEADERS }
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
