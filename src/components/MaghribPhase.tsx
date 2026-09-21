"use client";

import { useEffect } from "react";
import { isMaghrib } from "@/lib/sunset";

/**
 * Maghrib hour — a CLASS on the hero, not a ticking clock in the DOM.
 *
 * The lamp comes up in the evening: ember lifts ~8% in lightness and the aurora
 * thickens (see `.w-phase-maghrib` in globals.css). Bahrain sunset → +90 minutes.
 *
 * Deliberately a client effect, not server-side time: the page stays statically
 * renderable, there is no flash of the wrong phase before hydration, and the
 * server HTML is identical for every viewer. The class is the only thing that
 * changes, and CSS does the rest — no re-render, no interval touching React
 * state, no countdown in the markup.
 *
 * Scope is the caller's problem: this is applied to home and hub heroes only.
 * Never /about, /terms, /privacy, the player, or a guide body.
 */
export default function MaghribPhase({
  selector,
  className = "w-phase-maghrib",
}: {
  selector: string;
  className?: string;
}) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    let done = false;
    const apply = () => {
      if (done) return;
      el.classList.toggle(className, isMaghrib(new Date()));
    };

    apply();

    // One minute is finer than anyone can perceive a lamp dimming, and it is
    // cheap enough to leave running on a mid-range phone.
    const id = window.setInterval(apply, 60000);
    return () => {
      done = true;
      window.clearInterval(id);
    };
  }, [selector, className]);

  return null;
}
