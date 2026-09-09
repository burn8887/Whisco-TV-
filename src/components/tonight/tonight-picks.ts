/**
 * Tonight on Whisco — data + selector.
 * Server-only module. Do not import from a Client Component.
 *
 * Sources (public, already cached in front of Neon):
 *   GET https://www.whisco.tv/api/mobile/v1/home
 *   GET https://www.whisco.tv/api/mobile/v1/vod   (mode=shelves, 12 items/shelf)
 *
 * ISR: every fetch uses revalidate = 900. Do not lower this.
 * Per-request fetching of these endpoints is a review fail.
 */

export const TONIGHT_REVALIDATE_SECONDS = 900;

export type CatalogType = "MOVIE" | "SERIES" | "DOCUMENTARY" | string;

export type CatalogTitle = {
  id: string;
  slug: string;
  name: string;
  posterUrl: string | null;
  backdropUrl?: string | null;
  type: CatalogType;
  releaseYear: number | null;
  imdbRating: number | null;
  collection: string;
  isNew: boolean;
};

export type HomePayload = {
  stats?: { channels?: number; titles?: number };
  hero?: CatalogTitle[];
  rows?: Array<{ key: string; label: string; items: CatalogTitle[] }>;
  featuredChannels?: unknown;
};

export type VodShelf = {
  name: string;
  count: number;
  items: CatalogTitle[];
};

export type VodPayload = {
  mode?: string;
  total?: number;
  shelves?: VodShelf[];
};

export type CommunityId =
  | "turkish"
  | "hindi"
  | "malayalam"
  | "urdu"
  | "filipino"
  | "arabic";

export type CommunityDef = {
  id: CommunityId;
  label: string;
  languageChip: string;
  languageChipAr?: string;
  collections: readonly string[];
  /** Origin city shown on the Home-Time clock. */
  originCity: string;
  originTz: string;
  originCountry: string;
};

export type TonightPick = {
  community: CommunityDef;
  title: CatalogTitle;
  href: string;
  displayName: string;
  posterUrl: string | null;
};

export const COMMUNITIES: readonly CommunityDef[] = [
  {
    id: "turkish",
    label: "Turkish living room",
    languageChip: "Turkish",
    languageChipAr: "التركية",
    collections: ["Turkish Dizi"],
    originCity: "Istanbul",
    originTz: "Europe/Istanbul",
    originCountry: "Türkiye",
  },
  {
    id: "hindi",
    label: "Hindi living room",
    languageChip: "Hindi",
    collections: ["Hindi Cinema", "Hindi Serials & Shows"],
    originCity: "Mumbai",
    originTz: "Asia/Kolkata",
    originCountry: "India",
  },
  {
    id: "malayalam",
    label: "Malayalam living room",
    languageChip: "Malayalam",
    collections: ["Malayalam Cinema"],
    originCity: "Kochi",
    originTz: "Asia/Kolkata",
    originCountry: "India",
  },
  {
    id: "urdu",
    label: "Pakistani living room",
    languageChip: "Urdu",
    collections: ["Pakistani Dramas"],
    originCity: "Karachi",
    originTz: "Asia/Karachi",
    originCountry: "Pakistan",
  },
  {
    id: "filipino",
    label: "Filipino living room",
    languageChip: "Filipino",
    collections: ["Filipino Shows"],
    originCity: "Manila",
    originTz: "Asia/Manila",
    originCountry: "Philippines",
  },
  {
    id: "arabic",
    label: "Arabic living room",
    languageChip: "Arabic",
    languageChipAr: "العربية",
    collections: ["Arabic Series & Shows"],
    originCity: "Cairo",
    originTz: "Africa/Cairo",
    originCountry: "Egypt",
  },
] as const;

const API_ROOT = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.whisco.tv"
).trim();

const FETCH_INIT: RequestInit & { next: { revalidate: number } } = {
  method: "GET",
  headers: { accept: "application/json" },
  cache: "force-cache",
  next: { revalidate: TONIGHT_REVALIDATE_SECONDS },
};

