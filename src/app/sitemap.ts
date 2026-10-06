import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";

const SITE_URL = "https://www.whisco.tv";

// SITEMAP — INDEX PAGES AND GUIDES ONLY.
//
// Desk work order, 6 October 2026 10:10 AST: "The sitemap still lists about
// 2,100 /title pages and 667 live-channel pages. Cut those URLs out."
//
// Both blobs are gone from this file. What is left is the pages a person reads
// and the guides written for them:
//
//   home · /live · /vod · /browse · /new · /guides · every guide article ·
//   /about · /contact · /privacy
//
// Nothing was noindexed and no row was deleted — a /title or /live/<id> page
// still renders and is still reachable by link and by search; it is simply no
// longer advertised in the sitemap. That is the difference between "we asked
// Google not to index this" (which the order forbids) and "we stopped handing
// Google a list of 2,700 auto-generated URLs" (which is what it asks for).
//
// The two removed blocks were:
//   const titlePages   = titles.map((t) => ({ url: `${SITE_URL}/title/${t.slug}`, ... }));
//   const channelPages = channels.map((c) => ({ url: `${SITE_URL}/live/${c.id}`, ... }));
// `getSitemapData` is no longer called here. It stays in src/lib/cached.ts for
// the pages that still need it; only this file stopped importing it.

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/live`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vod`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/browse`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/new`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.8 },
    // Every guide registers automatically — add to the GUIDES array in
    // src/lib/guides.ts and it appears here, and on the guides index.
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    // /privacy is in the order's keep list and was missing from this file.
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return staticPages;
}
