import { prisma } from "@/lib/prisma";
import ChannelCard from "@/components/ChannelCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 90;

// Small flag/emoji accents for the language quick-nav — purely visual,
// helps expats spot their community's row at a glance.
const LANGUAGE_EMOJI: Record<string, string> = {
  Arabic: "🇸🇦",
  Hindi: "🇮🇳",
  English: "🌍",
  Urdu: "🇵🇰",
  Bengali: "🇧🇩",
  Malayalam: "🥥",
  Tamil: "🛕",
  Telugu: "🎬",
  Punjabi: "🪯",
  Filipino: "🇵🇭",
  Indonesian: "🇮🇩",
  Vietnamese: "🇻🇳",
  Nepali: "🇳🇵",
  "Sinhala/Tamil": "🇱🇰",
  Farsi: "🇮🇷",
  French: "🇫🇷",
};

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; category?: string; language?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const where: any = { isActive: true };
  if (sp.country) where.country = sp.country;
  if (sp.category) where.category = sp.category;
  if (sp.language) where.language = sp.language;
  if (sp.q) where.name = { contains: sp.q, mode: "insensitive" };

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [channels, countries, categories, languageGroups, filteredCount, total] = await Promise.all([
    prisma.channel.findMany({
      where,
      orderBy: [{ country: "asc" }, { number: "asc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true }, orderBy: { country: "asc" } }),
    prisma.channel.findMany({ distinct: ["category"], where: { isActive: true }, select: { category: true }, orderBy: { category: "asc" } }),
    prisma.channel.groupBy({
      by: ["language"],
      where: { isActive: true },
      _count: { _all: true },
      orderBy: { _count: { language: "desc" } },
    }),
    prisma.channel.count({ where }),
    prisma.channel.count({ where: { isActive: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const baseQuery: Record<string, string> = {};
  if (sp.country) baseQuery.country = sp.country;
  if (sp.category) baseQuery.category = sp.category;
  if (sp.language) baseQuery.language = sp.language;
  if (sp.q) baseQuery.q = sp.q;

  // Query object for a language pill = current filters with language swapped
  const pillQuery = (lang?: string) => {
    const q: Record<string, string> = {};
    if (sp.country) q.country = sp.country;
    if (sp.category) q.category = sp.category;
    if (sp.q) q.q = sp.q;
    if (lang) q.language = lang;
    return q;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Live TV</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {total}+ live channels from around the globe — <span className="text-emerald-400 font-semibold">100% free, ad-supported</span>.
        </p>
      </div>

      {/* Language quick-nav — one tap to your community's channels */}
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max sm:flex-wrap sm:w-auto">
          <Link
            href={{ pathname: "/live", query: pillQuery() }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition-colors ${
              !sp.language
                ? "bg-gradient-to-r from-orange-500 to-pink-600 ring-transparent text-white"
                : "bg-zinc-900 ring-white/10 text-zinc-300 hover:ring-orange-500/50"
            }`}
          >
            All languages
          </Link>
          {languageGroups.map((g) => (
            <Link
              key={g.language}
              href={{ pathname: "/live", query: pillQuery(g.language) }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition-colors ${
                sp.language === g.language
                  ? "bg-gradient-to-r from-orange-500 to-pink-600 ring-transparent text-white"
                  : "bg-zinc-900 ring-white/10 text-zinc-300 hover:ring-orange-500/50"
              }`}
            >
              {LANGUAGE_EMOJI[g.language] ? `${LANGUAGE_EMOJI[g.language]} ` : ""}
              {g.language} <span className={sp.language === g.language ? "text-white/70" : "text-zinc-500"}>{g._count._all}</span>
            </Link>
          ))}
        </div>
      </div>

      <form className="flex flex-col sm:flex-row gap-3 mb-6" action="/live">
        {sp.language && <input type="hidden" name="language" value={sp.language} />}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search channels…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
          />
        </div>
        <select name="country" defaultValue={sp.country || ""} className="px-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm">
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c.country} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>
        <select name="category" defaultValue={sp.category || ""} className="px-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">Filter</button>
        {(sp.country || sp.category || sp.language || sp.q) && (
          <Link href="/live" className="px-5 py-2.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-sm text-center">
            Clear
          </Link>
        )}
      </form>

      <p className="text-xs text-zinc-500 mb-4">
        {filteredCount} channel{filteredCount !== 1 ? "s" : ""} found · page {page} of {totalPages}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {channels.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </div>

      {channels.length > 0 && <AdSlot format="horizontal" />}

      {channels.length === 0 && (
        <div className="text-center py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whisco-mascot.png" alt="Whisco looking confused" className="w-28 mx-auto mb-4 opacity-90" />
          <p className="text-zinc-400 font-medium">Even Whisco couldn't sniff any of these out.</p>
          <p className="text-zinc-600 text-sm mt-1">Try a different search or filter.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href={{ pathname: "/live", query: { ...baseQuery, page: String(Math.max(1, page - 1)) } }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${
              page <= 1 ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </Link>
          <span className="text-sm text-zinc-400">
            Page {page} / {totalPages}
          </span>
          <Link
            href={{ pathname: "/live", query: { ...baseQuery, page: String(Math.min(totalPages, page + 1)) } }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${
              page >= totalPages ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
