# Tonight on Whisco — homepage embed

**Surface:** `whisco.tv` homepage  
**Format bible:** Originals Strategy §2.A — *Tonight on Whisco* / الليلة على وسکو  
**Date:** 10 September 2026  
**Status:** production-shaped patch. Founder (or Arena) pastes into `burn8887/iptv-app`. This chat cannot push the repo.

This is a living-room utility, not a popularity claim. Six communities. One title each. Live catalog only. If the APIs are dark, the section is absent. No error box. No “most watched in Bahrain.” No ad slot.

---

## 0. What ships

| File | Role |
|---|---|
| `components/tonight/TonightOnWhisco.tsx` | Server Component. Fetch + pick + layout. Default export. |
| `components/tonight/tonight-islands.tsx` | Client islands only: origin clock + poster `onError` fallback. |
| `components/tonight/tonight-picks.ts` | Types, community map, fetch, selector. No React. |

Three files. Nothing else. No new route, no new API, no analytics SDK, no ad unit.

---

## 1. Placement (current production homepage)

Live DOM on `https://www.whisco.tv/` as of 10 Sep 2026, in order:

1. sticky `<header>`
2. hero (`<section class="relative overflow-hidden">`)
3. “Whisco in action”
4. stats strip (`border-y border-white/5`)
5. `#channels`
6. **`#vod` — “Featured on demand”** ← insert immediately *before* this section
7. `#how`
8. `#whisco`
9. `#faq`
10. closing CTA

Repo source of truth is GitHub `burn8887/iptv-app` (private). The homepage is the App Router page that renders `x-matched-path: /`. Search the repo for the string `Featured on demand` or `id="vod"`. That file is the homepage. On this codebase it will be one of:

- `app/page.tsx`
- `app/(marketing)/page.tsx`
- `app/(site)/page.tsx`

### Exact insert

In that page file, next to the existing Featured-on-demand JSX:

```tsx
import { TonightOnWhisco } from "@/components/tonight/TonightOnWhisco";

// … hero, stats, #channels …

<TonightOnWhisco />

<section id="vod" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
  {/* existing Featured on demand row — do not remove */}
</section>
```

Do **not** wrap the section in a Suspense boundary that paints a skeleton on the homepage. The component returns `null` on failure; a fallback UI would violate the “render nothing” rule.

Do **not** add a header nav item in this patch. `id="tonight"` is already on the section if a later pass wants `#tonight`.

If the homepage already fetches `/api/mobile/v1/home` (it does — the Featured row is the `hero` array), pass the payload through so Next’s fetch cache dedupes rather than issuing a second origin request:

```tsx
<TonightOnWhisco initialHome={home} />
```

`TonightOnWhisco` still fetches `/api/mobile/v1/vod` itself, and only when a community is missing from `home`.

---

## 2. Code

Path alias `@/` is assumed (already true for this Next app). If the repo uses a different alias, rewrite the three imports. Do not invent a second alias.

### 2.1 `components/tonight/tonight-picks.ts`

```ts
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
```

### 2.2 `components/tonight/tonight-islands.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

type ClockProps = {
  city: string;
  timeZone: string;
  country: string;
};

