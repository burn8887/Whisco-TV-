# Whisco iOS (SwiftUI)

**Minimum iOS 17.** Observation, NavigationStack, Tab API, AVPlayerViewController. Covers iPhone 11-class hardware still common in GCC labour housing, without freezing the stack on iOS 16 workarounds.

## Open in Xcode

1. File → New → Project → App → SwiftUI, iOS 17, bundle `tv.whisco.app`
2. Replace generated files with the sources in `WhiscoTV/`
3. Add `AVKit` and `WebKit`

## Playback / ToS

- Live HLS → `AVPlayer`. No CORS issues (unlike the web preview).
- VOD that is an official YouTube embed → `WKWebView` loading `youtube-nocookie.com/embed/…`. We do **not** extract audio/video streams, use InnerTube, or wrap the embed with our own ads.
- Future Filmhub / own-player licensed HLS → same AVPlayer path, **one** skippable 15s pre-roll, never stacked.

## Privacy

UserDefaults only (faces, country, watchlist). Privacy Nutrition Label: **Data Not Collected**. No analytics SDK.

## Tablet

`NavigationStack` + the same tabs. A later `NavigationSplitView` for 13" iPad is additive, not a rewrite.

## TV

tvOS is a bonus: reuse `HLSPlayer` + focusable mosaic. Not in v1.
