# GROK PROMPTS — APPLE REJECTION (5.2.2 + 2.5.4)
Issued 2026-09-15. Paste **Prompt 1 first**. Do not skip to the others before Prompt 1 has replied — if the diagnosis is wrong, Prompts 2 and 3 build on sand.

Context files Grok should be given alongside each prompt: `Apple_Rejection_Diagnosis_and_Fix_Plan.md`, `AdSense_LowValueContent_Fix_Plan.md`, `Filmhub_Call_Prep.md`.

---

## PROMPT 1 — INDEPENDENT VERIFICATION (red-team the diagnosis)

> **You are an independent reviewer. Your job is to BREAK my conclusion, not agree with it.**
>
> Our iOS app (Whisco TV, `tv.whisco.app`) was rejected by App Review on 2026-09-15 for two guidelines. My diagnosis and fix plan follow. I want you to attack it.
>
> **Apple's exact words:**
>
> *Guideline 5.2.2 — Legal — Intellectual Property — Third Party Sites/Services:* "The app contains various copyrighted movies or TV shows. The use of third-party copyrighted materials requires documented evidence of your right to use such content in the app." Next steps: attach documentary evidence in App Review Information, OR remove the third-party content from the app and its metadata.
>
> *Guideline 2.5.4 — Performance — Software Requirements:* "The app declares support for audio in the UIBackgroundModes key in the Info.plist, but we are unable to play any audible content when the app is running in the background." Next steps: reply with a screen recording showing persistent background audio on a physical device, OR remove the "audio" setting.
>
> **What the app is:** a native SwiftUI streaming app. Live TV channels play as direct HLS in `AVPlayerViewController`. On-demand films and series play as YouTube iframe embeds in a `WKWebView` (youtube-nocookie). Public-domain films play from archive.org. The app hosts no media files, has no download/save/convert function, and extracts no streams.
>
> **What we measured in our own catalogue (16,841 active titles):**
> - YouTube embeds: 14,728 (87.5%)
> - archive.org: 1,724 (10.2%)
> - no stream URL at all: 389 (2.3%)
> - Live channels: 606 direct HLS, 7 YouTube
> - We store **no** provenance field — no channel ID, no official-status flag, no licence record. We literally cannot prove any title's source is official.
>
> **What we already did that FAILED:** we attached a document called "Whisco TV — Content Rights Statement" to App Review Information before the previous submission, and it described three sources: (1) official YouTube iframe embeds of owner-enabled videos, (2) public-domain works from archive.org, (3) "free-to-air streams published on originating-broadcaster infrastructure". Apple read it and STILL asked for documented evidence.
>
> **My diagnosis:**
> 1. The statement failed because claim (3) is legally weak — a broadcaster publishing its own stream is not a licence for us to redistribute it — and because we asserted official channels without per-title proof.
> 2. The fix is not a better-worded PDF. It is to make the claim true per title: build a provenance register, and narrow the app to only content we can evidence, leaving the website untouched because Apple governs the app, not the site.
> 3. For 2.5.4, remove the `audio` key rather than produce a recording, because background audio via WKWebView is unreliable and the reviewer tested on an iPad.
>
> **Your task — answer each, and be blunt:**
> 1. Is diagnosis 1 correct? What else could have made Apple reject the statement we attached? What do experienced iOS publishers report about how far App Review takes 5.2.2 for apps that embed YouTube rather than host content — does the iframe/embed mechanism ever satisfy a reviewer on its own, or is it routinely rejected?
> 2. Is the "narrow the app, keep the website" strategy sound, or does App Review look at the website too when assessing the app's content? Does a materially reduced app catalogue create a different problem (e.g. a 4.3 spam/thin-app or "app is a subset of a website" concern)?
> 3. For a catalogue of public-domain works, what exactly does Apple accept as proof of public-domain status? Be specific about the document.
> 4. For live free-to-air channels, what is the accepted standard? Give real examples of apps carrying FTA live TV that passed review and what they documented. Is per-channel written permission from the broadcaster the only route, or is there an accepted permissive class (public broadcasters, embed programmes)?
> 5. Is removing the `audio` key from UIBackgroundModes genuinely sufficient to close 2.5.4, or does App Review expect a reply in addition to the change?
> 6. What have I missed? What is the single most likely reason we get rejected a THIRD time after executing this plan?
>
> **Rules:** no invented facts. If you do not know, say "NOT VERIFIED" rather than guessing. Cite sources or precedent where you can, and label anything that is your own estimate as [EST]. Do not reassure me — I would rather hear the lower band.

---

## PROMPT 2 — DESIGN THE EVIDENCE ARTIFACTS (the register + the statement)

