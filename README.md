# Whisco TV — IPTV Subscription Platform

A full-stack IPTV subscription platform: global live TV + a large on-demand
library (movies, series, documentaries), subscription billing, multi-profile
accounts, and a complete admin console — built with Next.js, Prisma, and
NextAuth.

## What's included

**Customer app**
- Marketing homepage, pricing page, signup/login (7-day free trial on signup)
- `/browse` — personalized home: hero banner, continue watching, trending,
  new releases, genre rows, popular live channels
- `/live` — live TV guide with country/category/search filters (363 seeded
  channels across 32 countries and 8 categories)
- `/live/[id]` — channel player page with tier-gating
- `/vod` — on-demand library (movies/series/documentaries) with filters
  (164 seeded titles, several with full seasons/episodes)
- `/title/[slug]` — detail page, episode list, "Add to My List"
- `/watch/movie/[id]` and `/watch/episode/[id]` — HLS/MP4 player with resume
  position tracking
- `/watchlist`, `/profiles` (multi-profile + kids profile), `/account`
  (plan, billing history, upgrade/downgrade/cancel)

**Admin console** (`/admin`, requires an ADMIN account)
- Dashboard with key metrics (channels, titles, users, active subs, revenue)
- Full CRUD for Channels, VOD Titles (incl. seasons/episodes for series),
  Subscription Plans, and Users/subscription status

## Demo logins

- Viewer: `demo@whiscotv.demo` / `Demo123!`
- Admin: `admin@whiscotv.demo` / `Admin123!`

## ⚠️ Important — content sourcing

This is a fully working platform shell. The seed data uses:
- **Placeholder channel logos / posters / stills**: generated inline SVGs
  (no external image hosting needed).
- **Placeholder live/VOD streams**: public, freely licensed test streams
  (Apple/Mux HLS test streams, Google's sample MP4s) so playback works
  out of the box in a real browser.

To go live you must plug in **your own licensed content**:
- Live channels: point `Channel.streamUrl` at your Xtream Codes / M3U
  provider's per-channel stream URLs (via the admin panel or by re-running
  a seed/import script against your provider's API).
- VOD: point `Title.streamUrl` / `Episode.streamUrl` at your licensed CDN
  (e.g. Mux, Bunny Stream, AWS MediaConvert output, CloudFront).
- Real payments: `src/lib/actions/billing.ts` currently mocks checkout
  (instantly marks the subscription active). Swap in Stripe/Adyen/etc.
  before launch.

## Tech stack

- Next.js 16 (App Router, Server Actions) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (any provider — Neon, Vercel Postgres, Supabase, RDS, etc.)
- NextAuth (Auth.js v5) with credentials auth (JWT sessions)
- hls.js for adaptive live-stream playback in the browser

## Local development

```bash
cp .env.example .env   # set DATABASE_URL to your Postgres connection string
npm install
npx prisma db push     # creates all tables in your database
npm run db:seed        # seeds channels, VOD catalog, plans, demo users
npm run dev
```

## Deploying (Vercel + Neon, free)

See [`DEPLOY.md`](./DEPLOY.md) for a full step-by-step walkthrough —
create a free Neon Postgres database, push this code to GitHub, and
import it into Vercel to get a permanent public URL.

## Re-seeding / editing catalog data

Edit `prisma/seed.ts` (curated "flagship" titles/channels + programmatic
bulk generation for catalog scale) and re-run `npm run db:seed`.
It wipes and recreates all channels/titles/plans/users, so don't run it
against a live production database with real user data.
