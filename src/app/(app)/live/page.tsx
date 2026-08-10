import { prisma } from "@/lib/prisma";
import ChannelCard from "@/components/ChannelCard";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: any = {};
  if (sp.country) where.country = sp.country;
  if (sp.category) where.category = sp.category;
  if (sp.q) where.name = { contains: sp.q };

  const [channels, countries, categories, total] = await Promise.all([
    prisma.channel.findMany({ where, orderBy: [{ country: "asc" }, { number: "asc" }], take: 200 }),
    prisma.channel.findMany({ distinct: ["country"], select: { country: true }, orderBy: { country: "asc" } }),
    prisma.channel.findMany({ distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } }),
    prisma.channel.count(),
  ]);

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

      <p className="text-xs text-zinc-500 mb-4">{channels.length} channel{channels.length !== 1 ? "s" : ""} found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {channels.map((c) => (
          <ChannelCard key={c.id} channel={c} />
        ))}
      </div>

      {channels.length === 0 && <p className="text-zinc-500 text-center py-20">No channels match your filters.</p>}
    </div>
  );
}
