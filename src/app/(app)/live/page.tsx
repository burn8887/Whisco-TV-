import { prisma } from "@/lib/prisma";
import ChannelCard from "@/components/ChannelCard";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 90;

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; category?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const where: any = { isActive: true };
  if (sp.country) where.country = sp.country;
  if (sp.category) where.category = sp.category;
  if (sp.q) where.name = { contains: sp.q };

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [channels, countries, categories, filteredCount, total] = await Promise.all([
    prisma.channel.findMany({
      where,
      orderBy: [{ country: "asc" }, { number: "asc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.channel.findMany({ distinct: ["country"], where: { isActive: true }, select: { country: true }, orderBy: { country: "asc" } }),
    prisma.channel.findMany({ distinct: ["category"], where: { isActive: true }, select: { category: true }, orderBy: { category: "asc" } }),
    prisma.channel.count({ where }),
    prisma.channel.count({ where: { isActive: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const baseQuery: Record<string, string> = {};
  if (sp.country) baseQuery.country = sp.country;
  if (sp.category) baseQuery.category = sp.category;
  if (sp.q) baseQuery.q = sp.q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Live TV</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {total}+ live channels from around the globe — <span className="text-emerald-400 font-semibold">100% free, ad-supported</span>.
        </p>
      </div>

      <form className="flex flex-col sm:flex-row gap-3 mb-6" action="/live">
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
        {(sp.country || sp.category || sp.q) && (
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
