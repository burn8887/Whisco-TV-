import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/guides";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: "Not found" };
  return {
    title: guide.title,
    description: guide.intro.slice(0, 160),
    alternates: { canonical: `https://whisco.tv/guides/${guide.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">Whisco TV Guide</p>
      <h1 className="text-3xl font-extrabold mb-4">{guide.h1}</h1>
      <p className="text-zinc-300 leading-relaxed mb-8">{guide.intro}</p>

      <div className="space-y-8">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold text-white mb-2">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-zinc-400 leading-relaxed mb-3">{p}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-zinc-900/70 ring-1 ring-white/10 p-6">
        <p className="font-bold mb-1">Start watching — it&apos;s free</p>
        <p className="text-sm text-zinc-400 mb-4">No subscription, no signup. Just press play.</p>
        <div className="flex flex-wrap gap-3">
          <Link href={guide.ctaHref} className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-pink-600">
            {guide.ctaLabel}
          </Link>
          <Link href="/guides" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 ring-1 ring-white/10">
            More guides
          </Link>
        </div>
      </div>
    </div>
  );
}
