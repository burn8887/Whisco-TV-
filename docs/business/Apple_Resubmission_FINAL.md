# APPLE RESUBMISSION — FINAL (11 Sep 2026, post-Grok cross-check)

## STATUS: everything the API can do is ALREADY DONE. Two browser steps remain.

### Done via API today (verified):
| Surface | State |
|---|---|
| App name | `Whisco TV: Live TV & Movies` ✅ (was already saved) |
| Subtitle | `Live channels, movies & series` ✅ (no price words) |
| Promotional text | **Rewritten per Grok** — "No subscription, no signup" REMOVED. Now: "Live TV and thousands of movies & shows — Turkish series, Bollywood, Pakistani dramas, Arabic series, Filipino hits and more. Open the app and press play." ✅ |
| Keywords | `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi` ✅ (no "free") |
| Description | Untouched (price info allowed there per Apple's own rejection text) ✅ |
| What's New | Empty (first version) ✅ |
| App previews (video) | None exist ✅ |
| Screenshots | **"100% Free" pill REMOVED.** The 2 About-page screenshots (full of "100% free / no credit card / no catch" text) were DELETED outright. The 3 pill-header shots per device were masked and re-uploaded. Both sets now have 4 clean screenshots each, reordered: Live TV → On Demand → DW player → My List. All COMPLETE. ✅ |
| Evidence PDF | **Rebuilt to v2 per Grok's audit** and attached (old one deleted). Now contains: YouTube ToS verbatim quotes ("embeddable YouTube player" + "only as enabled by a feature of the Service (such as video playback or embeds)"), a 6-row verified exhibit schedule with oEmbed author captures (Kuruluş Osman official, Goldmines ×2, HAR PAL GEO, ABS-CBN, Matinee Now), 4 archive.org items with per-item publicdomain licence URLs, 4 FTA channels with broadcaster-domain origins (trt.com.tr, france24.com, alarabiya.net, DW), the honest-limitation sentence ("we do not hold separately signed licences… hide within hours of notice"), and a 3-step reviewer path. Counts demoted from headline to context. ✅ |
| App Review Notes | Rewritten to Grok's short format with the reviewer tap-path and geo note ✅ |

### Grok recommendations NOT adopted (with reason):
- **Screen recording attachment** — no iOS device in this environment to record from; the reviewer path + oEmbed exhibits substitute. If Apple bounces again, record one on your phone (60–90s: Live→DW, On Demand→Kuruluş Osman showing YouTube chrome, On Demand→His Girl Friday) and attach it.
- Everything else was adopted.

---

## YOUR TWO STEPS (browser, ~5 minutes)

### STEP 1 — Send the Resolution Center reply
App Store Connect → Apps → Whisco TV → App Review (left sidebar) → the thread from Apple → **Reply**. Paste EXACTLY:

```
Hello App Review,

Thank you for reviewing Whisco TV, version 1.0 (5).

Guideline 2.3.7
We removed price references from metadata:
• App name is now "Whisco TV: Live TV & Movies"
• Promotional text and keywords no longer include "free," pricing, or subscription language
• Screenshots have been replaced so they no longer show a "Free" badge
Pricing language remains only in the app description.

Guideline 5.2.3
A Content Sourcing & Rights Statement is attached under App Review Information.

The app does not host third-party media files and has no download, save, or convert function. Playback is limited to:
• official YouTube IFrame embeds of videos whose owners have enabled embedding
• public-domain / open-licence works from archive.org (item pages cited in the statement)
• free-to-air streams published on originating-broadcaster infrastructure

The statement includes YouTube Terms of Service excerpts, a representative source schedule with verified official channels, per-item archive.org licence pages, and broadcaster-domain stream origins.

Reviewer path (no account):
1. Live TV → DW English or TRT World
2. On Demand → search "Kurulus Osman" → any episode (YouTube's player and branding visible)
3. On Demand → search "His Girl Friday" (public domain, Internet Archive)

We will hide any specific title or source you flag while we review it. Rights contact: legal@whisco.tv.

Happy to provide further documents on any named source.

Ali Albaharna
Whisco TV — legal@whisco.tv
```

### STEP 2 — Resubmit
Same App Review page → **Resubmit to App Review** (same build 1.0 (5), no new binary). Confirm.

Then tell me "sent" and I'll verify the state flipped to WAITING_FOR_REVIEW via the API.

---

## If Apple returns with more 5.2.3 questions
Paste the message here verbatim. The ladder (from Grok + war room):
1. Named title/channel flagged → I hide it in production within the hour, you reply confirming.
2. "Written authorization from each broadcaster" → we shrink the review-visible catalog (PD + DW/TRT/France24 FTA + a small set of unmistakably-official embeds) via a server-side flag — product change, ~1 day, no new binary needed since content is server-driven.
3. Only after a second 5.2.3 bounce: request the call.

## Honest expectations [per Grok, EST]
- 2.3.7: should clear — every surface is now scrubbed and verified by API.
- 5.2.3 with the strengthened pack: low-to-medium first-pass. If they bounce, the shrink path exists and is fast.
