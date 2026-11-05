// Editorial write-ups for curated series and films, shown on /title/[slug].
//
// Publishing rule (Nov 2026 AdSense recovery plan): every entry is drafted,
// fact-checked with sources, and reviewed by a person before it is merged.
// Merging the pull request is the act of publishing — no agent publishes alone.
// A title page only carries an ad slot when it has a note (YouTube API
// Developer Policies III.G.1.d: ads need independent value beyond the embed).

export type SeriesNote = {
  headline: string;
  paragraphs: string[]; // first paragraph doubles as the meta description
  author: string; // e.g. "Whisco TV editorial team"
  reviewedOn: string; // "12 Nov 2026" — the day a person checked it
  sources: { label: string; url: string }[];
};

// Keyed by Title.slug. Empty until the first reviewed batch is merged.
export const SERIES_NOTES: Record<string, SeriesNote> = {};
