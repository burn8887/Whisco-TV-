# CLAUDE.md — Whisco TV

Standing rules for any Claude session working in this repository, distilled from
`docs/ops/ADSENSE_RECOVERY.md` and `WHISCO_TV_PROJECT_HANDOVER.md`. These are rules,
not status: for the current state, measure it (the repo, Vercel and the live site win over
any document). This file holds no secret values. Never add one.

## The project
- Whisco TV (www.whisco.tv): free, ad-supported live TV and on-demand video for Gulf expatriate
  communities (South Asian, Filipino, Indonesian and Arab viewers, and Turkish dizi fans).
  No subscription, ever: advertising is the only revenue model.
- Founder: Ali, in Bahrain. Hands-on, not deeply technical, direct. Expects fixes that really
  work and honest statements of what can't be done.
- **This repository is public.** Everything committed, including history, is world-readable.
- `salim-workspace/` is a separate product (Salim) with its own rules. Read its README before
  touching it. Whisco work never changes it.
- The mobile app lives in a separate repository, `burn8887/whisco-mobile`.

## Stack and commands
- Next.js 16.3 (App Router), React 19, Tailwind v4, NextAuth v5 beta, on Vercel.
- Prisma is **pinned to 5.22**: Prisma 7 broke the datasource env. Don't upgrade it.
- The database is Neon Postgres, reached through the **pooled** endpoint (the direct endpoint
  exhausted its connection pool).
- Install: `npm ci`. Typecheck: `npx tsc --noEmit` (there is no typecheck script).
  Lint: `npm run lint` (currently two pre-existing `t as any` errors in `src/app/(app)/page.tsx`
  and `src/app/(app)/title/[slug]/page.tsx`). Build: `npm run build`.
- The build prerenders `/feed.xml` from the database. Without a reachable `DATABASE_URL` it
  compiles, then stops there. The Vercel preview is the full build.
- Production is **www.whisco.tv**. The apex 308-redirects to www, so canonicals, sitemap,
  JSON-LD and share links use `https://www.whisco.tv`. Call cron endpoints on www
  (`curl -L`).

## How work ships
- GitHub is the source of truth. Work goes on a branch and through a pull request. Every push
  gets a Vercel preview, and merging to `main` deploys production.
- Before merging: typecheck, build, and check the Vercel preview on the pages you changed.
- Series notes and other editorial copy are drafted with sources, reviewed by a person (Ali),
  and published by merging. No agent publishes alone. Set `reviewedOn` to the approval date
  before merging.
- The guide merge map in `docs/ops/ADSENSE_RECOVERY.md` is a proposal. No guide is merged or
  redirected without Ali's approval.
- Spending: any single spend over $300, or any new recurring cost over $100 a month, needs
  Ali's confirmation in chat first.

## AdSense recovery (docs/ops/ADSENSE_RECOVERY.md)
AdSense rejected the site for "low value content" on 29 Aug and 3 Nov 2026, because its pages
read like a templated aggregator of embedded video. Standing rules:
- No "watch … online free / full movie / full series" wording anywhere: not in titles,
  descriptions, body copy, `<meta name="keywords">` or JSON-LD.
- No rating shown or marked up unless it has a cited source. Never emit `aggregateRating`.
- Title pages say where the video plays from (the provenance block; helpers in
  `src/lib/catalog-quality.ts`).
- A title page carries an ad slot only when it has a series note (`src/lib/series-notes.ts`;
  YouTube API Developer Policies III.G.1.d).
- Ads render only once `NEXT_PUBLIC_ADSENSE_SLOT` is set. Auto Ads stay off; use manual
  `AdSlot` placements only.
- The AdSense loader is a plain `<script>` in the layout head, because `next/script` was
  invisible to the verifier.
- The homepage and "Tonight on Whisco" show curated series and named films, never single
  uploads. Auto-imported single uploads (with the boilerplate synopsis) stay `noindex`.
