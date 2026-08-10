import { prisma } from "@/lib/prisma";
import TitleCard from "@/components/TitleCard";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "", label: "All" },
  { value: "MOVIE", label: "Movies" },
  { value: "SERIES", label: "Series" },
  { value: "DOCUMENTARY", label: "Documentaries" },
];

const PAGE_SIZE = 60;

export default async function VodPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; genre?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.type) where.type = sp.type;
  if (sp.q) where.name = { contains: sp.q };
  if (sp.genre) where.genres = { contains: sp.genre };

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [titles, filteredCount, total] = await Promise.all([
    prisma.title.findMany({
      where,
      orderBy: { releaseYear: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.title.count({ where }),
    prisma.title.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  const genres = Array.from(
    new Set(
      (await prisma.title.findMany({ select: { genres: true } })).flatMap((t) => t.genres.split(",").map((g) => g.trim())).filter(Boolean)
    )
  ).sort();

  const baseQuery: Record<string, string> = {};
  if (sp.type) baseQuery.type = sp.type;
  if (sp.genre) baseQuery.genre = sp.genre;
  if (sp.q) baseQuery.q = sp.q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">On Demand</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {total}+ movies, series, and documentaries — <span className="text-emerald-400 font-semibold">100% free, ad-supported</span>.
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {TYPES.map((t) => (
          <Link
            key={t.value}
            href={{ pathname: "/vod", query: { ...(sp.genre ? { genre: sp.genre } : {}), ...(t.value ? { type: t.value } : {}) } }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
              (sp.type || "") === t.value ? "bg-gradient-to-r from-orange-500 to-pink-600" : "bg-white/5 ring-1 ring-white/10 text-zinc-300"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form className="flex flex-col sm:flex-row gap-3 mb-6" action="/vod">
        {sp.type && <input type="hidden" name="type" value={sp.type} />}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search titles…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
          />
        </div>
        <select name="genre" defaultValue={sp.genre || ""} className="px-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm">
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">Filter</button>
      </form>

      <p className="text-xs text-zinc-500 mb-4">
        {filteredCount} title{filteredCount !== 1 ? "s" : ""} found · page {page} of {totalPages}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t as any} variant="grid" />
        ))}
      </div>

      {titles.length === 0 && <p className="text-zinc-500 text-center py-20">No titles match your filters.</p>}

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
