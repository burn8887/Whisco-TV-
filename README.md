# Whisco TV — Free Ad-Supported (FAST) TV Platform

A full-stack, 100% free, ad-supported live TV + on-demand streaming
platform: no subscriptions, no plans, no billing. Built with Next.js,
Prisma, and NextAuth.

## What's included

**Customer app**
- Marketing homepage, signup/login (accounts are optional — only needed for
  personalization; browsing and watching require no account at all)
- `/browse` — home: hero banner, continue watching (if signed in), trending,
  new releases, genre rows, popular live channels
- `/live` — live TV guide with country/category/search filters — **518 real,
  verified, free-to-air broadcast channels across 30+ countries**, allocated
  proportionally to GCC expatriate community population share (Indian
  languages, Arabic, Bengali, Urdu, Filipino, Nepali, Sinhala/Tamil, Farsi,
  Indonesian, Vietnamese, and more — see "Channel allocation" below)
- `/live/[id]` — channel player page (no gating — every channel is free)
- `/vod` — on-demand library (movies/series/documentaries) with filters
  (1,760 titles — 1,736 real classic films/documentaries plus 24 curated
  demo titles with full seasons/episodes)
- `/title/[slug]` — detail page, episode list, "Add to My List"
- `/watch/movie/[id]` and `/watch/episode/[id]` — HLS/MP4 player with resume
  position tracking
- `/watchlist`, `/profiles` (multi-profile + kids profile), `/account`

**Admin console** (`/admin`, requires an ADMIN account)
- Dashboard with key metrics (channels, titles, users, categories), plus
  live status of the daily channel health check
- Full CRUD for Channels and VOD Titles (incl. seasons/episodes for
  series), and user management

**Daily channel maintenance** (`src/app/api/cron/check-channels/route.ts`,
scheduled via `vercel.json`)
- Runs automatically once a day (Vercel Cron) and checks every live
  channel's stream URL
- Channels that fail 2 consecutive daily checks are automatically hidden
  from viewers (`isActive=false`) — no dead links in the public directory
- Channels that recover are automatically restored
- View current status anytime at `/admin/channels` (filter by
  active/offline) or the dashboard health banner
- Protected by a `CRON_SECRET` — set the same value in both your `.env`
  and your Vercel project's environment variables

## Demo logins

- Viewer: `demo@whiscotv.demo` / `Demo123!`
- Admin: `admin@whiscotv.demo` / `Admin123!`
- Or just visit `/browse` directly — no account needed to watch anything.

## ⚠️ Important — content sourcing & monetization

**Live channels** (`prisma/live_channels.json`, loaded by `prisma/seed.ts`):
every one of the 518 channels is a **real, currently-live, free-to-air
public broadcast stream** — verified reachable at seed time. Sources:
- A handful of directly-confirmed official broadcaster endpoints (DW,
  France 24, Sky News Arabia, TRT World, CBS News, Bloomberg TV).
