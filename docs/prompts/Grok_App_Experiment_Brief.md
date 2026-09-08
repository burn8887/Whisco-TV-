# PROJECT MATERIAL — "WHISCO TV" NATIVE APP EXPERIMENT
*Upload this file to the Grok project as background material. The build prompt is separate.*

## What Whisco TV is (the short version — deliberately short)

Whisco TV is a 100% free, ad-supported streaming service for expatriates living in the Gulf (GCC) — and anyone who wants TV from home without paying or pirating. Live TV channels plus on-demand movies and series, in English and the languages of the region's largest expatriate communities. No subscriptions ever. No signup required to watch.

The brand is named after the founder's real Shih Tzu, **Whisco**. He is the mascot and the soul of the product: friendly, loyal, fast, zero pretension. Brand palette: very dark background (#0a0a0f), with orange (#f97316) → pink (#db2777) gradient accents. Tagline: *"Life's better at full speed — and full free."* How you use the dog, the palette, and the personality is up to you.

## Hard rails (non-negotiable, everything else is yours)

1. **Legality is absolute.** "Premium content" means the most premium experience achievable from LEGAL sources: free-to-air broadcasts, official broadcaster channels and embeds, public domain, and licensed/revenue-share catalogs. No pirated streams, no grey-area IPTV playlists, no geo-unblocking of paid services. If a content idea requires stolen signal, it's out — design around it, or propose the legal licensing path that would make it real.
2. **Free forever.** No subscription tiers, no paywalls. Monetization = advertising and/or sponsorship — but ad experience must stay premium (competitors' #1 user complaint in this region is ad overload on "free" apps; don't repeat their mistake).
3. **Audience:** English-language content + the **five largest expatriate communities in the GCC by population** (research which they are yourself; don't guess — derive them) — plus anything you find serves the broader expat market.
4. **Both platforms fully native**: iOS in Swift/SwiftUI, Android in Kotlin/Jetpack Compose. Phone + tablet. TV platforms optional bonus.

## What must exist (the floor, not the ceiling)

- Live TV channels (with a way to browse by language/community)
- On-demand movies and series (VOD)
- Whatever else YOU decide belongs in a great version of this product

## Optional real data

A public read-only API exists if you want to prototype against real catalog data (600+ live channels, 15,000+ titles, 13 languages):
- `https://www.whisco.tv/api/mobile/v1/home` — home shelves
- `https://www.whisco.tv/api/mobile/v1/live` — live channels
- `https://www.whisco.tv/api/mobile/v1/vod` — VOD shelves
- `https://www.whisco.tv/api/mobile/v1/title/{slug}` — title detail with seasons/episodes
- `https://www.whisco.tv/api/mobile/v1/channel/{id}` — channel detail
You may also mock your own data model if you think a different shape is better — and say why.

## What we want back (deliverables)

1. **Product design document** — your app concept: navigation, screens, features, and the reasoning. Where you diverged from a "standard streaming app," explain why.
2. **Full native codebases** — iOS (Swift/SwiftUI) and Android (Kotlin/Compose), buildable project structure, as complete as you can make them.
3. **Monetization concept** — how this app makes money without violating the rails. New income ideas beyond display/video ads are explicitly welcome.
4. **Feature ideas we probably haven't thought of** — flag your 3 boldest ideas separately.
5. **A critique section** — after designing yours, look at whisco.tv's current web experience and tell us bluntly: what would you keep, change, or kill in our existing product?

## What we are testing (be aware, then ignore this)

This is a clean-room experiment. We already have apps in store review. We want to see what a fresh mind builds with the same brand and constraints — different navigation, different features, different revenue ideas. Don't try to guess what we built. Build what YOU believe is right.
