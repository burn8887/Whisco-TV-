/**
 * STORE SCOPE — which storefront is asking?
 *
 * Apple rejected build 5 under Guideline 5.2.2 for third-party copyrighted
 * content. Grok's locked plan (2026-09-15) narrows the iOS catalogue to items a
 * human has ticked as evidenced (`clearedForApp = true`), while the website and
 * the Android closed test keep the full catalogue.
 *
 * Grok's instruction, verbatim: "iOS client sends X-Whisco-Store: ios (or
 * ?store=ios). That route returns clearedForApp=true only. Do not gate cached.ts."
 *
 * So the gate lives HERE and in the route handlers — never in `cached.ts`, which
 * also serves the public website. Gating the shared cache would empty /vod for
 * real viewers and collide with the AdSense content work.
 *
 * FAIL CLOSED: anything that is not explicitly recognised as the iOS store is
 * treated as the public store — but the iOS store never falls back to the public
 * catalogue. An uncleared item is a 404 on the iOS store, not a fallback.
 *
 * IMPORTANT (cache safety): the iOS response is keyed on a request HEADER, and
 * shared caches do not vary on custom headers by default. If we let the CDN cache
 * it, an iOS request could poison the cache for web viewers, or worse, the empty
 * iOS list could be served to the website. Every iOS response is therefore
 * `private, no-store`, and every public response carries `Vary` on the header so
 * the two can never be confused.
 */

export const STORE_HEADER = "x-whisco-store";
export const STORE_IOS = "ios";

/** True when the caller identifies as the iOS App Store client. */
export function isIosStore(req: Request): boolean {
  try {
    const header = (req.headers.get(STORE_HEADER) || "").trim().toLowerCase();
    if (header === STORE_IOS) return true;
    const url = new URL(req.url);
    return (url.searchParams.get("store") || "").trim().toLowerCase() === STORE_IOS;
  } catch {
    return false;
  }
}

/** Headers for an iOS-store response: never cached by a shared cache. */
export const IOS_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: STORE_HEADER,
} as const;

/** Headers for a public (web / Android / unknown) response. */
export const PUBLIC_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  Vary: STORE_HEADER,
} as const;

/** Where a reviewer or user reports a rights problem. */
export const RIGHTS_CONTACT = "legal@whisco.tv";