> **Design the two documents that get us through Guideline 5.2.2. Start only after Prompt 1's findings are in hand.**
>
> **Situation:** our iOS app was rejected under 5.2.2 for third-party copyrighted content. We have 16,841 on-demand titles; 87.5% are YouTube iframe embeds, 10.2% are archive.org, and 2.3% have no stream at all. We have no provenance data stored. We already attached one rights statement and it was rejected as insufficient. We cannot afford licences. Our strategy is to narrow the app to content we can prove, and leave the website alone.
>
> **Deliverable 1 — the provenance register (a data model).**
> Design the schema we need so that every title in the app carries a provable rights basis. For each field, state: the field name, what it holds, where the value comes from, and how a reviewer could independently check it. It must cover at minimum:
> - content mechanism (YouTube embed / archive.org / direct HLS / other)
> - the source URL a reviewer can open and see for themselves
> - the source channel ID and title, and the evidence that this channel is the official rights holder
> - for YouTube: the `embeddable` status and `license` value as returned by the YouTube Data API, and which API call returns them
> - for public domain: the determination basis, the authority for it, and the URL that evidences it
> - a `clearedForApp` boolean with an audit trail (who cleared it, when, on what evidence)
> Output it as Prisma schema fields, plus the backfill algorithm in plain steps.
>
> **Deliverable 2 — Content Rights Statement v2.**
> Write the full text of the replacement document to attach to App Review Information. Requirements:
> - Lead with the **mechanism** (we host nothing, download nothing, extract nothing, circumvent nothing). Make the negative statements explicit and unambiguous.
> - Then a **per-source evidence section** the reviewer can spot-check themselves, with real URLs.
> - Every claim must be **verifiable by the reviewer** — that is the whole point. Do not persuade; make it checkable.
> - Include a **scoped commitment**: state exactly what we will remove, and how fast, if they flag anything.
> - Do not overclaim. If a class of content is not fully evidenced, say so and say what we did about it rather than papering over it.
> - Plain English. A reviewer has minutes, not hours. Aim for under two pages.
> - Never name sanctioned entities. Public copy uses floors only.
>
> **Deliverable 3 — a decision table for the live FTA channels.**
> We carry 606 direct HLS channels. For a streaming app, sort them into: (a) broadcasters whose own published terms permit direct playback or embedding, (b) public broadcasters where a permission request is realistic and worth making, (c) everything else — which comes out of the app. Name the specific broadcasters you would keep and why, and mark anything you are unsure about as NOT VERIFIED. Do not guess.
>
> **Rules:** legal only. Do not propose anything that depends on us hoping nobody checks. If a category cannot be evidenced, the answer is that it comes out of the app. Label estimates [EST].

---

## PROMPT 3 — DRAFT THE APP REVIEW REPLY AND NOTES

> **Draft the exact text we will use to respond to App Review. Use Prompt 1's findings and Prompt 2's deliverables.**
>
> **Context:** second rejection of version 1.0 (build 5), guideline 5.2.2 (third-party copyrighted content, needs documented evidence or removal) and 2.5.4 (`audio` in UIBackgroundModes declared but no background audio). We are fixing both and resubmitting as build 6.
>
> **Deliverable 1 — the App Review Information "Notes" field.** This is what the reviewer reads first. It must: say in one sentence what the app is and what it is not; list the specific steps a reviewer can take to verify our rights position; name the evidence document we attached; and offer removal of anything they flag. Under 400 words. Written so that a reviewer who reads only this understands our position without opening the attachment.
>
> **Deliverable 2 — the Resolution Center reply.** Two parts, in this order: (a) the 2.5.4 fix, stated in one or two sentences with no hedging — what we changed, in which build; (b) the 5.2.2 response — what we changed in the catalogue, what evidence we are attaching, and what we are willing to do if anything remains a concern. The tone is respectful, specific and brief. No over-apologising, no marketing language, no defensiveness.
>
> **Deliverable 3 — a reviewer test script.** A numbered path a reviewer can follow to verify our rights position in under three minutes: open this, search this, see this. Every step must be reproducible from a US and a Gulf IP. Where a search string matters, give the exact string.
>
> **Hard constraints:**
> - No claim we cannot evidence. If our position on a content class is "we removed it", say that.
> - No invented numbers. Public figures are floors only: "600+ live channels", "16,000+ movies and shows".
> - Never name sanctioned entities.
> - Never imply we have rights we do not hold.
> - Do not promise a timeline we cannot keep. If we say 24 hours, we commit to 24 hours.
>
> **Output format:** three clearly labelled blocks, ready to paste. Flag any sentence where you think we are on thin ice, and say what you would change it to.
