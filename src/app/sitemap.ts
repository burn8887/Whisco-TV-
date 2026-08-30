import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/cached";

const SITE_URL = "https://whisco.tv";

// Generated at request time (not build time) so builds never depend on DB
// availability; CDN caching keeps crawler load negligible.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { titles, channels } = await getSitemapData();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/live`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vod`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/browse`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides/turkish-series-guide`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides/free-tv-for-expats-gulf`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/guides/pakistani-dramas-guide`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const titlePages: MetadataRoute.Sitemap = titles.map((t) => ({
    url: `${SITE_URL}/title/${t.slug}`,
    lastModified: t.createdAt,
    changeFrequency: t.isTrending ? ("daily" as const) : ("weekly" as const),
    // Turkish dizi pages are the search-traffic drivers — highest priority.
    priority: t.language === "Turkish" ? 0.9 : t.isTrending ? 0.8 : 0.6,
  }));

  const channelPages: MetadataRoute.Sitemap = channels.map((c) => ({
    url: `${SITE_URL}/live/${c.id}`,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...titlePages, ...channelPages];
}
