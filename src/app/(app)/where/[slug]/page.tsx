import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WHERE_GUIDES } from "@/lib/where";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = WHERE_GUIDES.find((x) => x.slug === slug);
  if (!g) return { title: "Not found" };
  return {
    title: g.title,
    description: g.intro.slice(0, 160),
    alternates: { canonical: `https://whisco.tv/where/${g.slug}` },
    robots: { index: true, follow: true },
  };
}

const COLS = [
  { key: "freeLegal" as const, label: "Free & legal", accent: "text-green-400", border: "border-green-900/60" },
  { key: "paidLegal" as const, label: "Paid & legal", accent: "text-orange-400", border: "border-orange-900/60" },
  { key: "notHere" as const, label: "Not legally available (we say so)", accent: "text-zinc-400", border: "border-zinc-800" },
];

export default async function WherePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = WHERE_GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.h1,
    description: g.intro.slice(0, 200),
    author: { "@type": "Organization", name: "Whisco TV", url: "https://whisco.tv" },
    publisher: { "@type": "Organization", name: "Whisco TV", url: "https://whisco.tv" },
    mainEntityOfPage: `https://whisco.tv/where/${g.slug}`,
    inLanguage: "en",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">Where to watch · honest edition</p>
      <h1 className="text-3xl font-extrabold mb-4">{g.h1}</h1>
      <p className="text-zinc-300 leading-relaxed mb-8">{g.intro}</p>

      <div className="space-y-8">
        {COLS.map((col) => (
          <section key={col.key} className={`rounded-2xl border ${col.border} bg-zinc-900/40 p-5`}>
            <h2 className={`text-lg font-bold mb-4 ${col.accent}`}>{col.label}</h2>
            <div className="space-y-4">
              {g[col.key].map((o) => (
                <div key={o.name}>
                  <h3 className="text-sm font-bold text-white">
                    {o.name}
                    {o.ours && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-orange-400 border border-orange-800 rounded px-1.5 py-0.5">
                        ours — declared
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-1">{o.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h2 className="text-lg font-bold text-white mb-2">The honest bottom line</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">{g.verdict}</p>
      </div>

      <div className="mt-8">
        <Link
          href={g.ctaHref}
          className="inline-block rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-3 font-bold text-white"
        >
          {g.ctaLabel}
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-3">More honest answers</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {WHERE_GUIDES.filter((x) => x.slug !== slug).map((x) => (
            <Link
              key={x.slug}
              href={`/where/${x.slug}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm font-semibold text-zinc-200 hover:border-orange-800 transition-colors"
            >
              {x.h1}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          Also see our <Link href="/guides" className="text-orange-400 hover:underline">viewing guides</Link> and{" "}
          <Link href="/new" className="text-orange-400 hover:underline">what&apos;s new this week</Link>.
        </p>
      </div>
    </div>
  );
}
