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
- `/live` — live TV guide with country/category/search filters — **225 real,
  verified, free-to-air broadcast channels across 22 countries**, curated
  for GCC local + expat audiences: Arabic (UAE, Saudi, Qatar, Kuwait,
  Bahrain, Oman, Egypt, Jordan, Lebanon), English/International, Indian
  (Hindi + regional-language), Pakistani (Urdu), Bangladeshi (Bengali),
  Filipino, and African (Nigeria, Kenya, South Africa, Ghana, Ethiopia)
- `/live/[id]` — channel player page (no gating — every channel is free)
- `/vod` — on-demand library (movies/series/documentaries) with filters
  (164 seeded titles, several with full seasons/episodes)
- `/title/[slug]` — detail page, episode list, "Add to My List"
- `/watch/movie/[id]` and `/watch/episode/[id]` — HLS/MP4 player with resume
  position tracking
- `/watchlist`, `/profiles` (multi-profile + kids profile), `/account`

**Admin console** (`/admin`, requires an ADMIN account)
- Dashboard with key metrics (channels, titles, users, categories)
- Full CRUD for Channels and VOD Titles (incl. seasons/episodes for
  series), and user management

## Demo logins

- Viewer: `demo@whiscotv.demo` / `Demo123!`
- Admin: `admin@whiscotv.demo` / `Admin123!`
- Or just visit `/browse` directly — no account needed to watch anything.

## ⚠️ Important — content sourcing & monetization

**Live channels** (`prisma/live_channels.json`, loaded by `prisma/seed.ts`):
every one of the 225 channels is a **real, currently-live, free-to-air
public broadcast stream** — verified reachable at seed time. Sources:
- A handful of directly-confirmed official broadcaster endpoints (DW,
  France 24, Sky News Arabia, TRT World, CBS News, Bloomberg TV).
- The majority via [iptv-org](https://github.com/iptv-org/iptv), a
  long-running, community-maintained registry that specifically screens
  for free/publicly-available streams (used by mainstream FOSS media
  software like Jellyfin, Kodi, and Plex plugins).

This gets you real scale fast, but **treat it as a strong starting
lineup, not a finished legal/commercial deal**: public stream URLs can move
or go offline, and a few may be geo-restricted for some viewers. Before a
real commercial launch:
- Re-verify the list periodically (URLs in `prisma/live_channels.json`
  do drift — re-run the verification approach described in your project
  history, or replace with direct broadcaster agreements).
- For guaranteed uptime and a much larger catalog, graduate to a **FAST
  aggregator partnership** (e.g. Amagi, Cinedigm/Cineverse, Zone.tv) —
  this is how legitimate large FAST platforms (Pluto TV, Plex, Samsung TV
  Plus) reach hundreds of channels: licensed, ad-revenue-share deals
  instead of negotiating each channel individually.
- Monetize via **server-side ad insertion (SSAI)** on top of these
  channels once you're ready — the categories/countries were selected to
  be broad, ad-friendly, and appealing across all target GCC communities
  rather than niche.

**VOD** (`Title`/`Episode.streamUrl`): still uses public-domain sample
videos as placeholders. Replace with a licensed VOD syndication deal
(Filmhub, Cinedigm/Cineverse, Under the Milky Way, or similar) for real
movies/series/documentaries.

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
