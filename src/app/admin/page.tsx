import { prisma } from "@/lib/prisma";
import { Tv2, Film, Users, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [channels, titles, users, activeSubs, payments] = await Promise.all([
    prisma.channel.count(),
    prisma.title.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: true } }),
  ]);

  const revenue = await prisma.payment.aggregate({ _sum: { amount: true } });
  const byPlan = await prisma.subscription.groupBy({ by: ["planId"], _count: true });
  const plans = await prisma.plan.findMany();

  const stats = [
    { label: "Live Channels", value: channels, icon: Tv2 },
    { label: "VOD Titles", value: titles, icon: Film },
    { label: "Registered Users", value: users, icon: Users },
    { label: "Active Subscriptions", value: activeSubs, icon: TrendingUp },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-1">Dashboard</h1>
      <p className="text-zinc-500 text-sm mb-8">Overview of your Whisco TV platform.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-orange-400" />
            </div>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-600/10 ring-1 ring-orange-500/30">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={18} className="text-orange-400" />
          </div>
          <p className="text-2xl font-extrabold">${(revenue._sum.amount || 0).toFixed(2)}</p>
          <p className="text-xs text-zinc-500 mt-1">Total Revenue (mock)</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
          <h2 className="font-bold mb-4">Subscriptions by Plan</h2>
          <div className="space-y-3">
            {byPlan.map((g) => {
              const plan = plans.find((p) => p.id === g.planId);
              const pct = users ? Math.round((g._count / users) * 100) : 0;
              return (
                <div key={g.planId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{plan?.name}</span>
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
          <h2 className="font-bold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{p.user.name}</p>
                  <p className="text-xs text-zinc-500">{p.description}</p>
                </div>
                <p className="font-semibold text-emerald-400">${p.amount.toFixed(2)}</p>
              </div>
            ))}
            {payments.length === 0 && <p className="text-sm text-zinc-500">No payments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
