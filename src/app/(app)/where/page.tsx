import type { Metadata } from "next";
import Link from "next/link";
import { WHERE_GUIDES } from "@/lib/where";

export const metadata: Metadata = {
  title: "Where to Watch — Honest Answers for Gulf Households | Whisco TV",
  description:
    "Free legal, paid legal, or not available — the honest three-column answer for what Gulf expat households actually search for. No VPN coupons, no IPTV links.",
  alternates: { canonical: "https://whisco.tv/where" },
  robots: { index: true, follow: true },
};

export default function WhereIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">Where to watch</p>
      <h1 className="text-3xl font-extrabold mb-4">Honest answers, three columns</h1>
      <p className="text-zinc-300 leading-relaxed mb-8">
        Every page here answers one real question Gulf households search for — with three honest columns:
        what is <span className="text-green-400 font-semibold">free and legal</span>, what is{" "}
        <span className="text-orange-400 font-semibold">paid and legal</span>, and what is{" "}
        <span className="text-zinc-400 font-semibold">not legally available</span> (we say so instead of
        pretending). No VPN coupons. No IPTV boxes. Where we list ourselves, we say it is ours.
      </p>
      <div className="space-y-3">
        {WHERE_GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/where/${g.slug}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-orange-800 transition-colors"
          >
            <h2 className="font-bold text-white">{g.h1}</h2>
            <p className="text-sm text-zinc-500 mt-1">Answers: “{g.query}”</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