- **Review gate.** Request review only when all four of these pass:
  1. The weekly readiness scan (`adsense-readiness.yml`, Mondays 04:00 UTC, reporting to one
     Issue labelled `adsense-readiness`) has zero findings.
  2. Database errors stay under 10 a day for 14 straight days (Vercel runtime errors).
  3. At least 50 series notes are published and the guide merge is live.
  4. Four weeks have passed since the last big template change. Phase 1 (PR #41) merged on
     6 Nov 2026; any new big template change restarts the clock.

  When all four pass, Ali requests the review (AdSense → Sites → whisco.tv → Request review).
- The AdSense API reports state, not history: NEEDS_ATTENTION can mean "never submitted" or
  "reviewed and rejected". Don't act on a rejection theory until the Console's issue list has
  been read.

## Content: legal sources only (non-negotiable)
- Whisco plays video from three sources only: official rights-holder YouTube channels
  (embedded in YouTube's player), Internet Archive public-domain items, and free-to-air streams
  that broadcasters put on the open internet. Whisco hosts no video files.
- Never add an episode from an unofficial upload. If the official channel lacks an episode,
  the list skips it.
- Excluded forever (sanctions and politics): Al Manar, Al Mayadeen, Press TV, IRIB, Al Alam,
  Rojava/Ronahi/Welat, Al Wilayah.
- Featured surfaces stay modern and recognisable. Old or black-and-white titles are not
  featured (the founder's call).
- `prisma/*.json` are the seed and disaster-recovery source of truth (`prisma/seed.ts`,
  `scripts/restore_from_backup.mjs`). Never move them out of the repo.

## Geo availability (see WHISCO_TV_GEO_EXPOSURE_FINDING.md)
- A YouTube watch page carries `availableCountries` only when the video is NOT playable from
  where the request comes from. No list means "playable here" and says nothing about the Gulf.
  A missing list is never evidence.
- Restore a hidden title only on positive evidence: a list that exists and contains a GCC
  country. A blocked reading gets `geo`. An unreadable one gets `unknown`, and the title stays
  hidden. Fail closed.
- Geo restriction is per video: a channel's verdict does not clear its titles. Availability
  drifts, so keep re-checking.
- The production sweep runs from the US. It is a regression guard, not a detector of
  Gulf-only blocks.
- YouTube rate-limits the watch page (HTTP 429 after a few hundred rapid fetches from one IP).
  oEmbed tolerates volume but only reflects global availability, so it is never a geo check on
  its own. Unauthenticated InnerTube region parameters were tested and don't work.
- For a series, video IDs live on the episodes (`streamUrl` is null on the title). Resolve them
  from episodes.
- Invariant: zero active titles with `lastStatus = geo`. Report the `lastStatus` split and
  whether it moved. A KPI that cannot fail is not a KPI.

## Architecture guardrails
- All catalogue reads go through `unstable_cache` in `src/lib/cached.ts`. Personalisation is
  never cached, and crons call `revalidatePath` after writes. This keeps the Neon and Vercel
  bills predictable, so don't bypass it.
- Cron routes (`src/app/api/cron/*`) authenticate with `Authorization: Bearer <CRON_SECRET>`.
  GitHub Actions is the scheduler backbone; Vercel runs only the two crons in `vercel.json`.
- Cron routes batch their database writes and finish inside their `maxDuration`.
- Live HLS checks are two-hop: a master playlist that responds can still front a stale media
  playlist.
- The service worker (`public/sw.js`) never intercepts video.
- Don't commit a new binary over 1 MB without weighing the clone cost. `design-drop/` is design
  source, not production `/public`.

## Brand, voice and design
- Two voices (`docs/business/Whisco_TV_Voice_Doctrine.md`):
  - **Whisco TV**, the company: professional, warm and precise. Cites floors and dated facts
    only.
  - **Whisco**, the dog: quirky and brief. Never cites numbers, and the dog's lines are always
    visibly marked as the dog's.
- At most two "free" claims per page. Never stack synonyms ("100% free, no subscription, no
  credit card…").
- Public numbers are floors (600+, 16,000+), not exact counts.
- Dark only: no light theme (`docs/business/Whisco_TV_Design_System.md` §6). Keep it minimal
  and uncluttered, with no boxed or stamped-on visuals.
- The mascot gets one greeting, then stays quiet. It never appears on title posters, store
  catalogue shots, ads or legal pages.
- Arabic spelling of Whisco: ويسكو, typed with the Arabic kaf ك, never the Persian keheh ک.
- The footer shows About · Contact Us · Privacy · Terms. Never reintroduce demo or "sample
  content" wording.
- Design pipeline: Grok designs → the agent verifies → Ali previews → the agent ships.

## Numbers and money (docs/business/Whisco_TV_Operating_Rules_v2.md)
- Measured beats estimated: tag estimates `[EST]`.
- Planning assumptions:
  - Projected monthly active users = 0 until both apps are public and AdSense is live.
  - Display RPM planning band: $1–3.
  - Video and sponsor revenue = $0 until signed or proven.
- Reporting separates own-player hours from embed counts. Catalogue size is an operations
  metric, not traction.
- Four gates: G1 AdSense paying; G2 both apps publicly installable; G3 a signed licence with
  files playing in our player; G4 company registered (commercial registration issued, bank
  account open). Spending scales with open gates, not with available budget.
- Never fund paid traffic before G1, content minimum guarantees, or pop-under or
  incentivised-install networks.

## Secrets and accounts
- Never commit, print or paste a secret value: not in code, docs, commit messages, pull
  requests, Issues or chat. Refer to secrets by name only.
- `.env` is gitignored. Production values live in Vercel environment variables and GitHub
  Actions secrets.
- No secrets in bot chats.
- Posts in third-party communities are made by a human. Agents and bots prepare them, and bots
  publish only on Whisco's own channels, after approval.
- If a secret turns up in the repo, rotate it first and then remove it. Git history keeps the
  old value, so removal alone protects nothing.

## Honesty
- Report what was measured, how and when, and say what wasn't checked. Correct your own
  earlier claims on the record.
- Recorded state goes stale (the handover is a dated log). Re-measure before acting on it.

## Further reading
- `docs/ops/ADSENSE_RECOVERY.md`: the AdSense gate and the guide merge map
- `WHISCO_TV_PROJECT_HANDOVER.md`: history and incident log (a dated status log)
- `WHISCO_TV_DISASTER_RECOVERY.md` and `WHISCO_TV_GEO_EXPOSURE_FINDING.md`
- `docs/business/`: Operating Rules v2, Voice Doctrine, Design System, Bot Team Charter
