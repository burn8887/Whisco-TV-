import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deletePlanAction } from "@/lib/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { subscriptions: true } } } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Subscription Plans</h1>
        <Link href="/admin/plans/new" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">
          <Plus size={16} /> Add Plan
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.id} className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-lg">{p.name}</h2>
              {p.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">FEATURED</span>}
            </div>
            <p className="text-2xl font-extrabold">
              ${p.priceMonthly.toFixed(2)}
              <span className="text-sm text-zinc-500 font-normal">/mo</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">${p.priceYearly.toFixed(2)}/year</p>
            <p className="text-sm text-zinc-400 mt-3">{p.description}</p>
            <div className="mt-4 text-xs text-zinc-500 space-y-1">
              <p>Channel tier: {p.channelAccess}</p>
              <p>Screens: {p.maxScreens} · Profiles: {p.maxProfiles}</p>
              <p>Quality: {p.hdQuality}</p>
              <p>{p._count.subscriptions} active subscribers</p>
            </div>
            <div className="flex gap-2 mt-5">
              <Link href={`/admin/plans/${p.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs">
                <Pencil size={12} /> Edit
              </Link>
              <form action={deletePlanAction}>
                <input type="hidden" name="id" value={p.id} />
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs text-red-400">
                  <Trash2 size={12} /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
