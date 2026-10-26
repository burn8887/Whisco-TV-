import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/guides";
import { guideSocialMetadata, guideUrl } from "@/lib/guide-social";
import AdWell from "@/components/AdWell";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: "Not found" };
  return {
    title: guide.title,
    alternates: { canonical: guideUrl(guide.slug) },
    robots: { index: true, follow: true },
    // Description, og:* and twitter:* come from one helper (src/lib/guide-social.ts):
    // every guide — not just the five from the 21 Sep work order — now shares its
    // own title, its own description and its own canonical as og:url. The share
    // card is the bespoke /api/og/guide/[slug] image where that route serves one,
    // and the generic brand card otherwise, so no og:image can point at a 404.
    ...guideSocialMetadata(guide),
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
    mainEntityOfPage: guideUrl(guide.slug),
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
