import type { Metadata } from "next";
import type { Guide } from "@/lib/guides";

// ---------------------------------------------------------------------------
// Page-specific social tags for the guides.
//
// Why this file exists: every guide already carried its own <title>, meta
// description and canonical, but og:* / twitter:* were only set for the five
// slugs from the 21 Sep work order. The other guides — and the /guides index —
// inherited the site-wide card from src/app/layout.tsx, so sharing a guide
// announced "Whisco TV — Free Live TV & On-Demand Streaming" with the homepage
// description and the homepage image. Sharing a guide now shares the guide.
//
// Everything social is derived here once — description, canonical URL, share
// card — and the pages spread the result, so <meta name="description">, og:* and
// twitter:* cannot drift apart again.
// ---------------------------------------------------------------------------

export const SITE_URL = "https://www.whisco.tv";

/** The generic branded card (public/og-share-card.png), 1200x630. */
export const GENERIC_CARD_URL = `${SITE_URL}/og-share-card.png`;

/** Alt text for the generic card — it is a brand card, not guide art. */
const GENERIC_CARD_ALT = "Whisco TV — live news and public-domain film";

// Slugs the 21 Sep work order authorised a bespoke share card for. The generator
// at /api/og/guide/[slug] returns 404 for anything outside this set, so the set
// lives here and that route imports it: the metadata and the image can no longer
// disagree about which guides have a card, and no og:image can point at a 404.
export const GUIDE_CARD_SLUGS: ReadonlySet<string> = new Set([
  "free-legal-hd-turkish-series-english-subtitles",
  "hindi-serials-firestick-uae-legal",
  "telugu-live-tv-dubai-apartment-no-dish",
  "indonesian-tv-qatar-legal",
  "free-legal-arabic-series-smart-tv-gulf",
]);

export function hasGuideCard(slug: string): boolean {
  return GUIDE_CARD_SLUGS.has(slug);
}

/** Bespoke card where the generator serves one; the generic card otherwise. */
export function guideCardUrl(slug: string): string {
  return hasGuideCard(slug) ? `${SITE_URL}/api/og/guide/${slug}` : GENERIC_CARD_URL;
}

export function guideUrl(slug: string): string {
  return `${SITE_URL}/guides/${slug}`;
}

export function guidesIndexUrl(): string {
  return `${SITE_URL}/guides`;
}

/**
 * The guide's own meta description.
 *
 * This used to be `guide.intro.slice(0, 160)`, which cut 37 of the 39 guides
 * mid-word ("…Gulf. Every series we list"). The 160-character ceiling is
 * unchanged — it is the length a SERP snippet shows — but the cut now lands on
 * the last sentence that fits, or on a whole word when no sentence does. No
 * wording is invented and nothing is ever made longer than it was.
 */
export function guideDescription(guide: Guide, limit = 160): string {
  const intro = guide.intro.trim();
  if (intro.length <= limit) return intro;

  const window = intro.slice(0, limit);

  // Prefer a sentence boundary, but only if it leaves a usable snippet — a
  // 20-character description is worse than a trimmed one.
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (sentenceEnd >= 80) return window.slice(0, sentenceEnd + 1).trim();

  // Otherwise back off to the last whole word and mark the trim.
  const lastSpace = window.lastIndexOf(" ");
  const trimmed = (lastSpace > 0 ? window.slice(0, lastSpace) : window).trimEnd();
  return `${trimmed.replace(/[,;:]$/, "")}…`;
}

/**
 * Social block for one guide page: description, og:* and twitter:*.
 *
 * `title` is deliberately NOT returned — the page owns <title> and its
 * "| Whisco TV" template. The share titles below are the guide's own title,
 * matching how /title/[slug] already does it.
 */
export function guideSocialMetadata(guide: Guide): Pick<Metadata, "description" | "openGraph" | "twitter"> {
  const description = guideDescription(guide);
  const url = guideUrl(guide.slug);
  const bespoke = hasGuideCard(guide.slug);
  const card = guideCardUrl(guide.slug);
  const alt = bespoke ? guide.h1 : GENERIC_CARD_ALT;

  return {
    description,
    openGraph: {
      type: "article",
      url,
      siteName: "Whisco TV",
      title: guide.title,
      description,
      images: [{ url: card, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description,
      images: [card],
    },
  };
}

/**
 * Social block for the /guides index. It has no bespoke card, so it keeps the
 * generic one; its share title is the resolved document title ("Guides | Whisco
 * TV") because the bare page title is a single word.
 */
export function guidesIndexSocialMetadata(
  description: string,
): Pick<Metadata, "description" | "openGraph" | "twitter"> {
  const url = guidesIndexUrl();
  const title = "Guides | Whisco TV";

  return {
    description,
    openGraph: {
      type: "website",
      url,
      siteName: "Whisco TV",
      title,
      description,
      images: [{ url: GENERIC_CARD_URL, width: 1200, height: 630, alt: GENERIC_CARD_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [GENERIC_CARD_URL],
    },
  };
}
