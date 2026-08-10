import { prisma } from "@/lib/prisma";
import { Tv2, Film, Users, Bookmark, Globe2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [channels, titles, users, watchlistCount, countries] = await Promise.all([
    prisma.channel.count(),
    prisma.title.count(),
    prisma.user.count(),
    prisma.watchlist.count(),
    prisma.channel.findMany({ distinct: ["country"], select: { country: true } }),
  ]);

  const stats = [
    { label: "Live Channels", value: channels, icon: Tv2 },
    { label: "VOD Titles", value: titles, icon: Film },
    { label: "Registered Accounts", value: users, icon: Users },
    { label: "Countries Covered", value: countries.length, icon: Globe2 },
    { label: "Watchlist Adds", value: watchlistCount, icon: Bookmark },
  ];

  const byCategory = await prisma.channel.groupBy({ by: ["category"], _count: true });
  const recentTitles = await prisma.title.findMany({ orderBy: { createdAt: "desc" }, take: 8 });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-1">Dashboard</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Whisco TV is 100% free and ad-supported — no plans, no billing. Overview of your channel and VOD catalog.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-orange-400" />
            </div>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
          <h2 className="font-bold mb-4">Channels by Category</h2>
          <div className="space-y-3">
            {byCategory.map((g) => {
              const pct = channels ? Math.round((g._count / channels) * 100) : 0;
              return (
                <div key={g.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{g.category}</span>
                    <span className="text-zinc-500">{g._count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-pink-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
          <h2 className="font-bold mb-4">Recently Added Titles</h2>
          <div className="space-y-3">
            {recentTitles.map((t) => (
              <div key={t.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-zinc-500">
                    {t.type} · {t.releaseYear}
                  </p>
                </div>
              </div>
            ))}
            {recentTitles.length === 0 && <p className="text-sm text-zinc-500">No titles yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
