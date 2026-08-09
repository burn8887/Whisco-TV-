import Link from "next/link";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { Globe2, Tv2, Film, ShieldCheck, Smartphone, Users, Check, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [channelCount, titleCount, countries, plans, featuredTitles] = await Promise.all([
    prisma.channel.count(),
    prisma.title.count(),
    prisma.channel.findMany({ distinct: ["country"], select: { country: true } }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.title.findMany({ where: { isFeatured: true }, take: 8 }),
  ]);

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
            <a href="#channels" className="hover:text-white">Live Channels</a>
            <a href="#vod" className="hover:text-white">On-Demand</a>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-300 hover:text-white hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-700/30 rounded-full blur-3xl" />
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-orange-300 mb-6">
            <Globe2 size={14} /> {countries.length}+ countries · {channelCount}+ live channels
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            One subscription. <span className="text-gradient">Every screen, every story.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Whisco TV brings together {channelCount}+ live TV channels from around the globe and a
            massive on-demand library of {titleCount}+ movies, series, and documentaries — all in one
            fast, beautifully simple app.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 transition text-lg shadow-lg shadow-orange-900/30"
            >
              Start your 7-day free trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 rounded-full font-semibold bg-white/5 ring-1 ring-white/15 hover:bg-white/10 transition text-lg"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">No contracts. Cancel anytime. Watch on TV, phone, tablet, or browser.</p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Live Channels", value: `${channelCount}+` },
            { label: "Countries Covered", value: `${countries.length}+` },
            { label: "Movies, Series & Docs", value: `${titleCount}+` },
            { label: "Simultaneous Screens", value: "Up to 6" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-gradient">{s.value}</p>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="channels" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Built to out-stream the competition</h2>
          <p className="mt-4 text-zinc-400">
            Global live channel range and a deep on-demand catalog — the two things that matter most,
            done right.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Tv2, title: "Global Live TV", desc: `${channelCount}+ channels across ${countries.length}+ countries — news, sports, entertainment, kids, music, and more.` },
            { icon: Film, title: "Massive On-Demand Library", desc: `${titleCount}+ movies, series, and documentaries added weekly across every major genre.` },
            { icon: Smartphone, title: "Every Device", desc: "Smart TVs, phones, tablets, and browsers — pick up exactly where you left off." },
            { icon: Users, title: "Multi-Profile Households", desc: "Up to 8 profiles with dedicated watchlists, kids mode, and parental controls." },
            { icon: ShieldCheck, title: "Reliable Streaming", desc: "Adaptive HD/4K streaming engineered for minimal buffering, wherever you are." },
            { icon: Globe2, title: "True Global Reach", desc: "Content and channels curated for viewers across the Middle East, Europe, Americas, Asia, and Africa." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 hover:ring-orange-500/30 transition">
              <f.icon className="text-orange-400 mb-4" size={28} />
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VOD PREVIEW */}
      {featuredTitles.length > 0 && (
        <section id="vod" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Featured on demand</h2>
            <Link href="/signup" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
              Unlock full library →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {featuredTitles.map((t) => (
              <div key={t.id} className="shrink-0 w-[160px] sm:w-[190px] rounded-xl overflow-hidden bg-zinc-900 ring-1 ring-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.posterUrl} alt={t.name} className="w-full aspect-[2/3] object-cover" />
                <div className="p-2.5">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                    <Star size={11} className="text-amber-400" fill="currentColor" /> {t.imdbRating.toFixed(1)} · {t.releaseYear}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Simple, honest pricing</h2>
          <p className="mt-4 text-zinc-400">Start with a 7-day free trial. Upgrade, downgrade, or cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
              <p className="text-sm text-zinc-400 mt-3 mb-6">{p.description}</p>
              <ul className="space-y-2.5 text-sm mb-8 flex-1">
                <li className="flex gap-2"><Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.channelAccess} channel tier access</li>
                <li className="flex gap-2"><Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> Up to {p.maxScreens} screens at once</li>
                <li className="flex gap-2"><Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.maxProfiles} user profiles</li>
                <li className="flex gap-2"><Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> {p.hdQuality} streaming quality</li>
                <li className="flex gap-2"><Check size={16} className="text-orange-400 shrink-0 mt-0.5" /> Full on-demand library</li>
              </ul>
              <Link
                href="/signup"
                className={`text-center py-3 rounded-full font-semibold transition ${
                  p.featured ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90" : "bg-white/5 ring-1 ring-white/15 hover:bg-white/10"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: "What devices can I watch on?", a: "Whisco TV works in any modern browser on desktop, mobile, and tablet, and installs as an app on supported devices." },
            { q: "Can I cancel anytime?", a: "Yes — there are no contracts. Cancel or change your plan anytime from your account page." },
            { q: "How many people can watch at once?", a: "Depends on your plan — from 1 screen on Starter up to 6 simultaneous screens on Ultimate." },
            { q: "Is there a free trial?", a: "Every new account starts with a 7-day free trial on us." },
          ].map((f) => (
            <details key={f.q} className="group rounded-xl bg-zinc-900/60 ring-1 ring-white/5 p-5">
              <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                {f.q}
                <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-pink-600 to-violet-700 p-10 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to start streaming?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">Join Whisco TV today and get instant access to global live TV and our full on-demand library.</p>
          <Link href="/signup" className="inline-block px-8 py-3.5 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition">
            Start Free Trial
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-zinc-500 text-center">
            © {new Date().getFullYear()} Whisco TV. Demo product — sample channels/content shown are for
            illustration only. Connect a licensed content feed for production use.
          </p>
        </div>
      </footer>
    </div>
  );
}