function formatHm(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function HomeClock({ city, timeZone, country }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now ? formatHm(now, timeZone) : "––:––";

  return (
    <p
      className="mt-2 flex items-baseline gap-1.5 font-mono text-[11px] tabular-nums text-zinc-400"
      title={`${city}, ${country} (${timeZone})`}
    >
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/80" />
      <span className="truncate text-zinc-500">{city}</span>
      <span className="text-zinc-200">{time}</span>
    </p>
  );
}

type PosterProps = {
  src: string | null;
  alt: string;
  communityLabel: string;
};

export function TonightPoster({ src, alt, communityLabel }: PosterProps) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        className="flex aspect-[2/3] w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#0a0a0f] to-orange-950/40 px-3 text-center"
        aria-hidden="true"
      >
        <span className="text-gradient text-lg font-extrabold tracking-tight">
          Whisco
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {communityLabel}
        </span>
      </div>
    );
  }

  return (
    // Matching the existing homepage Featured row: raw <img>, not next/image.
    // Remote patterns for i.ytimg.com / archive.org are not assumed to be in next.config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={190}
      height={285}
      loading="lazy"
      decoding="async"
      className="aspect-[2/3] w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
```

### 2.3 `components/tonight/TonightOnWhisco.tsx`

```tsx
import Link from "next/link";
import { HomeClock, TonightPoster } from "./tonight-islands";
import {
  buildTonightPicks,
  type HomePayload,
  type TonightPick,
} from "./tonight-picks";

type Props = {
  /** Pass the homepage's existing /home payload when the page already fetched it. */
  initialHome?: HomePayload | null;
};

function typeLabel(type: string): string {
  if (type === "SERIES") return "Series";
  if (type === "DOCUMENTARY") return "Documentary";
  if (type === "MOVIE") return "Film";
  return "Title";
}

function PickCard({ pick }: { pick: TonightPick }) {
  const year =
    typeof pick.title.releaseYear === "number" && pick.title.releaseYear > 0
      ? String(pick.title.releaseYear)
      : null;

  return (
    <Link
      href={pick.href}
      className="group flex w-[168px] shrink-0 flex-col overflow-hidden rounded-2xl bg-zinc-900/80 ring-1 ring-white/5 transition hover:ring-orange-500/40 sm:w-[190px] lg:w-auto"
    >
      <div className="relative overflow-hidden">
        <TonightPoster
          src={pick.posterUrl}
          alt={pick.displayName}
          communityLabel={pick.community.languageChip}
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-200 ring-1 ring-orange-400/30 backdrop-blur-sm">
          {pick.community.languageChip}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">
          {pick.displayName}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          {typeLabel(pick.title.type)}
          {year ? ` · ${year}` : ""}
        </p>
        <HomeClock
          city={pick.community.originCity}
          timeZone={pick.community.originTz}
          country={pick.community.originCountry}
        />
      </div>
    </Link>
  );
}

export async function TonightOnWhisco({ initialHome }: Props = {}) {
  let picks: TonightPick[] = [];
  try {
    picks = await buildTonightPicks(initialHome);
  } catch {
    return null;
  }

  if (picks.length === 0) return null;

  return (
    <section
      id="tonight"
      aria-labelledby="tonight-heading"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-400">
            Tonight on Whisco
          </p>
          <h2
            id="tonight-heading"
            className="text-2xl font-extrabold sm:text-3xl"
          >
            One pick per living room
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            الليلة على وسکو · from the legal shelf, not a popularity rank.
          </p>
        </div>
        <Link
          href="/vod"
          className="text-sm font-medium text-orange-400 hover:text-orange-300"
        >
          Browse the full library →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible">
        {picks.map((pick) => (
          <PickCard key={pick.community.id} pick={pick} />
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Clocks are origin time for that shelf (Istanbul, Mumbai, Kochi, Karachi,
        Manila, Cairo) — the Home-Time idea, without a second app. Titles are
        whatever the catalog can play tonight. We do not invent a “trending in
        the Gulf” number. Live cricket is not on this shelf; pay the rights
        holder for that.
      </p>
    </section>
  );
}

export default TonightOnWhisco;
```

---

## 3. Theme tokens used (must match live homepage)

Taken from the 10 Sep 2026 homepage HTML, not invented:

| Token | Live use |
|---|---|
| `bg-[#0a0a0f]` | `<body>` |
| `text-zinc-100` / `text-zinc-400` / `text-zinc-500` | body + meta |
| `from-orange-500 to-pink-600` | CTA pills |
| `text-orange-400` | section kickers + “Browse the full library” |
| `rounded-2xl` + `ring-1 ring-white/5` | feature cards |
| `hover:ring-orange-500/40` | hover on `rounded-2xl` blocks |
| `aspect-[2/3]` + `object-cover` | Featured posters (YouTube 16:9 thumbs cropped the same way) |
| `flex gap-4 overflow-x-auto no-scrollbar` | Featured row on small screens |
| `text-gradient` | wordmark span — reused on the poster fallback |
| `max-w-7xl mx-auto px-4 sm:px-6` | every content section |

If `text-gradient` is not a global utility in the branch you paste into, replace the fallback wordmark class with `bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent`.

`no-scrollbar` already exists on the Featured row. Do not add a new CSS file.

---

## 4. Data contract (live, 10 Sep 2026)

### `GET /api/mobile/v1/home`

```
{
  stats: { channels: number, titles: number },
  hero: CatalogTitle[],          // currently 5; mostly Turkish Dizi + one Hindi
  rows: [
    { key: "trending" | "new" | "movies" | "series" | "docs", label, items[] }
  ],
  featuredChannels: Channel[]    // ignored here
}
```

`CatalogTitle` fields actually present: `id`, `slug`, `name`, `posterUrl`, `backdropUrl`, `type`, `releaseYear`, `imdbRating`, `collection`, `isNew`.

### `GET /api/mobile/v1/vod`

```
{
  mode: "shelves",
  total: number,
  shelves: [{ name, count, items: CatalogTitle[] }]   // 12 items/shelf
}
```

Collection names used as community keys (do not rename):

| Community | `collection` / shelf `name` |
|---|---|
| Turkish | `Turkish Dizi` |
| Hindi | `Hindi Cinema` (fallback `Hindi Serials & Shows`) |
| Malayalam | `Malayalam Cinema` |
| Urdu / Pakistani | `Pakistani Dramas` |
| Filipino | `Filipino Shows` |
| Arabic | `Arabic Series & Shows` |

Title URL confirmed live: `https://www.whisco.tv/title/{slug}` → 200 for `kurulus-osman`. `/vod/{slug}` is 404. Do not link to `/vod/{slug}`.

---

## 5. Selector behaviour (so review is not a taste argument)

Priority, then score:

1. `hero` match on that community’s collection
2. `rows.key === "series"`
3. `rows.key === "new"`
4. `rows.key === "trending"`
5. other home rows
6. VOD shelf items (only if still missing)

Score extras: `SERIES` +18, `isNew` +8, IMDb points. Penalties: episode-shaped titles (−35), dated broadcast titles (−12), “FULL MOVIE / HD / eng sub” noise (−6).

This is why Arabic resolves to `أب ولكن` from trending (a series) rather than `باب الحارة الحلقة 16` from the raw VOD shelf, and why Turkish resolves to `Kuruluş Osman` from hero rather than the newest incomplete drop.

Display names are cleaned for the card only. The href stays the real slug. We do not invent a series hub that the catalog does not have.

Fewer than six communities available → render the ones that resolved. Zero → `null`.

---

## 6. Failure matrix

| Condition | Render |
|---|---|
| Both APIs 5xx / timeout / throw | `null`. Homepage continues. No toast, no “unable to load”. |
| Home 200, VOD 5xx, all six already on home | Six cards. VOD never called if home already filled them. |
| Home 200, VOD 5xx, some communities missing | Render the ones home could fill. |
| Home 5xx, VOD 200 | VOD-only pass. Render whatever shelves can fill. |
| Title missing `posterUrl` or `onError` | Branded fallback (wordmark + language). Card still links. |
| Title missing `slug` or `name` | Dropped from candidates. |
| Duplicate slugs across hero + rows | Deduped by slug and id. |
| ISR cache stale vs catalog health cron | Acceptable. Health cron is 6-hourly; this cache is 15 min. Do not drop `revalidate` to `0`. |
| `AbortSignal.timeout` fires at 4s | Treated as down. `null` or partial, never an exception to the page. |

---

## 7. Doctrine / conflict flags

Called out instead of papered over.

1. **No “most watched tonight.”** Originals Strategy §0.4 and Operating Rules §1.1. Copy on the section is “from the legal shelf, not a popularity rank.” Do not swap that line for a Vercel Analytics count. We do not have the cohort.
2. **No ad unit in this section.** Max one ad/page, never near a player. This block sits above Featured, still above any AdSense slot. Do not add a display slot “to fill the sixth column.”
3. **YouTube thumbs are 16:9.** Homepage already crops them to `aspect-[2/3]`. We do the same. We do not hotlink a non-catalog still, a trailer frame, or a LoRA of the dog (Originals §0 / §2.A visuals).
4. **Episode-level inventory is real.** Pakistani, Filipino, and large parts of Arabic VOD are official YouTube *episodes*, not series hubs. The selector prefers series-shaped rows when they exist; when they do not, the card is an episode and the href is that episode. Do not write a fake `/title/bab-al-hara` series page in this patch.
5. **Self-fetch vs Neon.** The public mobile API is the allowed source. Do not open a Prisma/Neon client from this component. Do not add a new `/api/tonight` route that hits the database on every homepage view.
6. **`revalidate` must stay ≥ 900.** A reviewer who “just to be safe” sets `cache: 'no-store'` on these fetches will put homepage traffic on Neon. Reject that diff.
7. **Client JS is two islands only.** Clock (30s tick) and poster `onError`. No carousel library, no intersection observer for impressions, no analytics beacon.
8. **Apps stay “Data Not Collected.”** This is a website section. Do not port it into the Expo app with a tracking wrapper.
9. **Patronage does not pick the six.** If a patron underwrites the *Tonight* episode page later, they still do not land on this selector. No `?patron=` override.
10. **Istanbul and Bahrain are both UTC+3 year-round.** The Turkish clock will often read the same as Gulf time. Leave it. The point is origin, not a timezone trick.
11. **Cairo, not Riyadh, is the Arabic origin clock.** Production centre for the Arabic series shelf is Egypt. Gulf Arabic viewers still get Cairo time. If editorial later wants a dual clock, that is a new spec.
12. **Homepage Featured cards currently have no `href`.** That is an existing defect. This section *does* link. Do not “fix” Featured in the same commit unless the founder asks — keep the diff reviewable.
13. **Do not add `/originals/tonight/2026-w37` in this patch.** That URL belongs to the weekly VO episode, which does not exist on the domain yet. Linking it would 404.

---

## 8. Test checklist (reviewer, against production)

Run after the commit is on a Preview deploy, then again on `whisco.tv`.

### Compile / review

- [ ] `tsc --noEmit` clean under `strict`.
- [ ] No `any`. No `TODO`. No `localhost` fetch.
- [ ] Grep the diff for `no-store`, `revalidate: 0`, `cache: 'no-cache'`, `connection(`, `unstable_noStore`. All must be absent.
- [ ] Grep the diff for `adsbygoogle`, `gtag`, `pixel`, `analytics`. All must be absent.
- [ ] Only one `"use client"` file, and it does not fetch.

### Network

- [ ] Preview request to `/` shows at most two catalog calls: `/api/mobile/v1/home` and (only if needed) `/api/mobile/v1/vod`. Both have `cache-control` / Next fetch cache consistent with 900s, not a per-visitor origin hit.
- [ ] Killing those two paths (devtools → block URL) leaves the rest of the homepage intact and removes `#tonight` without an error boundary dump.
- [ ] `curl -sI https://www.whisco.tv/title/kurulus-osman` is 200. Every card href starts with `/title/`.

### Render

- [ ] Section sits above “Featured on demand”, below `#channels`.
- [ ] Kicker reads `TONIGHT ON WHISCO`. Arabic lock-up `الليلة على وسکو` is present.
- [ ] Six cards when the APIs are healthy. Confirm communities: Turkish, Hindi, Malayalam, Urdu, Filipino, Arabic.
- [ ] Each card: poster (or fallback), title, language chip, type/year, city + `HH:MM`.
- [ ] Clock ticks at least once in 30 seconds without a full reload.
- [ ] Manila time is ~5 hours ahead of Bahrain; Karachi ~2 hours ahead; Mumbai/Kochi ~2.5 ahead. Istanbul matches Gulf. Cairo is −1 or 0 depending on Egypt DST.
- [ ] Clicking a card lands on a real title page, not `/vod/{slug}` 404.
- [ ] A title with a broken `posterUrl` (temporarily rewrite one in React scan) shows the wordmark fallback, not a cracked-image icon.
- [ ] Mobile: row scrolls horizontally. `lg` and up: six-column grid.
- [ ] No layout shift that pushes the Featured row off by more than the section height.

### Honesty

- [ ] No “trending in Bahrain”, no MAU, no “everyone is watching”.
- [ ] No cricket / EPL / beIN promise anywhere in the block.
- [ ] No second ad between this section and Featured.

### Cache soak

- [ ] Load `/` twice in 60 seconds. Second load does not issue a fresh Neon-backed API miss (Vercel fetch cache or CDN HIT on the JSON).
- [ ] After 15+ minutes, picks may change if the catalog did. That is the contract.

---

## 9. Assumptions log

| # | Assumption | If wrong |
|---|---|---|
| A1 | Homepage source file is the App Router page that contains `id="vod"` / `Featured on demand`. | Search that string; the insert landmark is the DOM id, not the filename. |
| A2 | Path alias `@/` points at the repo root `src/` or project root the way the rest of the app already imports. | Rewrite the three import paths to whatever `tsconfig.paths` says. |
| A3 | `NEXT_PUBLIC_SITE_URL` is set on Vercel (likely `https://www.whisco.tv`). Fallback hardcodes that origin so Preview still resolves production catalog. | Preview-to-production catalog is intentional. Do not point Preview at a local Neon. |
| A4 | Fetching the public mobile API from the Next server is allowed and already the pattern for Featured. | If the page currently imports a server-only catalog helper, swap `fetchHomeCatalog` to call that helper — keep `revalidate ≥ 900`. |
| A5 | Title routes live at `/title/[slug]`. Verified 200 on 10 Sep 2026. | If a later IA moves titles, change `titleHref()` only. |
| A6 | Homepage Featured uses raw `<img>`, not `next/image`, for YouTube thumbs. | If the branch already allowlists `i.ytimg.com` in `images.remotePatterns`, `next/image` is optional. Not required. |
| A7 | `text-gradient` and `no-scrollbar` are global utilities already in the compiled CSS. | Fallbacks documented in §3. |
| A8 | `AbortSignal.timeout` exists on the Node runtime Vercel uses for this app (Node 18+). | If an older runtime appears, replace with `AbortController` + `setTimeout`. |
| A9 | Hindi = `Hindi Cinema` first. Serials are fallback only. | Editorial can invert the array in `COMMUNITIES`. |
| A10 | Arabic origin clock = Cairo. | Editorial call. Riyadh would match GCC wall-clock instead of production origin. |
| A11 | We will not ship a weekly “rule of the week” string until a human writes one. The widget is the shelf, not episode S01E01. | When `/originals/tonight/…` exists, add a one-line link under the heading. Do not add it now. |
| A12 | Catalog numbers on the rest of the homepage stay owned by that page. This section does not print `581` or `16878`. | Correct — those go stale independently. |
| A13 | Lucide is available (homepage already ships `lucide lucide-star`). This patch does not add an icon import, to keep the client island small. | A clock icon is optional and not required. |
| A14 | GitHub repo remains private; this document is the patch the founder applies. | Arena Agent Mode or a connected GitHub App can paste it. Tokens stay in the founder vault. |

---

## 10. Suggested commit message

```
feat(home): add Tonight on Whisco shelf

Six-community homepage section. Server Component, fetch cache 900s,
renders null when the mobile API is dark. Links to /title/[slug].
No ad slot, no popularity claim, no new route.
```

---

*Whisco TV — Life’s better at full speed, and full free. The dog is real. The streams are legal. The cricket is elsewhere.*
