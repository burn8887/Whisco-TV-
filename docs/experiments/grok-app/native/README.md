# Native clients

This folder is the clean-room iOS and Android specification that matches the playable web preview.

- `ios/WhiscoTV` — SwiftUI, iOS 17+, AVPlayer for HLS, WKWebView for official YouTube embeds
- `android` — Kotlin + Jetpack Compose, minSdk 24, Media3 ExoPlayer for HLS, YouTube IFrame for official embeds

Neither client scrapes YouTube. Neither includes an analytics SDK. Persistence is on-device (UserDefaults / DataStore). No accounts.

API: `https://www.whisco.tv/api/mobile/v1/{home,live,vod,title/{slug},channel/{id}}`
