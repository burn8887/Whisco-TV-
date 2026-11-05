// Catalogue quality helpers, shared by the title page, Tonight on Whisco and the
// weekly AdSense readiness scan (scripts/adsense_readiness.mjs).
//
// Added 2026-11 for the AdSense recovery plan: AdSense twice rejected the site
// for "low value content". These helpers keep auto-imported single uploads out
// of curated surfaces and make every page say honestly where its video plays from.

const EPISODE_PATTERNS: RegExp[] = [
  /\b(?:ep|epi|episode)\.?\s*\d+/i,
  /\blast\s+episode\b/i,
  /\bpart\s*\d+\b/i,
  /الحلقة\s*\d+/u,
  /حلقة\s*\d+/u,
];

const SINGLE_UPLOAD_PATTERNS: RegExp[] = [
  ...EPISODE_PATTERNS,
  /\bfull\s+(?:movie|episode|hd)\b/i,
  /\[\s*eng(?:lish)?\s*sub(?:s|titles)?\s*\]/i,
  /\bpresented\s+by\b/i,
  /\blive\b/i,
  /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+20\d{2}\b/i,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},\s*20\d{2}\b/i,
];

/** The name reads like one episode of something, not a whole film or series. */
export function looksLikeEpisode(name: string): boolean {
  return EPISODE_PATTERNS.some((re) => re.test(name));
}

/** A single YouTube upload (an episode, a dated show, a live stream), not a curated series or named film. */
export function looksLikeSingleUpload(name: string): boolean {
  return SINGLE_UPLOAD_PATTERNS.some((re) => re.test(name));
}

const HARVESTED_MARKERS = [
  "official channel. Free and ad-supported",
  "من القناة الرسمية",
  "Official broadcaster upload",
];

/** The synopsis is the auto-generated import boilerplate, not written copy. */
export function isHarvestedSynopsis(synopsis: string): boolean {
  return HARVESTED_MARKERS.some((m) => synopsis.includes(m));
}

export type PlaybackSource = "youtube" | "archive" | "other";

type SourceShape = {
  sourceKind?: string | null;
  streamUrl?: string | null;
  seasons?: { episodes: { streamUrl?: string | null }[] }[];
};

/** Where the picture actually comes from. */
export function playbackSource(t: SourceShape): PlaybackSource {
  const url = t.streamUrl ?? t.seasons?.[0]?.episodes?.[0]?.streamUrl ?? "";
  if (t.sourceKind === "youtube-official-channel" || /youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (t.sourceKind === "archive-org" || /archive\.org/i.test(url)) return "archive";
  return "other";
}

/** For YouTube-sourced titles the import stores the uploading channel in `director`. */
export function officialChannelName(t: { director?: string | null }, source: PlaybackSource): string {
  if (source !== "youtube") return "";
  return (t.director ?? "").replace(/\s*\(official\)\s*$/i, "").trim();
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** "Turkish series, 52 episodes" · "Urdu episode" · "Hindi film" */
export function describeKind(t: { type: string; language: string; name: string }, episodeCount: number): string {
  const lang = t.language && t.language !== "English" ? `${t.language} ` : "";
  if (t.type === "SERIES") return cap(`${lang}series${episodeCount > 0 ? `, ${episodeCount} episodes` : ""}`);
  if (looksLikeEpisode(t.name)) return cap(`${lang}episode`);
  if (t.type === "DOCUMENTARY") return cap(`${lang}documentary`);
  return cap(`${lang}film`);
}

/** One factual sentence about where the video plays from. */
export function sourceSentence(t: { type: string; director?: string | null }, source: PlaybackSource, episodeCount: number): string {
  const channel = officialChannelName(t, source);
  const named = channel ? `, ${channel}` : "";
  if (source === "youtube") {
    if (t.type === "SERIES" && episodeCount > 0) {
      return `${episodeCount} episode${episodeCount === 1 ? "" : "s"} play in YouTube's player from the broadcaster's official channel${named}.`;
    }
    return `Plays in YouTube's player from the rights holder's official channel${named}.`;
  }
  if (source === "archive") return "Streams in the Internet Archive's own player.";
  return "Plays in the source's own player; Whisco TV hosts no video files.";
}
