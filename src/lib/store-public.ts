/**
 * PUBLIC LISTING — hides App-Store-only rows from the public directory.
 *
 * WHY THIS EXISTS
 * The App Store build needs live rows whose source is the broadcaster's own
 * YouTube embed, because the store lock excludes third-party HLS from the binary.
 * But the public website and the Android app already carry those same broadcasters
 * from HLS, and adding a second row for France 24 or DW would list each of them
 * twice on whisco.tv — a visible defect for visitors.
 *
 * So the YouTube-embed rows are marked sourceKind = "youtube-live" and are
 * subtracted from every PUBLIC listing: the channels, the total, the filtered
 * count, the country and category facets, and the language chip counts. The App
 * Store build reads them through `store-ios.ts`, which is a separate query.
 *
 * WHY NOT FILTER INSIDE cached.ts
 * `getLivePageData` is shared by the website and /api/mobile/v1. The store lock is
 * explicit that cached.ts must not be gated, and it is right: gating it would empty
 * the public site. So the exclusion happens at the two public call sites, after the
 * cached query, which leaves the cache and the public site otherwise untouched.
 *
 * If no YouTube-live rows exist (today: none), this is a no-op that costs one cheap
 * query. It returns the input object unchanged, so behaviour is identical to before.
 */
import { prisma } from "@/lib/prisma";

/** The sourceKind that marks a row as App-Store-only. */
export const IOS_ONLY_SOURCE_KIND = "youtube-live";

type LivePageData<T> = {
  channels: T[];
  countries: { country: string }[];
  categories: { category: string }[];
  languageGroups: { language: string; _count: { _all: number } }[];
  filteredCount: number;
  total: number;
};

export type PublicLiveFilters = {
  country?: string;
  category?: string;
  language?: string;
  q?: string;
};

export async function excludeIosOnly<T extends { id: string }>(
  data: LivePageData<T>,
  filters: PublicLiveFilters = {}
): Promise<LivePageData<T>> {
  const iosOnly = await prisma.channel.findMany({
    where: { isActive: true, sourceKind: IOS_ONLY_SOURCE_KIND },
    select: { id: true, name: true, country: true, category: true, language: true },
  });

  // Nothing to do — the common case, and it must behave exactly as before.
  if (iosOnly.length === 0) return data;

  const hidden = new Set(iosOnly.map((r) => r.id));

  const matchesFilters = (r: (typeof iosOnly)[number]) => {
    if (filters.country && r.country !== filters.country) return false;
    if (filters.category && r.category !== filters.category) return false;
    if (filters.language && r.language !== filters.language) return false;
    if (filters.q && !r.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  };
  const hiddenMatching = iosOnly.filter(matchesFilters).length;

  // Facet lists are `distinct` over every active channel, so they can't be corrected
  // by subtraction — re-derive them from the public set only.
  const [publicCountries, publicCategories] = await Promise.all([
    prisma.channel.findMany({
      where: { isActive: true, NOT: { sourceKind: IOS_ONLY_SOURCE_KIND } },
      distinct: ["country"],
      select: { country: true },
      orderBy: { country: "asc" },
    }),
    prisma.channel.findMany({
      where: { isActive: true, NOT: { sourceKind: IOS_ONLY_SOURCE_KIND } },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const hiddenByLanguage = new Map<string, number>();
  for (const r of iosOnly) {
    hiddenByLanguage.set(r.language, (hiddenByLanguage.get(r.language) ?? 0) + 1);
  }

  return {
    channels: data.channels.filter((c) => !hidden.has(c.id)),
    countries: publicCountries,
    categories: publicCategories,
    languageGroups: data.languageGroups
      .map((g) => ({
        ...g,
        _count: { _all: g._count._all - (hiddenByLanguage.get(g.language) ?? 0) },
      }))
      .filter((g) => g._count._all > 0),
    filteredCount: data.filteredCount - hiddenMatching,
    total: data.total - iosOnly.length,
  };
}