async function readJson<T>(path: string): Promise<T | null> {
  const url = `${API_ROOT}${path}`;
  try {
    const res = await fetch(url, {
      ...FETCH_INIT,
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchHomeCatalog(): Promise<HomePayload | null> {
  return readJson<HomePayload>("/api/mobile/v1/home");
}

export async function fetchVodShelves(): Promise<VodPayload | null> {
  return readJson<VodPayload>("/api/mobile/v1/vod");
}

const EPISODE_RE =
  /\b(episode|ep\.?|full episode|الحلقة|حلقة|babak|pt\.?\s*\d)\b/i;
const DATED_BROADCAST_RE =
  /\b(\d{1,2}(st|nd|rd|th)?\s+\w+\s+20\d{2}|\(\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+20\d{2}\s*\)|20\d{2}-\d{2}-\d{2})\b/i;
const CLIP_NOISE_RE =
  /\b(full movie|hd\b|watch online|new released|eng(?:lish)?\s*subs?)\b/i;

export function cleanDisplayName(name: string): string {
  const trimmed = name.replace(/\s+/g, " ").trim();
  const stripped = trimmed
    .replace(/\s*[\(\[]\s*eng(?:lish)?\s*subs?\s*[\)\]]/gi, "")
    .replace(/\s*[-–—:]\s*(full episode|full movie).*$/i, "")
    .replace(/\s+episode\s+\d+\b.*$/i, "")
    .replace(/\s+الحلقة\s+\d+.*$/u, "")
    .replace(/\s+حلقة\s+\d+.*$/u, "")
    .replace(/\s*\(\s*\d{1,2}(st|nd|rd|th)?\s+\w+\s+20\d{2}\s*\).*$/i, "")
    .replace(/\s*[-–—:]\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length >= 2 ? stripped : trimmed;
}

function isUsablePoster(url: string | null | undefined): url is string {
  if (!url) return false;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return false;
  if (u.startsWith("data:")) return false;
  return true;
}

function titleHref(slug: string): string {
  return `/title/${encodeURIComponent(slug)}`;
}

type Ranked = {
  title: CatalogTitle;
  source:
    | "hero"
    | "row:series"
    | "row:new"
    | "row:trending"
    | "row:other"
    | "vod";
};

function sourceWeight(source: Ranked["source"]): number {
  switch (source) {
    case "hero":
      return 100;
    case "row:series":
      return 55;
    case "row:new":
      return 40;
    case "row:trending":
      return 28;
    case "row:other":
      return 12;
    case "vod":
      return 8;
  }
}

function score(candidate: Ranked): number {
  const t = candidate.title;
  let s = sourceWeight(candidate.source);
  if (t.type === "SERIES") s += 18;
  if (t.isNew) s += 8;
  if (typeof t.imdbRating === "number" && t.imdbRating > 0) {
    s += Math.min(t.imdbRating, 10);
  }
  const name = t.name ?? "";
  if (EPISODE_RE.test(name)) s -= 35;
  if (DATED_BROADCAST_RE.test(name)) s -= 12;
  if (CLIP_NOISE_RE.test(name)) s -= 6;
  if (!t.slug || !t.name) s -= 80;
  return s;
}

function rowSource(key: string): Ranked["source"] {
  if (key === "series") return "row:series";
  if (key === "new") return "row:new";
  if (key === "trending") return "row:trending";
  return "row:other";
}

function belongsTo(title: CatalogTitle, community: CommunityDef): boolean {
  return community.collections.includes(title.collection);
}

function collectCandidates(
  community: CommunityDef,
  home: HomePayload | null,
  vod: VodPayload | null,
): Ranked[] {
  const out: Ranked[] = [];
  const seen = new Set<string>();

  const push = (title: CatalogTitle | undefined, source: Ranked["source"]) => {
    if (!title?.id || !title.slug || !title.name) return;
    if (!belongsTo(title, community)) return;
    if (seen.has(title.slug) || seen.has(title.id)) return;
    seen.add(title.slug);
    seen.add(title.id);
    out.push({ title, source });
  };

  if (home?.hero) {
    for (const t of home.hero) push(t, "hero");
  }
  if (home?.rows) {
    for (const row of home.rows) {
      const source = rowSource(row.key);
      for (const t of row.items ?? []) push(t, source);
    }
  }
  if (vod?.shelves) {
    for (const shelf of vod.shelves) {
      if (!community.collections.includes(shelf.name)) continue;
      for (const t of shelf.items ?? []) push(t, "vod");
    }
  }
  return out;
}

function pickForCommunity(
  community: CommunityDef,
  home: HomePayload | null,
  vod: VodPayload | null,
): TonightPick | null {
  const ranked = collectCandidates(community, home, vod);
  if (ranked.length === 0) return null;
  ranked.sort((a, b) => score(b) - score(a));
  const winner = ranked[0].title;
  return {
    community,
    title: winner,
    href: titleHref(winner.slug),
    displayName: cleanDisplayName(winner.name),
    posterUrl: isUsablePoster(winner.posterUrl) ? winner.posterUrl : null,
  };
}

function missingCommunities(
  picks: TonightPick[],
): CommunityDef[] {
  const have = new Set(picks.map((p) => p.community.id));
  return COMMUNITIES.filter((c) => !have.has(c.id));
}

/**
 * Build tonight's shelf.
 * Home is enough for most communities (hero + trending + new).
 * VOD shelves are fetched only to fill gaps, so a healthy home
 * payload does not drag the 28-shelf document onto the homepage.
 */
export async function buildTonightPicks(
  initialHome?: HomePayload | null,
): Promise<TonightPick[]> {
  const home = initialHome ?? (await fetchHomeCatalog());
  let vod: VodPayload | null = null;

  const firstPass = COMMUNITIES.map((c) => pickForCommunity(c, home, null));
  const found = firstPass.filter((p): p is TonightPick => p !== null);

  if (missingCommunities(found).length > 0) {
    vod = await fetchVodShelves();
  }

  const picks = COMMUNITIES.map((c) => pickForCommunity(c, home, vod)).filter(
    (p): p is TonightPick => p !== null,
  );

  return picks;
}