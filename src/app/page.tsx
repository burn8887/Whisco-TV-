import Link from "next/link";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { Globe2, Tv2, Film, ShieldCheck, Smartphone, Users, Check, Star, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [channelCount, titleCount, countries, featuredTitles] = await Promise.all([
    prisma.channel.count(),
    prisma.title.count(),
    prisma.channel.findMany({ distinct: ["country"], select: { country: true } }),
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
            <a href="#how" className="hover:text-white">How It's Free</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-300 hover:text-white hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/browse"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 transition"
            >
              Start Watching Free
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
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300 mb-6">
            <Sparkles size={14} /> 100% free, forever — no subscription, no trial, no credit card
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Free live TV and on-demand. <span className="text-gradient">No catch.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Whisco TV is a free, ad-supported streaming service with {channelCount}+ live channels from around the
            globe and a growing library of {titleCount}+ movies, series, and documentaries. Just open the app and
            watch — no account, no payment, no commitment required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="px-8 py-3.5 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 transition text-lg shadow-lg shadow-orange-900/30"
            >
              Start Watching — It's Free
            </Link>
            <Link
              href="/live"
              className="px-8 py-3.5 rounded-full font-semibold bg-white/5 ring-1 ring-white/15 hover:bg-white/10 transition text-lg"
            >
              Browse Live Channels
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">Supported by ads, not subscriptions. Watch on TV, phone, tablet, or browser.</p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Live Channels", value: `${channelCount}+` },
            { label: "Countries Covered", value: `${countries.length}+` },
            { label: "Movies, Series & Docs", value: `${titleCount}+` },
            { label: "Monthly Cost", value: "$0" },
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
          <h2 className="text-3xl sm:text-4xl font-extrabold">Free doesn't mean small</h2>
          <p className="mt-4 text-zinc-400">
            A genuinely global live channel lineup and a growing on-demand library — fully legal, fully free,
            funded by ads instead of your wallet.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Tv2, title: "Global Live TV", desc: `${channelCount}+ legally licensed, free-to-air channels — news, business, and more, with more added regularly.` },
            { icon: Film, title: "Free On-Demand Library", desc: `${titleCount}+ movies, series, and documentaries, ad-supported and free to watch anytime.` },
            { icon: Smartphone, title: "Every Device", desc: "Smart TVs, phones, tablets, and browsers — pick up exactly where you left off." },
            { icon: Users, title: "Free Profiles", desc: "Up to 6 profiles per account with dedicated watchlists and kids mode — at no cost." },
            { icon: ShieldCheck, title: "Fully Legal, No Risk", desc: "Every channel and title is properly licensed. No pirated streams, no shutdown risk, no legal exposure." },
            { icon: Globe2, title: "True Global Reach", desc: "Content curated for viewers across the Middle East, Europe, Americas, Asia, and Africa." },
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
            <Link href="/vod" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
              Browse the full library →
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

      {/* HOW IT'S FREE */}
      <section id="how" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">How can it be free?</h2>
          <p className="mt-4 text-zinc-400">The same way broadcast TV always has been — ads, not subscriptions.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: "Ad-supported, like TV always was", desc: "Short ad breaks fund the content, the same way free-to-air television always has — you never pay a subscription fee." },
            { title: "Fully licensed content", desc: "Every channel and title is legally sourced — no piracy, no shady reseller panels, no risk of your access disappearing overnight." },
            { title: "No commitment, ever", desc: "No sign-up required to start watching, no credit card on file, no trial that quietly turns into a bill." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5">
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is Whisco TV really free?", a: "Yes — 100% free. Whisco TV is funded by advertising, not subscriptions. There's no paid tier, no trial that converts to a bill, and no credit card required." },
            { q: "Do I need an account to watch?", a: "No — you can browse and watch live TV and on-demand content without signing up. Creating a free account just lets you save a watchlist, use profiles, and resume where you left off." },
            { q: "What devices can I watch on?", a: "Whisco TV works in any modern browser on desktop, mobile, and tablet, and installs as an app on supported devices." },
            { q: "Is the content legal?", a: "Yes — every live channel and on-demand title on Whisco TV is properly licensed for free, ad-supported distribution." },
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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to start watching?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">No sign-up required — jump straight into live TV or the on-demand library, completely free.</p>
          <Link href="/browse" className="inline-block px-8 py-3.5 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition">
            Start Watching Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-zinc-500 text-center">
            © {new Date().getFullYear()} Whisco TV. Free, ad-supported streaming. On-demand titles use sample
            content for demo purposes — see project README for production content sourcing.
          </p>
        </div>
      </footer>
    </div>
  );
}
