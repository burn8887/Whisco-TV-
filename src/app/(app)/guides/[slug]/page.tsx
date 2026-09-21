import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/guides";
import AdWell from "@/components/AdWell";

// Slugs authorised a bespoke OG card (work order, 21 Sep 2026).
const NEW_OG_SLUGS = new Set([
  "free-legal-hd-turkish-series-english-subtitles",
  "hindi-serials-firestick-uae-legal",
  "telugu-live-tv-dubai-apartment-no-dish",
  "indonesian-tv-qatar-legal",
  "free-legal-arabic-series-smart-tv-gulf",
]);

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: "Not found" };
  return {
    title: guide.title,
    description: guide.intro.slice(0, 160),
    alternates: { canonical: `https://www.whisco.tv/guides/${guide.slug}` },
    robots: { index: true, follow: true },
    // Share card: bespoke per-guide card for the five new slugs only, per the
    // 21 Sep work order. Older guides inherit the generic site card from the
    // root layout — so the key is omitted entirely rather than set undefined,
    // which would clear the inherited image.
    ...(NEW_OG_SLUGS.has(guide.slug)
      ? {
          openGraph: {
            type: "article" as const,
            title: guide.title,
            description: guide.intro.slice(0, 160),
            url: `https://www.whisco.tv/guides/${guide.slug}`,
            images: [
              {
                url: `https://www.whisco.tv/api/og/guide/${guide.slug}`,
                width: 1200,
                height: 630,
                alt: guide.h1,
              },
            ],
          },
        }
      : {}),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.intro.slice(0, 200),
    author: { "@type": "Organization", name: "Whisco TV", url: "https://www.whisco.tv" },
    publisher: { "@type": "Organization", name: "Whisco TV", url: "https://www.whisco.tv" },
    mainEntityOfPage: `https://www.whisco.tv/guides/${guide.slug}`,
    inLanguage: "en",
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-12" style={{ maxWidth: "68ch" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="w-caps text-xs font-bold mb-2" style={{ color: "var(--w-ember)" }}>Whisco TV Guide</p>
      <h1 className="w-display text-3xl font-extrabold mb-4">{guide.h1}</h1>
      <p className="leading-relaxed mb-8" style={{ color: "var(--w-fg-muted)", fontSize: "var(--w-fs-4)" }}>{guide.intro}</p>

      <div className="space-y-8">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="w-display text-xl font-bold mb-2" style={{ color: "var(--w-fg)" }}>{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed mb-3" style={{ color: "var(--w-fg-muted)" }}>{p}</p>
            ))}
          </section>
        ))}
      </div>

      {/* The single reserved ad position for guide pages — empty by design
          (see AdWell). Never inside prose, never near a player. */}
      <AdWell className="mt-12" minHeight={250} />

      {/* Related guides — internal link mesh so every guide is reachable from
          every other (Googlebot discovers via links; sitemap alone is slow). */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-3">More guides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {GUIDES.filter((g) => g.slug !== slug).map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`}
              className="block rounded-xl p-4 transition" style={{ background: "var(--w-bg-elev-1)", border: "1px solid var(--w-chip-border)" }}>
              <p className="text-sm font-semibold line-clamp-2">{g.h1}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl p-6" style={{ background: "var(--w-bg-elev-1)", border: "1px solid var(--w-chip-border)" }}>
        <p className="font-bold mb-1">Start watching — it&apos;s free</p>
        <p className="text-sm mb-4" style={{ color: "var(--w-fg-muted)" }}>No subscription. Press play.</p>
        <div className="flex flex-wrap gap-3">
          <Link href={guide.ctaHref} className="w-focusable px-5 py-2.5 text-sm font-semibold" style={{ background: "var(--w-grad-cta)", borderRadius: "var(--w-radius-pill)", color: "var(--w-ink)" }}>
            {guide.ctaLabel}
          </Link>
          <Link href="/guides" className="w-focusable px-5 py-2.5 text-sm font-semibold" style={{ background: "var(--w-bg-elev-2)", border: "1px solid var(--w-chip-border)", borderRadius: "var(--w-radius-pill)" }}>
            More guides
          </Link>
        </div>
      </div>
    </div>
  );
}
