import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/cached";
import { prisma } from "@/lib/prisma";
import { GUIDES } from "@/lib/guides";

const SITE_URL = "https://www.whisco.tv";

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
    { url: `${SITE_URL}/new`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.8 },
    // All guides register automatically — add to GUIDES array and it's in the sitemap.
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
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

  // In-house editorial: every published article, and a show hub for every series
  // we have written about. These are the pages that carry original writing, so
  // they are the ones worth surfacing to search engines first.
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, publishedAt: true, title: { select: { slug: true } } },
  });
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(a.publishedAt ? { lastModified: a.publishedAt } : {}),
  }));
  const showSlugs = [...new Set(articles.map((a) => a.title.slug))];
  const showPages: MetadataRoute.Sitemap = showSlugs.map((sl) => ({
    url: `${SITE_URL}/shows/${sl}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const channelPages: MetadataRoute.Sitemap = channels.map((c) => ({
    url: `${SITE_URL}/live/${c.id}`,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...articlePages, ...showPages, ...titlePages, ...channelPages];
}
