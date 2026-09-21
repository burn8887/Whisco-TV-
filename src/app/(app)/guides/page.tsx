import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Original guides from Whisco TV: how Gulf expats can watch TV from home, legally and free, from official broadcaster channels and public-domain archives. Our apps carry a smaller, documented shelf — official YouTube news live, plus archive.org public-domain film.",
  alternates: { canonical: "https://www.whisco.tv/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto px-4 sm:px-6 py-12" style={{ maxWidth: "68ch" }}>
      <h1 className="w-display text-3xl font-extrabold mb-2">Guides</h1>
      <p className="mb-8" style={{ color: "var(--w-fg-muted)" }}>
        Written by us, for our viewers — honest orientation for the content we carry.
      </p>
      <div className="space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block rounded-2xl p-5 transition" style={{ background: "var(--w-bg-elev-1)", border: "1px solid var(--w-chip-border)" }}
          >
            <p className="font-bold">{g.h1}</p>
            <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--w-fg-muted)" }}>{g.intro}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
