import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found — Whisco TV",
  robots: { index: false, follow: true },
};

/**
 * 404 — Design System §3.7.
 *
 * This was Next's stock not-found: black text on a WHITE page, no nav, no brand.
 * On a dark-only product that is a white flash on every bad link, and it tells a
 * visitor nothing about where they are. Serious state, so: Announcer depiction,
 * one sentence, one action. No speech bubble.
 */
export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--w-bg)", color: "var(--w-fg)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/whisco-mascot-280.webp"
        alt=""
        width={120}
        height={120}
        className="w-[120px] h-[120px] object-contain mb-5 opacity-90"
      />
      <h1 className="text-xl sm:text-2xl font-bold">That page is not a title we have.</h1>
      <p className="mt-2 max-w-[36ch] text-sm" style={{ color: "var(--w-fg-muted)" }}>
        The link may be old, or the title may have moved. Live TV and On Demand are both one tap away.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="w-focusable px-6 py-3 font-semibold text-sm"
          style={{
            background: "var(--w-grad-cta)",
            borderRadius: "var(--w-radius-pill)",
            color: "var(--w-ink)",
          }}
        >
          Go home
        </Link>
        <Link
          href="/vod"
          className="w-focusable px-6 py-3 font-semibold text-sm"
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
    </div>
  );
}
