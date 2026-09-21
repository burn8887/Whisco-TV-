"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Shelf row — Design System §3.2 + §4.1.
 *
 * `.w-shelf-track` carries content-visibility: auto and keeps native
 * scroll-snap. No scroll-jacking, no pinned sections: those break RTL and
 * TalkBack, and both matter more than the flourish.
 *
 * The arrows are a pointer affordance only (`hidden sm:flex`) — a touch device
 * swipes the shelf. They remain real buttons with labels for keyboard users.
 */
export default function Row({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(700, el.clientWidth * 0.8),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <section className="w-shelf">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--w-fg)" }}>
          {title}
        </h2>
        <div className="hidden sm:flex gap-1">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} back`}
            className="w-focusable p-1.5"
            style={{ borderRadius: "var(--w-radius-pill)", background: "var(--w-bg-elev-2)" }}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} forward`}
            className="w-focusable p-1.5"
            style={{ borderRadius: "var(--w-radius-pill)", background: "var(--w-bg-elev-2)" }}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={ref} className="w-shelf-track no-scrollbar">
        {children}
      </div>
    </section>
  );
}
