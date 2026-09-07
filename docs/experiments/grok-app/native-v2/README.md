# Native clients

Store-shaped iOS and Android apps that match the playable preview.

- `ios/WhiscoTV` — SwiftUI, iOS 17+, AVPlayer for HLS, WKWebView for official YouTube embeds. Faces, kids mode, Home Time, live mosaic, category chips, channel pins, Search, Cast (legal Jadoo), AirPlay on the player.
- `android` — Kotlin + Jetpack Compose, minSdk 24, Media3 ExoPlayer for HLS, YouTube IFrame for official embeds. DataStore faces, kids mode, mosaic, category chips, pins, hubs, resume. Same Compose graph is Android TV-adaptable (Leanback launcher optional, not required).

Neither client scrapes YouTube. Neither includes an analytics SDK. Persistence is on-device (UserDefaults / DataStore). No accounts.

API: `https://www.whisco.tv/api/mobile/v1/{home,live,vod,title/{slug},channel/{id}}`

minSdk 24 is the labour-camp phone floor (Android 7). iOS 17 still covers the cheap-phone tail in 2026.

Privacy Nutrition Labels / Play Data safety: **Data Not Collected**.
