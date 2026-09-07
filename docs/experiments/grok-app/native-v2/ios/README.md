# Whisco iOS (SwiftUI)

**Minimum iOS 17.** Observation, NavigationStack, TabView + tabItem, AVPlayerViewController. Covers iPhone 11-class hardware still common in GCC labour housing.

Bundle `tv.whisco.app`. Open `WhiscoTV/WhiscoTV.xcodeproj` in Xcode 15.4+.

## What is in the project

Tonight, Live (mosaic + language/category chips), Library (language hubs), You (faces, kids, clock, pins), Search, title detail, live zapper (Ch+/−), AirPlay, official YouTube embeds, legal Jadoo room code.

Sources live in `WhiscoTV/WhiscoTV/`. Assets include AppIcon, WhiscoPortrait, WhiscoSit, LaunchBackground. PrivacyInfo.xcprivacy declares UserDefaults CA92.1 and Data Not Collected.

## Playback / ToS

- Live HLS → `AVPlayer`. No CORS (unlike the web preview).
- VOD that is an official YouTube embed → `WKWebView` loading `youtube-nocookie.com/embed/…`. We do **not** extract audio/video streams, use InnerTube, or wrap the embed with our own ads.
- Future Filmhub / own-player licensed HLS → same AVPlayer path, **one** skippable 15s pre-roll, never stacked.

## Privacy

UserDefaults only (faces, country, watchlist, pins, resume). Privacy Nutrition Label: **Data Not Collected**. No analytics SDK.

## Tablet / TV

Same tabs on iPad. tvOS is a later reuse of `HLSPlayer` + focusable mosaic — not in v1.
