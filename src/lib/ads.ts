/**
 * Ad configuration — the single source of truth for whether an ad can actually
 * serve.
 *
 * Why this file exists at all: "the publisher id is set" and "an approval ad
 * unit exists" are two different facts, and conflating them is what produced an
 * empty 250px box on every guide page.
 *
 * The hardcoded publisher-id fallback is DELIBERATE and load-bearing — AdSense's
 * site-verification crawler looks for that exact tag in the raw HTML (see the
 * note in src/app/layout.tsx). Nothing in this module changes it.
 */

/** Publisher id. The fallback must stay: site verification depends on it. */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7207533964778777";

/**
 * An approved, serving ad unit.
 *
 * Until a slot id is configured there is nothing that CAN fill a well, so
 * reserving space for it just paints a hole. Guide pages collapse instead
 * (Desk ruling 21 Sep 2026, P1: "empty guide ad well collapsed, min-height 0
 * when no unit").
 *
 * When an approved unit exists, set NEXT_PUBLIC_ADSENSE_SLOT and every well
 * reserves its space again — no per-page edit, and no layout shift on the day
 * it goes live beyond the one-time appearance of the unit itself.
 */
export const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "";

/** Is there an ad unit that can actually serve? */
export const AD_UNIT_LIVE = ADSENSE_SLOT.length > 0;