- The majority via [iptv-org](https://github.com/iptv-org/iptv), a
  long-running, community-maintained registry that specifically screens
  for free/publicly-available streams (used by mainstream FOSS media
  software like Jellyfin, Kodi, and Plex plugins).
- 7 official YouTube-live embeds (Somoy TV, Ekattor TV, Jamuna TV, Channel i
  for Bangladesh; GMA News, UNTV, PTV Sports for the Philippines) — used for
  major state/public broadcasters that publish their 24/7 signal via
  YouTube Live rather than a direct public HLS endpoint. Embedding via
  YouTube's own iframe player is standard, fully legal use of YouTube's
  public embed API, and keeps the broadcaster's own monetization intact
  (see `VideoPlayer.tsx` — it auto-detects `youtube.com/embed` URLs).

### Channel allocation methodology

Channel counts per language/community are allocated proportionally to each
group's estimated share of the ~35 million-strong GCC expatriate
population (GLMM data), per the demographic breakdown supplied for this
project — with India further sub-divided into regional languages
(Malayalam, Tamil, Telugu, Punjabi, Bengali, Hindi) rather than treated as
a single Hindi bloc, since South Indian communities make up a large share
of Indian expats in the Gulf.

| Community / language | Target (demographic guide) | Actual seeded |
|---|---|---|
| India — Hindi/National | — | 91 |
| India — Telugu | — | 20 |
| India — Malayalam | 45 | 11 (real-source ceiling) |
| India — Tamil | 25 | 10 (real-source ceiling) |
| India — Punjabi | — | 10 |
| India — Bengali | 20 (shared w/ Punjabi) | ~10 |
| Pakistan (Urdu) | 70 | 39 |
| Bangladesh (Bengali) | 71 | 20 (incl. 4 official YouTube-live embeds) |
| Arabic expat (Egypt/Jordan/Lebanon/Syria/Palestine/Yemen/Sudan) | 117 | 64 |
| GCC local Arabic (UAE/Saudi/Qatar/Kuwait/Bahrain/Oman) | (additional) | 56 |
| Philippines (Tagalog) | 31 | 9 (real-source ceiling; incl. 3 official YouTube-live embeds) |
| Nepal | 17 | 7 |
| Sri Lanka (Sinhala/Tamil) | 9 | 7 |
| Iran (Farsi) | 9 | 10 |
| Indonesia | 6 | 39 (surplus pool, see note) |
| Vietnam (Other Languages bucket) | 34 (shared) | 40 |
| African (Nigeria/Kenya/S.Africa/Ghana/Ethiopia — Other bucket) | (shared) | 35 |
| English/International | 6 | 77 (kept — doubles as general/news quality bar) |
| **Total** | **500** | **518** |

**Where the actual count falls short of the guide's target, it's a real
availability ceiling from free/public sources right now** — e.g. most
mainstream Malayalam/Tamil/Filipino entertainment channels are commercially
licensed and not available through free/public aggregation; Bangladesh's
free-source URLs currently have heavy link rot (many return 404). Where it
exceeds the target (Indonesia, Vietnam), it's because a healthy free pool
existed and was used to help reach the 500+ total. A few politically
sensitive broadcasters (Iranian and Syrian state media brands, and
Kurdish-militant-affiliated channels) were deliberately excluded regardless
of availability. Treat this table as a snapshot, not a permanent target —
rerun sourcing periodically to close these gaps as more free content
becomes available, or close them immediately via a licensed FAST deal.

This gets you real scale fast, but **treat it as a strong starting
lineup, not a finished legal/commercial deal**: public stream URLs can move
or go offline, and a few may be geo-restricted for some viewers. Before a
real commercial launch:
- Re-verify the list periodically (URLs in `prisma/live_channels.json`
  do drift — the built-in daily health check at `/api/cron/check-channels`
  handles this automatically; see below).
- For guaranteed uptime and a much larger catalog, graduate to a **FAST
  aggregator partnership** (e.g. Amagi, Cinedigm/Cineverse, Zone.tv) —
  this is how legitimate large FAST platforms (Pluto TV, Plex, Samsung TV
  Plus) reach hundreds of channels: licensed, ad-revenue-share deals
  instead of negotiating each channel individually.
- Monetize via **server-side ad insertion (SSAI)** on top of these
  channels once you're ready — the categories/countries were selected to
  be broad, ad-friendly, and appealing across all target GCC communities
  rather than niche.

**VOD** (`Title`/`Episode.streamUrl`): **1,736 real, freely-licensed titles** (1,035
movies + 701 documentaries, plus classic cartoons and TV episodes filed as
movies) sourced from the [Internet Archive](https://archive.org)
(`prisma/vod_titles.json`, generated from `archive.org`'s public API).
To keep legal risk low, sourcing was deliberately restricted to
well-established public-domain categories rather than Archive.org's
broader, loosely-moderated community collections:
- US government works (NASA — automatically public domain under 17 U.S.C. § 105)
- The Prelinger Archives (ephemeral/educational/industrial films explicitly
  donated to the public domain)
- Pre-1964 feature films, cartoons, and TV episodes — the era before
  copyright renewal became automatic, when a large share of titles lapsed
  into the public domain through non-renewal (a widely used, standard
  heuristic in the public-domain film community; several imported titles'
  own descriptions explicitly document their public-domain registration
  status, e.g. *Jail Bait* (1954))

**This is a strong starting library, not a substitute for periodic
review**: Archive.org is a community-uploaded platform, and while the
above categories are the most defensible for public-domain status,
individual titles can still occasionally be subject to takedown notices.
Treat `prisma/vod_titles.json` the same way as `prisma/live_channels.json`
— worth periodically re-verifying, and worth removing/replacing any
specific title that receives a legitimate rights complaint. For guaranteed
clearance and modern titles, graduate to a licensed VOD syndication deal
(Filmhub, Cinedigm/Cineverse, Under the Milky Way, or similar).

**No payments anywhere** — this app has no subscription/billing code by
design. If you ever add a paid premium tier, it would be a new addition,
not a restoration of removed functionality.

## Tech stack

- Next.js 16 (App Router, Server Actions) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (any provider — Neon, Vercel Postgres, Supabase, RDS, etc.)
- NextAuth (Auth.js v5) with credentials auth (JWT sessions) — optional,
  personalization-only
- hls.js for adaptive live-stream playback in the browser

## Local development

```bash
cp .env.example .env   # set DATABASE_URL to your Postgres connection string
npm install
npx prisma db push     # creates all tables in your database
npm run db:seed        # seeds 225 live channels + VOD catalog + demo users
npm run dev
```

## Deploying (Vercel + Neon, free)

See [`DEPLOY.md`](./DEPLOY.md) for a full step-by-step walkthrough —
create a free Neon Postgres database, push this code to GitHub, and
import it into Vercel to get a permanent public URL.

## Re-seeding / editing catalog data

- Live channels: edit `prisma/live_channels.json` directly (add/remove/
  replace entries — each needs `name`, `country`, `countryCode`,
  `language`, `category`, `streamUrl`, optional `isFeatured`).
- VOD: edit the curated + programmatic sections in `prisma/seed.ts`.
- Re-run `npm run db:seed` to apply. It wipes and recreates all
  channels/titles/users, so don't run it against a live production
  database with real user data you want to keep.
