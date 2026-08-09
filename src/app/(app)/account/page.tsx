import { getFullUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { subscribeAction, cancelSubscriptionAction, resumeSubscriptionAction } from "@/lib/actions/billing";
import { redirect } from "next/navigation";
import { CreditCard, Check, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const user = await getFullUser();
  if (!user) redirect("/login");
  const sp = await searchParams;

  const [plans, payments] = await Promise.all([
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const sub = user.subscription;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Account & Billing</h1>

      {sp.upgraded && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <Check size={16} /> Plan updated successfully.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
          <h2 className="font-bold mb-3">Profile</h2>
          <p className="text-sm text-zinc-400">Name</p>
          <p className="font-medium mb-2">{user.name}</p>
          <p className="text-sm text-zinc-400">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
          <h2 className="font-bold mb-3">Current Plan</h2>
          {sub ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-lg font-extrabold">{sub.plan.name}</p>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    sub.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-300" : sub.status === "TRIALING" ? "bg-orange-500/15 text-orange-300" : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                ${sub.billingCycle === "yearly" ? sub.plan.priceYearly.toFixed(2) : sub.plan.priceMonthly.toFixed(2)} / {sub.billingCycle === "yearly" ? "year" : "month"}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                {sub.cancelAtPeriodEnd ? "Cancels" : "Renews"} on {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </p>
              <div className="mt-4 flex gap-2">
                {sub.cancelAtPeriodEnd ? (
                  <form action={resumeSubscriptionAction}>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15">Resume Subscription</button>
                  </form>
                ) : (
                  <form action={cancelSubscriptionAction}>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-zinc-400 flex items-center gap-1">
                      <AlertTriangle size={12} /> Cancel Plan
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">No active subscription.</p>
          )}
        </div>
      </div>

      <h2 className="font-bold text-xl mb-4">Change Plan</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {plans.map((p) => (
          <div key={p.id} className={`p-5 rounded-2xl ring-1 flex flex-col ${sub?.planId === p.id ? "ring-orange-500/60 bg-orange-500/5" : "ring-white/5 bg-zinc-900/60"}`}>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-2xl font-extrabold mt-1">
              ${p.priceMonthly.toFixed(2)}
              <span className="text-sm text-zinc-500 font-normal">/mo</span>
            </p>
            <p className="text-xs text-zinc-500 mt-2 mb-4 flex-1">{p.description}</p>
            {sub?.planId === p.id ? (
              <span className="text-center text-xs font-semibold py-2 rounded-full bg-white/10 text-zinc-400">Current Plan</span>
            ) : (
              <form action={subscribeAction}>
                <input type="hidden" name="planId" value={p.id} />
                <input type="hidden" name="billingCycle" value="monthly" />
                <button className="w-full text-xs font-semibold py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600">
                  Switch to {p.name}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        <CreditCard size={18} /> Billing History
      </h2>
      <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 divide-y divide-white/5">
        {payments.length === 0 && <p className="p-5 text-sm text-zinc-500">No payments yet.</p>}
        {payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium">{p.description}</p>
              <p className="text-zinc-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="font-semibold">${p.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
