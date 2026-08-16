"use client";

import { useEffect, useRef } from "react";

// Display ad slot — provider-agnostic wrapper around Google AdSense.
//
// Behavior:
//  - When NEXT_PUBLIC_ADSENSE_CLIENT is unset (pre-approval), renders
//    NOTHING — the site stays completely clean with zero layout shift.
//  - When set (e.g. "ca-pub-1234567890123456"), renders a responsive
//    AdSense unit, quietly labeled "Advertisement" per policy, styled to
//    blend with the dark theme.
//
// Placements are deliberately few and low-friction: one slot per page,
// never inside the player area, never interrupting playback.

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  /** AdSense ad-unit slot id (from the AdSense dashboard). */
  slot?: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script blocked (ad blocker) — fail silently.
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <div className={`my-8 ${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1 text-center">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
