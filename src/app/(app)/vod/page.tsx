import { prisma } from "@/lib/prisma";
import TitleCard from "@/components/TitleCard";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 60;

// Curated shelf order — most broadly appealing first.
const COLLECTION_ORDER = [
  "Turkish Dizi",
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

const COLLECTION_EMOJI: Record<string, string> = {
  "Turkish Dizi": "🇹🇷",
  "Cartoons & Kids": "🎈",
  "Comedy Classics": "🎩",
  "Classic Movies": "🎬",
  "Sci-Fi & Horror": "👽",
  "Crime & Mystery": "🕵️",
  Westerns: "🤠",
  "Drama & Romance": "🌹",
  "Action & Adventure": "⚔️",
  "Classic TV": "📺",
  Documentaries: "🎞️",
  "Science & Space": "🚀",
  "History & War": "🪖",
};

export default async function VodPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const browsing = !sp.collection && !sp.q;

  // ------------------------------------------------------------------
  // BROWSE MODE (default): one horizontal shelf per collection.
  // ------------------------------------------------------------------
  if (browsing) {
    const [groups, total] = await Promise.all([
      prisma.title.groupBy({ by: ["collection"], where: { isActive: true }, _count: { _all: true } }),
      prisma.title.count({ where: { isActive: true } }),
    ]);
    const counts = new Map(groups.map((g) => [g.collection, g._count._all]));
    const shelves = COLLECTION_ORDER.filter((c) => (counts.get(c) ?? 0) > 0);

    const shelfTitles = await Promise.all(
      shelves.map((c) =>
        prisma.title.findMany({
          where: { collection: c, isActive: true },
          orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
          take: 12,
        })
      )
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold">On Demand</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {total}+ movies, series, and documentaries — <span className="text-emerald-400 font-semibold">100% free, ad-supported</span>.
          </p>
        </div>

        {/* Search + collection pills */}
        <form className="relative mb-6" action="/vod">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            name="q"
            placeholder="Search titles…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
          />
        </form>

        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max sm:flex-wrap sm:w-auto">
            {shelves.map((c) => (
              <Link
                key={c}
                href={{ pathname: "/vod", query: { collection: c } }}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 ring-1 ring-white/10 text-zinc-300 hover:ring-orange-500/50 transition-colors"
              >
                {COLLECTION_EMOJI[c]} {c} <span className="text-zinc-500">{counts.get(c)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Shelves */}
        <div className="space-y-10">
          {shelves.map((c, i) => (
            <section key={c}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                  {COLLECTION_EMOJI[c]} {c}
                </h2>
                <Link
                  href={{ pathname: "/vod", query: { collection: c } }}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  See all {counts.get(c)} <ArrowRight size={13} />
                </Link>
              </div>
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
                <div className="flex gap-3 w-max">
                  {shelfTitles[i].map((t) => (
                    <TitleCard key={t.id} title={t as any} variant="row" />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // FILTER MODE: grid of one collection and/or search results.
  // ------------------------------------------------------------------
  const where: any = { isActive: true };
  if (sp.collection) where.collection = sp.collection;
  if (sp.q) where.name = { contains: sp.q, mode: "insensitive" };

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [titles, filteredCount] = await Promise.all([
    prisma.title.findMany({
      where,
      orderBy: [{ imdbRating: "desc" }, { releaseYear: "desc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.title.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const baseQuery: Record<string, string> = {};
  if (sp.collection) baseQuery.collection = sp.collection;
  if (sp.q) baseQuery.q = sp.q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {sp.collection ? `${COLLECTION_EMOJI[sp.collection] ?? ""} ${sp.collection}` : "Search results"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredCount} title{filteredCount !== 1 ? "s" : ""}
            {sp.q ? ` matching “${sp.q}”` : ""} · page {page} of {totalPages}
          </p>
        </div>
        <Link href="/vod" className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
          ← All collections
        </Link>
      </div>

      <form className="relative mb-6" action="/vod">
        {sp.collection && <input type="hidden" name="collection" value={sp.collection} />}
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          name="q"
          defaultValue={sp.q}
          placeholder={sp.collection ? `Search in ${sp.collection}…` : "Search titles…"}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
        />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t as any} variant="grid" />
        ))}
      </div>

      {titles.length === 0 && (
        <div className="text-center py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whisco-mascot.png" alt="Whisco looking confused" className="w-28 mx-auto mb-4 opacity-90" />
          <p className="text-zinc-400 font-medium">Even Whisco couldn't sniff any of these out.</p>
          <p className="text-zinc-600 text-sm mt-1">Try a different search or collection.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href={{ pathname: "/vod", query: { ...baseQuery, page: String(Math.max(1, page - 1)) } }}
            aria-disabled={page <= 1}
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
            href={{ pathname: "/vod", query: { ...baseQuery, page: String(Math.min(totalPages, page + 1)) } }}
            aria-disabled={page >= totalPages}
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
