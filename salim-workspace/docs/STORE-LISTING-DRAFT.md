# Store listing draft — Founder review required

Brand system: [BRAND-IDENTITY.md](BRAND-IDENTITY.md). Name risks: [NAME-CLEARANCE.md](NAME-CLEARANCE.md).
Nothing here is published or reserved.

## Approved store title

- Google Play: **Salim — Road Awareness**
- App Store: **Salim — Road Awareness**, subtitle **Know what's ahead.**

Approved by the Founder on 20 October 2026. Use the exact title in listings, screenshots and
promotional graphics. Verify availability and storefront character limits in each console before
finalising artwork.

## Identity and public URLs

- Permanent store bundle ID: `com.salimdrive.app` on both platforms.
- Store display name: `Salim`.
- Approved brand domain: `https://www.salimdrive.com` — **not live yet**.
- Interim privacy policy: https://docs.google.com/document/d/1gv7tD1tYx3aMiLptPBw4nXSRWDwqexy_Tk_e6WcaSHY/view
- Interim support page: https://docs.google.com/document/d/1JlPEh8gLyLd2P93smaYkhe2GuuwXpnIn6d9pH1kut5E/view

Use the interim Google Docs URLs until the approved domain is live. Do not claim that the domain is
live or replace it with another domain. Check that both interim URLs are public and readable before
submitting them to a store.

## Short description (Play, 80 characters)

Calm, direction-aware road alerts for Bahrain and the Gulf. Camera coverage varies.

## Description / TestFlight beta description — draft only

Salim provides direction-aware road-awareness prompts for cameras and mapped road hazards, without
taking over the drive. It is Bahrain-first, with a GCC-wide product goal.

Camera coverage is currently incomplete. This build has no verified bundled camera dataset. Nearby
live camera searches may use OpenStreetMap and can return incomplete or out-of-date mapped records;
those locations are not official. Salim does not claim to list every camera in Bahrain or the GCC.
Always follow posted signs and local law. Community camera reports are not active in this build because
the approved backend is not yet live.

Location is used only after you start a drive and remains on-device for alert matching. Salim does
not upload your route. Every safety warning is available without a subscription. Ads appear only on
Overview and Settings while idle in store builds; never on the active drive screen. Consent controls
ad requests where required. Optional Premium removes these ads and keeps trip history without a
product-based limit; the free tier retains the latest 20 trips. Any free trial, price and renewal
terms must be displayed by the platform before purchase.

A complete, verified GCC offline camera pack is **not included in this build**. Do not advertise that
it is included until real, properly sourced data is implemented and checked. Salim is not a
navigation or emergency service, radar detector, or guarantee of any outcome. Car-display/watch
integrations and internal navigation are not enabled.

## What to test (tester instructions, not public listing copy)

1. A debug-only simulation is available for testing without location permission; signed store builds
   exclude synthetic routes and fictional alerts.
2. Review direction-aware warnings and trip history. Community camera reporting is disabled until the live backend and privacy URL are verified; do not enter real submissions during development. Do not treat simulated alerts as driving guidance.
3. Review Settings → Privacy notice, consent/privacy-options controls, ad placement and subscription
   disclosures. Verify that ads never appear during an active drive or for Premium subscribers.
4. Verify the free trip-history limit (20), Premium history behavior, purchase restoration, trial and
   renewal disclosure, and every configured price in platform sandbox accounts.
5. Only when safely parked, test a real GPS session, permission denial, background location and
   explicit stop behavior. Do not interact with the phone while driving.

## Arabic listing draft — not approved for publication

- العنوان المقترح: **سالم — وعي بالطريق**
- الوصف القصير والطويل: يلزم إعداد نسخة عربية دقيقة تعكس أن تغطية الكاميرات محدودة وغير مكتملة،
  وأن بيانات دول الخليج غير مكتملة في هذا الإصدار.

**Do not publish Arabic copy until a native Bahraini/Gulf Arabic speaker has reviewed it.**

## Review notes and submission gates

- Native Android and iOS billing/ad integrations must pass CI on the final source before signing.
- Configure and verify `salim_premium_monthly` and `salim_premium_yearly`, including any free-trial
offers, in Google Play Console and App Store Connect. Code support alone does not create a store
product or introductory offer.
- Verify production AdMob IDs and consent behavior. Debug and web demonstrations must remain ad-free.
- Complete the real GCC camera-data work or explicitly narrow launch claims; do not imply completeness.
- Capture screenshots directly from the final signed store builds. Do not fabricate map pins, camera
  sites, testimonials or coverage claims.
- Complete platform privacy, ads, location, subscription, age-rating and review disclosures against
  actual behavior. Obtain the Founder’s separate approval before any store upload.

No account is required. Community drafts remain local and are not published. No police or patrol
detection is provided. Interim privacy/support links are listed above; the approved domain is not
live. The operating entity is Ali Sameer Sadeq Mohamed Albaharna.
