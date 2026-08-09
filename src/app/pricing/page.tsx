import Link from "next/link";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { subscribeAction } from "@/lib/actions/billing";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const session = await auth();
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link href={session ? "/browse" : "/login"} className="text-sm text-zinc-300 hover:text-white">
            {session ? "Back to app" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Plans for every household</h1>
          <p className="mt-4 text-zinc-400">All plans include our full on-demand library. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative p-8 rounded-2xl ring-1 flex flex-col ${
                p.featured ? "bg-gradient-to-b from-orange-500/10 to-pink-600/10 ring-orange-500/50" : "bg-zinc-900/60 ring-white/5"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-600">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${p.priceMonthly.toFixed(2)}</span>
                <span className="text-zinc-500">/mo</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">or ${p.priceYearly.toFixed(2)}/year</p>
              <p className="text-sm text-zinc-400 mt-3 mb-6">{p.description}</p>
              <ul className="space-y-2.5 text-sm mb-8 flex-1">
                <li className="flex gap-2">
                  <Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.channelAccess} channel tier access
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> Up to {p.maxScreens} screens at once
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.maxProfiles} user profiles
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.hdQuality} streaming quality
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> Full on-demand library
                </li>
              </ul>
              {session ? (
                <form action={subscribeAction}>
                  <input type="hidden" name="planId" value={p.id} />
                  <input type="hidden" name="billingCycle" value="monthly" />
                  <button
                    className={`w-full text-center py-3 rounded-full font-semibold transition ${
                      p.featured ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90" : "bg-white/5 ring-1 ring-white/15 hover:bg-white/10"
                    }`}
                  >
                    Choose {p.name}
                  </button>
                </form>
              ) : (
                <Link
                  href="/signup"
                  className={`text-center py-3 rounded-full font-semibold transition ${
                    p.featured ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90" : "bg-white/5 ring-1 ring-white/15 hover:bg-white/10"
                  }`}
                >
                  Get Started
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
