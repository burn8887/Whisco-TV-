import type { Metadata } from "next";
import { TonightOnWhisco } from "@/components/tonight/TonightOnWhisco";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { getHomeStats } from "@/lib/cached";
import MascotVideo from "@/components/MascotVideo";
import { SHOW_MASCOT_VIDEOS } from "@/config/features";
import { Globe2, Tv2, Film, ShieldCheck, Smartphone, Compass } from "lucide-react";

// The homepage was the one indexable page without an explicit canonical;
// Google was inferring it. Declare it so it matches the sitemap and robots.txt
// byte for byte.
export const metadata: Metadata = {
  alternates: { canonical: "https://www.whisco.tv/" },
};

export const dynamic = "force-dynamic";

// Marketing landing. Lives inside the (app) route group on purpose: that is how
// it inherits the same AppNav and Footer as /guides, rather than maintaining a
// second marketing header that drifts out of sync with the product chrome.
//
// Design rules this page follows (design system v1.0):
//  - tokens only; the near-black canvas and the ember→bloom mark carry the brand
//  - no catalogue counts anywhere on a storefront-facing page
//  - the dog appears here (marketing landing is an allowed surface) but not as
//    persistent hero chrome — no speech bubble over the first fold
export default async function Home() {
  const { featuredTitles } = await getHomeStats();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* aurora — ambient wash only, never a third brand colour in chrome */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: "var(--w-aurora-a)" }}
          />
          <div
            className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "var(--w-aurora-b)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <span
                className="w-caps inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 mb-6"
                style={{
                  borderRadius: "var(--w-radius-pill)",
                  background: "var(--w-chip)",
                  border: "1px solid var(--w-chip-border)",
                  color: "var(--w-legal)",
                }}
              >
                <ShieldCheck size={14} /> Official sources only
              </span>

              <h1
                className="w-display text-4xl sm:text-6xl font-extrabold"
                style={{ color: "var(--w-fg)" }}
              >
                Free legal TV for Gulf households —{" "}
                <span className="w-gradient-text">no subscription.</span>
              </h1>

              <p
                className="mt-6 text-lg max-w-xl mx-auto lg:mx-0"
                style={{ color: "var(--w-fg-muted)" }}
              >
                Live news straight from the broadcasters&apos; own players, and
                public-domain film from the Internet Archive. We host no video
                files of our own. Funded by advertising, the way broadcast
                always has been.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/live"
                  className="w-focusable px-8 py-3.5 font-semibold text-lg transition"
                  style={{
                    background: "var(--w-grad-cta)",
                    borderRadius: "var(--w-radius-pill)",
                    color: "var(--w-ink)",
                    boxShadow: "var(--w-elev-2)",
                  }}
                >
                  Watch Live TV
                </Link>
                <Link
                  href="/vod"
                  className="w-focusable px-8 py-3.5 font-semibold text-lg transition"
                  style={{
                    background: "var(--w-bg-elev-2)",
                    border: "1px solid var(--w-chip-border)",
                    borderRadius: "var(--w-radius-pill)",
                    color: "var(--w-fg)",
                  }}
                >
                  Browse On Demand
                </Link>
              </div>

              <p className="mt-4 text-xs" style={{ color: "var(--w-fg-faint)" }}>
                Watch on TV, phone, tablet or browser. No payment, no commitment.
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div
                className="absolute inset-0 m-auto w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl"
                style={{ background: "var(--w-aurora-c)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/whisco-mascot-alpha.png"
                alt="Whisco, the Shih Tzu mascot of Whisco TV"
                className="relative w-56 sm:w-80 lg:w-96 animate-float-gentle drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC STRIP — full-bleed Whisco clip, blended into the page with
          gradient bleeds top/bottom and side fades; no frame, no box. */}
      {SHOW_MASCOT_VIDEOS && (
        <section aria-label="Whisco in action" className="relative overflow-hidden -mt-2">
          <MascotVideo
            src="/whisco-zoom-banner.mp4"
            poster="/whisco-zoom-banner-poster.jpg"
            fallbackImg="/whisco-mascot-alpha.png"
            alt="Whisco the Shih Tzu zooming through hyperspace"
            className="w-full h-[340px] sm:h-[480px] lg:h-[600px] object-cover object-center"
          />
          {/* blend edges into the page background */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-10 text-center">
            <p className="text-sm sm:text-base font-bold text-white/90 drop-shadow-lg tracking-wide">
              Life&apos;s better at full speed — <span className="w-gradient-text">and full free.</span>
            </p>
          </div>
        </section>
      )}

      {/* TRUST BAND — replaces the old stats bar.
          No catalogue counts on a storefront-facing page. */}
      <section
        className="border-y"
        style={{ borderColor: "var(--w-chip-border)", background: "var(--w-bg-elev-1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Official sources", sub: "Broadcaster and archive players" },
            { label: "No subscription", sub: "Ad-supported, like broadcast" },
            { label: "Any screen", sub: "TV, phone, tablet, browser" },
            { label: "Nothing to install", sub: "Opens in the browser" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-base sm:text-lg font-bold" style={{ color: "var(--w-fg)" }}>
                {s.label}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--w-fg-faint)" }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="channels" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="w-display text-3xl sm:text-4xl font-extrabold">
            Built for the Gulf, honestly
          </h2>
          <p className="mt-4" style={{ color: "var(--w-fg-muted)" }}>
            Live news from broadcasters who put it on the open internet, and
            public-domain film from the archive that owns it. Nothing rebroadcast,
            nothing resold.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Tv2,
              title: "Official live news",
              desc: "News channels streamed from the broadcaster's own player, health-checked and hidden when they stop working.",
            },
            {
              icon: Film,
              title: "Public-domain film",
              desc: "Classic cinema, cult favourites and documentaries from the Internet Archive — free to watch any time.",
            },
            {
              icon: Smartphone,
              title: "Every device",
              desc: "Smart TVs, phones, tablets and browsers — pick up exactly where you left off.",
            },
            {
              icon: Compass,
              title: "Written guides",
              desc: "Honest orientation for Gulf households: what is free, what is paid, and what is simply not licensed here yet.",
            },
            {
              icon: ShieldCheck,
              title: "Fully legal, no risk",
              desc: "Official embeds and public-domain archives only. No pirated streams, no shutdown risk.",
            },
            {
              icon: Globe2,
              title: "Made for expatriates",
              desc: "Curated for the households the Gulf actually has — South Asian, Arabic, Filipino and more.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 transition"
              style={{
                borderRadius: "var(--w-radius-lg)",
                background: "var(--w-bg-elev-1)",
                border: "1px solid var(--w-chip-border)",
              }}
            >
              <f.icon className="mb-4" size={28} style={{ color: "var(--w-ember)" }} />
              <h3 className="font-bold text-lg mb-2" style={{ color: "var(--w-fg)" }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--w-fg-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <TonightOnWhisco />

      {/* VOD PREVIEW */}
      {featuredTitles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="w-display text-2xl sm:text-3xl font-extrabold">
                From the archive
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--w-fg-faint)" }}>
                Public-domain film, streaming from the source that owns it.
              </p>
            </div>
            <Link
              href="/vod"
              className="text-sm font-medium"
              style={{ color: "var(--w-ember)" }}
            >
              Browse the full library →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {featuredTitles.map((t) => (
              <Link
                key={t.id}
                href={`/title/${t.slug}`}
                className="shrink-0 w-[160px] sm:w-[190px] overflow-hidden transition"
                style={{
                  borderRadius: "var(--w-radius-card)",
                  background: "var(--w-bg-elev-1)",
                  border: "1px solid var(--w-chip-border)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.posterUrl} alt={t.name} className="w-full aspect-[2/3] object-cover" />
                <div className="p-2.5">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--w-fg)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--w-fg-faint)" }}>
                    {t.releaseYear}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT'S FREE */}
      <section
        id="how"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t"
        style={{ borderColor: "var(--w-chip-border)" }}
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="w-display text-3xl sm:text-4xl font-extrabold">How can it be free?</h2>
          <p className="mt-4" style={{ color: "var(--w-fg-muted)" }}>
            The same way broadcast television always has been — advertising, not subscriptions.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Ad-supported, like TV always was",
              desc: "Short ad breaks fund the content, the same way free-to-air television always has — you never pay a subscription fee.",
            },
            {
              title: "Official sources only",
              desc: "Broadcaster embeds and public-domain archives. No piracy, no reseller panels, no access that disappears overnight.",
            },
            {
              title: "No commitment, ever",
              desc: "No sign-up required to start watching, no card on file, no trial that quietly turns into a bill.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6"
              style={{
                borderRadius: "var(--w-radius-lg)",
                background: "var(--w-bg-elev-1)",
                border: "1px solid var(--w-chip-border)",
              }}
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: "var(--w-fg)" }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--w-fg-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MEET WHISCO */}
      <section
        id="whisco"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t"
        style={{ borderColor: "var(--w-chip-border)" }}
      >
        <div
          className="p-8 sm:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center overflow-hidden relative"
          style={{
            borderRadius: "var(--w-radius-lg)",
            background: "var(--w-bg-elev-1)",
            border: "1px solid var(--w-chip-border)",
          }}
        >
          <div
            className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "var(--w-aurora-b)" }}
          />
          {SHOW_MASCOT_VIDEOS ? (
            <MascotVideo
              src="/whisco-clinic.mp4"
              poster="/whisco-clinic-poster.jpg"
              fallbackImg="/whisco-mascot-alpha.png"
              alt="Whisco the Shih Tzu"
              className="w-40 sm:w-52 mx-auto object-cover relative"
              // eslint-disable-next-line react/no-unknown-property
              {...{ style: { borderRadius: "var(--w-radius-lg)" } }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/whisco-mascot-alpha.png"
              alt="Whisco the Shih Tzu"
              className="w-40 sm:w-52 mx-auto animate-float-gentle drop-shadow-2xl relative"
            />
          )}
          <div className="text-center md:text-left relative">
            <span className="w-caps inline-block text-xs font-bold mb-2" style={{ color: "var(--w-ember)" }}>
              Meet the mascot
            </span>
            <h2 className="w-display text-3xl sm:text-4xl font-extrabold mb-4">
              Hi, I&apos;m <span className="w-gradient-text">Whisco</span>
            </h2>
            <p className="max-w-xl mx-auto md:mx-0" style={{ color: "var(--w-fg-muted)" }}>
              Yes, Whisco TV is genuinely named after a real Shih Tzu. He lives in
              a Bahrain apartment and supervises every channel we add — mostly by
              napping nearby. The platform carries a smaller shelf than the
              pirate boxes do, and every row on it is legal.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-20 border-t"
        style={{ borderColor: "var(--w-chip-border)" }}
      >
        <h2 className="w-display text-3xl font-extrabold text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Is Whisco TV really free?",
              a: "Yes — funded by advertising, not subscriptions. There's no paid tier, no trial that converts to a bill, and no card required.",
            },
            {
              q: "Do I need an account to watch?",
              a: "No — you can browse and watch without signing up. Creating a free account just lets you save a watchlist and resume where you left off.",
            },
            {
              q: "What devices can I watch on?",
              a: "Whisco TV works in any modern browser on desktop, mobile and tablet, and installs as an app on supported devices.",
            },
            {
              q: "Is the content legal?",
              a: "Yes. Live channels stream from the broadcaster's own player, and the on-demand catalogue is public-domain material streamed from the Internet Archive's own player. We host no video files of our own.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group p-5"
              style={{
                borderRadius: "var(--w-radius-md)",
                background: "var(--w-bg-elev-1)",
                border: "1px solid var(--w-chip-border)",
              }}
            >
              <summary
                className="cursor-pointer font-semibold list-none flex justify-between items-center"
                style={{ color: "var(--w-fg)" }}
              >
                {f.q}
                <span
                  className="group-open:rotate-45 transition-transform"
                  style={{ color: "var(--w-fg-faint)" }}
                >
                  +
                </span>
              </summary>
              <p className="text-sm mt-3" style={{ color: "var(--w-fg-muted)" }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Guides — editorial content on the front door (readers + crawlers) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-5">
          <h2 className="w-display text-2xl sm:text-3xl font-extrabold">
            Guides for our viewers
          </h2>
          <Link href="/guides" className="text-sm font-medium" style={{ color: "var(--w-ember)" }}>
            All guides →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block p-5 transition"
              style={{
                borderRadius: "var(--w-radius-lg)",
                background: "var(--w-bg-elev-1)",
                border: "1px solid var(--w-chip-border)",
              }}
            >
              <p className="font-bold text-sm leading-snug line-clamp-2" style={{ color: "var(--w-fg)" }}>
                {g.h1}
              </p>
              <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--w-fg-faint)" }}>
                {g.intro}
              </p>
            </Link>
          ))}
        </div>
        <p className="text-sm mt-4" style={{ color: "var(--w-fg-faint)" }}>
          Fresh content lands every week — see{" "}
          <Link href="/new" className="hover:underline" style={{ color: "var(--w-ember)" }}>
            what&apos;s new this week
          </Link>
          .
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="p-10 sm:p-16 text-center"
          style={{
            borderRadius: "var(--w-radius-lg)",
            background: "var(--w-grad-brand-180)",
          }}
        >
          <h2 className="w-display text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to start watching?
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--w-ink)" }}>
            No sign-up required — jump straight into live TV or the on-demand
            library, completely free.
          </p>
          <Link
            href="/browse"
            className="w-focusable inline-block px-8 py-3.5 font-bold transition"
            style={{
              borderRadius: "var(--w-radius-pill)",
              background: "var(--w-canvas)",
              color: "var(--w-ink)",
            }}
          >
            Start Watching Free
          </Link>
        </div>
      </section>
    </div>
  );
}
