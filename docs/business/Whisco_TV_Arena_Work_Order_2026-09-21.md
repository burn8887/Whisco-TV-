# Arena work order — graphics + guides — 21 September 2026
Paste this after the morning brief. Production repo is GitHub `burn8887` (site), not the Grok sanitized zip.

**Founder question: will graphics and articles be visible on whisco.tv today?**

| Thing | Live on the public site today? |
|---|---|
| New design-system chrome | **YES** — if you merge to `main` and Vercel production finishes today |
| The existing 7 guides | **Already yes** (`/guides/...`) |
| Up to **5 new** guides below | **YES** — if you add them to `GUIDES` and deploy today |
| 600 generated articles | **NO. Do not build them.** |
| Play / iOS listing graphics | **NO. Do not touch.** Those packets are in review |

This chat cannot push. Visibility today = your deploy today.

---

## Hard stops (same as morning brief)

- Do not edit Play listing, feature graphic, screenshots, AAB.
- Do not change iOS binary or 8+8 gate (`X-Whisco-Store`).
- Do not rewrite `/about` into a catalog. No 500 / 14,000 / 615 chips on `/about`.
- Do not expand the short sitemap with title URLs. Do not lift `noindex` on thin catalog pages.
- Do not click AdSense Request review.
- Do not generate one article per VOD/live row.

`cached.ts` stays the catalog read path. New guide pages are static content from `src/lib/guides.ts` (or the production equivalent). They do not query the catalog in a loop.

---

## Job A — graphics (website chrome only)

Source of truth: `artifacts/Whisco_TV_Design_System.md` in the Grok project. Tokens already used in spirit: canvas `#0a0a0f`, ember `#f97316` → bloom `#db2777`, `rounded-2xl`, `ring-white/5`, dark only.

**Do today**

1. Apply tokens on existing templates: root layout, nav, footer, home rails, `/guides` index, `/guides/[slug]` article frame. Not a new marketing microsite.
2. Nav stays: Mark · Live · On Demand · New · Search. Overflow: Guides, Languages, About, Legal. No Sign-in CTA required.
3. Guide template: readable measure, mid-article slot reserved for **one** display ad later (do not insert an ad tag today). Never next to a player — guides have no player.
4. OG / social card for new guide slugs only.
5. Cartoon Announcer Whisco: empty states / marketing only. Not on every title card. No public LoRA.

**Do not today**

- Play 1024×500 feature graphic or store screenshots.
- Homepage hero that says the app is “on Google Play” (Production 7 is still in review).
- Counts in chrome (“600 channels”, “16k titles”).

PR title: `web: design-system chrome (no about rewrite, no store assets)`.

---

## Job B — as many *real* articles as you can ship today = five

Guides are the array in `src/lib/guides.ts` (`GUIDES`). Adding a page = append one object `{ slug, title, h1, intro, sections[], ctaLabel, ctaHref }`. Confirm production still has `/guides` and `/guides/[slug]` routes (sitemap already registers every `GUIDES` entry).

Existing slugs (already live — do not duplicate):

- `turkish-series-guide`
- `free-tv-for-expats-gulf`
- `pakistani-dramas-guide`
- `bollywood-classics-free`
- `malayalam-movies-gulf`
- `arabic-series-guide`
- `cut-the-pirate-box`

**Add these five today.** Full prose is in `artifacts/Whisco_TV_SEO_Content_Pack.md` Part 2 (Drafts A–E). Port into the `Guide` shape. Do not invent extra slugs in the same PR.

| # | Slug | Source | CTA |
|---|---|---|---|
| 1 | `free-legal-hd-turkish-series-english-subtitles` | Draft A / Gap 1 | `/turkish` or existing Turkish shelf |
| 2 | `hindi-serials-firestick-uae-legal` | Draft B / Gap 4 | `/hindi` |
| 3 | `telugu-live-tv-dubai-apartment-no-dish` | Draft C / Gap 11 | `/telugu` or `/live` |
| 4 | `indonesian-tv-qatar-legal` | Draft D / Gap 14 | `/indonesian` |
| 5 | `free-legal-arabic-series-smart-tv-gulf` | Draft E / Gap 20 | `/arabic` |

**Strip before publish**

- VPN how-tos, M3U, sideload, “our app geo-filters.”
- “Now on Google Play / App Store” until a non-tester can install.
- “500+ live / 14,000+ VOD” as a boast. If an existing guide says that and you already have the file open, delete the counts. Do not otherwise rewrite the old seven in this PR.
- iptv-org, streamlock, pirate box punchlines that a journalist can misquote.

**After merge**

- IndexNow ping **only** `/guides` + the five new slugs (maintenance cron already lists the old seven — append the new five there).
- Do not add 16k title URLs to that ping.

If you cannot finish all five before end of day: ship **A + B** first (Turkish EN-sub + Hindi Gulf). Leave C–E on the same branch if they compile; do not hold chrome hostage to draft E.

---

## Job C — verify, do not “fix” by publishing more URLs

Paste back to founder/Desk:

1. Production URL of `/about` — still count-free, no live grid.  
2. One thin title URL still `noindex`.  
3. Short sitemap still short.  
4. Live URLs for each new guide you actually deployed.  
5. Whether chrome PR is on production or preview only.

---

## Definition of done today

- [ ] Chrome PR on **production** Vercel (or explicit “preview only” if founder has not nodded merge).
- [ ] 2–5 new `GUIDES` entries live at `https://www.whisco.tv/guides/[slug]`.
- [ ] `/about` unchanged in meaning.
- [ ] App API 8+8 gate untouched.
- [ ] Zero AdSense clicks.
- [ ] Zero Play Console clicks.

If a choice is “more pages” vs “keep noindex + short sitemap,” keep noindex. AdSense is already **Low value content**. Volume is the problem, not the shortage.
