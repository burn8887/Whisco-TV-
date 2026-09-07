# Whisco Android (Compose)

**minSdk 24 (Android 7.0)** — the labour-camp / cheap-phone floor in the GCC. Compose and Media3 both support 24. targetSdk 35. Bundle `tv.whisco.app`.

Open `native/android` in Android Studio (Koala / Ladybug or newer). JDK 17. Sync Gradle. The wrapper properties pin Gradle 8.9; Android Studio will fetch the distribution.

## What is in the project

Tonight (Home Time, mosaic, news, sports, continue, pins), Live (face languages + categories + mosaic/list), Library (hubs + kids cartoons), You (faces, kids, clock, reset), Search (debounced + recents), title + episodes, live zapper, official YouTube embeds, legal Jadoo room code.

Kotlin sources: `app/src/main/java/tv/whisco/app/`. Adaptive icon + Whisco portraits in `res/`. ProGuard keep rules for release. Backup disabled (device-local faces).

## Playback / ToS

- Live HLS → Media3 ExoPlayer (`media3-exoplayer-hls`). No CORS.
- VOD YouTube → WebView of `youtube-nocookie.com/embed`. No InnerTube, no stream extraction, no wrapping ads.
- Licensed own-player later → same ExoPlayer, one skippable 15s pre-roll.

## Persistence

Jetpack DataStore (`whisco` prefs): faces, country, watchlist, pins, resume, recents. Privacy: **Data Not Collected**.

## Android TV

Same Compose graph. Leanback launcher category is declared but not required. Mosaic tiles are clickable; d-pad focus is additive. Media3 `PlayerView` handles HDMI.
