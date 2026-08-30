import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Original guides from Whisco TV: what to watch, where to start with Turkish dizi and Pakistani dramas, and how Gulf expats can watch TV from home legally and free.",
  alternates: { canonical: "https://whisco.tv/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Guides</h1>
      <p className="text-zinc-400 mb-8">
        Written by us, for our viewers — honest orientation for the content we carry.
      </p>
      <div className="space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block rounded-2xl bg-zinc-900/70 ring-1 ring-white/5 hover:ring-orange-500/40 transition p-5"
          >
            <p className="font-bold">{g.h1}</p>
            <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{g.intro}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
