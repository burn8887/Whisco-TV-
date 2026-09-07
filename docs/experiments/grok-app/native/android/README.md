# Whisco Android (Compose)

**minSdk 24 (Android 7.0)** — the labour-camp / cheap-phone floor in the GCC. Compose and Media3 both support 24. targetSdk 35.

## Open in Android Studio

Open `native/android`. Sync Gradle. Missing: launcher mipmaps and `Theme.Whisco` in `res/values/themes.xml` (empty Material3 day/night is enough).

```xml
<style name="Theme.Whisco" parent="android:Theme.Material.NoActionBar">
    <item name="android:statusBarColor">#0a0a0f</item>
    <item name="android:navigationBarColor">#0a0a0f</item>
</style>
```

Add `kotlinx-serialization` plugin if the JSON annotations fail to resolve: `id("org.jetbrains.kotlin.plugin.serialization")`.

## Playback / ToS

- Live HLS → Media3 ExoPlayer (`media3-exoplayer-hls`). No CORS.
- VOD YouTube → WebView of `youtube-nocookie.com/embed`. No InnerTube, no stream extraction, no wrapping ads.
- Licensed own-player later → same ExoPlayer, one skippable 15s pre-roll.

## Persistence

Jetpack DataStore (wired in the product spec; this sample keeps faces in memory for brevity — swap `FaceStore` onto DataStore before store submission). Privacy: **Data Not Collected**.

## Android TV

Same Compose graph. Make mosaic tiles `Modifier.focusable()` and keep Media3 `PlayerView`. A leanback-only rewrite is unnecessary if d-pad focus is tested on a cheap stick — that is the Jadoo replacement surface.
