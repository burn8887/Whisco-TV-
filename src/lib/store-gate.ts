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
 * ANDROID (Grok, 2026-09-17): the Play build must ship the SAME 8 + 8 catalogue as
 * iOS build 7, under the same doctrine. Option (A) was chosen and is documented
 * here: the gate accepts `android` and `play` as well as `ios`, so both stores get
 * the identical cleared catalogue from one code path. Option (B) — sending the
 * string "ios" from Android — was rejected as dishonest naming.
 *
 * What the three cases do, and there are only three:
 *   header/param is ios | android | play -> the CLEARED catalogue (8 live, 8 VOD)
 *   no header at all                     -> the FAT catalogue (website, old clients)
 *   anything else                        -> the FAT catalogue
 *
 * A missing header is deliberately NOT an empty list. The Play closed-test binary
 * already installed on testers sends no header; it must keep working (it shows the
 * fat catalogue) until testers update, and then it narrows itself.
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
export const STORE_ANDROID = "android";
export const STORE_PLAY = "play";

/** Every value that means "this is an app-store client, give it the cleared catalogue".
 *  One list, so the two stores cannot drift apart. */
const CLEARED_STORES = [STORE_IOS, STORE_ANDROID, STORE_PLAY];

/** The store value this request carries, or "public". One parse, used by every
 *  predicate below so the three cases can never disagree about what was asked. */
function requestedValue(req: Request): string {
  try {
    const header = (req.headers.get(STORE_HEADER) || "").trim().toLowerCase();
    if (header) return header;
    const url = new URL(req.url);
    return (url.searchParams.get("store") || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

/**
 * iOS App Store, BUILD 8 — the live-only binary.
 *
 * Apple rejected 1.0 (7) again on 2026-09-28 under 5.2.2, this time asking for
 * documentary evidence "from the rights holder". Build 7's pack was ours plus
 * third-party pages; a public-domain declaration on an archive.org item page is
 * not a grant issued by a rights holder, and there is no rights holder for a
 * public-domain film to write one.
 *
 * The Desk's ruling for build 8 (2026-09-28): the Apple binary carries EIGHT
 * OFFICIAL NEWS LIVE STREAMS AND NOTHING ELSE. No films, no series, no poster
 * wall, no on-demand rail. This predicate is the switch for that behaviour, and
 * it is deliberately NARROWER than `isClearedStore`: Android/Play keep the
 * 8 + 8 catalogue they are already in review with, and must not be dragged
 * along by an Apple decision.
 */
export function isIosStore(req: Request): boolean {
  return requestedValue(req) === STORE_IOS;
}

/** Android / Play. Unchanged behaviour: the cleared 8 live + 8 films. */
export function isAndroidStore(req: Request): boolean {
  const v = requestedValue(req);
  return v === STORE_ANDROID || v === STORE_PLAY;
}

/** True when the caller identifies as an app-store client (iOS or Android/Play). */
export function isClearedStore(req: Request): boolean {
  try {
    const header = (req.headers.get(STORE_HEADER) || "").trim().toLowerCase();
    if (CLEARED_STORES.includes(header)) return true;
    const url = new URL(req.url);
    return CLEARED_STORES.includes((url.searchParams.get("store") || "").trim().toLowerCase());
  } catch {
    return false;
  }
}

/** Which cleared store asked — "ios", "android" or "play". Purely a label in the
 *  response, so a Play client is never told it is an iOS client. Returns "public"
 *  when the caller did not identify as a store at all. */
export function requestedStore(req: Request): string {
  try {
    const header = (req.headers.get(STORE_HEADER) || "").trim().toLowerCase();
    if (CLEARED_STORES.includes(header)) return header;
    const url = new URL(req.url);
    const q = (url.searchParams.get("store") || "").trim().toLowerCase();
    return CLEARED_STORES.includes(q) ? q : "public";
  } catch {
    return "public";
  }
}

/* REMOVED 2026-09-28 — the old `export const isIosStore = isClearedStore` alias.
 *
 * It existed so a missed import could not break a route silently. It has to go,
 * because the name now means something NARROWER and opposite in effect:
 * `isIosStore` is Apple's build 8 (eight live streams, zero on-demand) while
 * `isClearedStore` is every app store (8 live + 8 films). Leaving the alias would
 * let a future route import `isIosStore` believing it gets the cleared catalogue
 * and silently get the live-only one — or worse, believe it is gating Apple while
 * it is really serving the films to both stores. A name that can mean both is
 * exactly how a 5.2.2 gate springs a leak.
 *
 * Nothing imported it: verified by grep across src/ and the repo on 2026-09-28.
 */

/** Headers for a cleared-store response: never cached by a shared cache, because the
 *  body depends on a request header that shared caches do not vary on by default. */
export const CLEARED_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: STORE_HEADER,
} as const;

/** Older name for the same headers. */
export const IOS_HEADERS = CLEARED_HEADERS;

/** Headers for a public (web / Android / unknown) response. */
export const PUBLIC_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  Vary: STORE_HEADER,
} as const;

/** Where a reviewer or user reports a rights problem. */
export const RIGHTS_CONTACT = "legal@whisco.tv";
