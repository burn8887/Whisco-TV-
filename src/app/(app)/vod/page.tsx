import { prisma } from "@/lib/prisma";
import TitleCard from "@/components/TitleCard";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "", label: "All" },
  { value: "MOVIE", label: "Movies" },
  { value: "SERIES", label: "Series" },
  { value: "DOCUMENTARY", label: "Documentaries" },
];

export default async function VodPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; genre?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.type) where.type = sp.type;
  if (sp.q) where.name = { contains: sp.q };
  if (sp.genre) where.genres = { contains: sp.genre };

  const [titles, total] = await Promise.all([
    prisma.title.findMany({ where, orderBy: { releaseYear: "desc" }, take: 120 }),
    prisma.title.count(),
  ]);

  const genres = Array.from(
    new Set(
      (await prisma.title.findMany({ select: { genres: true } })).flatMap((t) => t.genres.split(",").map((g) => g.trim())).filter(Boolean)
    )
  ).sort();

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

      <form className="flex flex-col sm:flex-row gap-3 mb-8" action="/vod">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t as any} variant="grid" />
        ))}
      </div>

      {titles.length === 0 && <p className="text-zinc-500 text-center py-20">No titles match your filters.</p>}
    </div>
  );
}
