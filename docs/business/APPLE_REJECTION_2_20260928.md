# APPLE — SECOND 5.2.2 REJECTION · 28 SEPTEMBER 2026 · DESK PACKET

**Status: STOPPED, per the standing rule.** "If 5.2.2 returns: STOP — send the letter + any screenshot to the
Desk; do not invent Option B." Nothing was replied to, resubmitted, rebuilt or edited anywhere.

---

## 1 · The verdict, verbatim

> **Guideline 5.2.2 - Legal**
> **Issue Description:** *The app contains various copyrighted movies or TV shows. The use of third-party
> copyrighted materials requires documented evidence of your right to use such content in the app **from the
> rights holder**.*
> **Next Steps:** *To resolve this issue, please attach documentary evidence in the App Review Information
> section in App Store Connect. Once we have reviewed your documentation and confirmed its validity, we will
> proceed with the review of the app. Alternatively, please remove the third-party content from the app and
> its metadata.*

Apple's lead-in: *"The issues we previously identified still need your attention."*

**Five words are new:** ***from the rights holder.*** Neither the 15 Sep nor the 21 Sep notice carried them.

| | |
|---|---|
| Review date | **28 September 2026** |
| Message time | **5:22 PM Asia/Bahrain (14:22 UTC)** |
| Version reviewed | **1.0 (7)** — the binary we resubmitted |
| Review device | iPad Air 11-inch (M3) — same device each round |
| Submission ID | `c80e30c4-5e07-4911-bb77-2ed58fd09caf` (unchanged) |
| Screenshot attached | **none this round** |
| Guidelines cited | **5.2.2 only** — 2.5.4 stays closed ✅ |

**API confirmation (read-only, today):** `appStoreState` **REJECTED** · `appVersionState` **REJECTED** ·
item **REJECTED** · submission `UNRESOLVED_ISSUES` · `WAITING_FOR_REVIEW = 0`, `IN_REVIEW = 0` ·
attachment still `Whisco_TV_Build7_5.2.2_evidence.pdf`, 32,098 B, `COMPLETE` · notes 2,999 chars.

**Elapsed:** submitted 23 Sep 12:32:39 UTC → rejected 28 Sep ~14:22 UTC = **5 d 1 h 50 m**. At 13:50 UTC
today the submission was still `WAITING_FOR_REVIEW`; it flipped to rejected within ~30 minutes of that read.

## 2 · Round-by-round

| date | binary | guidelines cited | what we gave Apple | outcome |
|---|---|---|---|---|
| 15 Sep | 1.0 (5) | 2.5.4 + 5.2.2 | (nothing) — Apple attached the 615-channel screenshot | rejected |
| 21 Sep | 1.0 (7) | 5.2.2 only | build-6 pack (wrong label) | rejected |
| 23 Sep → 28 Sep | 1.0 (7) | **5.2.2 only** | **build-7 statement + 16-row appendix + cover note + Desk letter in the RC** | **rejected again** |

Apple's own "Next Steps" — *attach documentary evidence in App Review Information* — is exactly what we did
this round, and it did not move them.

## 3 · The gap, stated plainly

The pack's evidence comes from two places: **grown by us**, and **pages published by third parties**.

| what we attached | who authored it | is it "from the rights holder"? |
|---|---|---|
| Cover note naming build 7 + the 8+8 gate | **us** | no |
| Build-7 content-rights statement (4 pp) | **us** | no |
| 16-row appendix: broadcasters' own channel URLs | **the broadcaster's page** | shows the stream is the broadcaster's — not a grant to us |
| 16-row appendix: archive.org item pages + `creativecommons.org/licenses/publicdomain/` | **the Internet Archive** | a declaration that the work is PD — not a licence issued to us |

**Nothing in the pack is a document issued by a rights holder granting us permission.** That is the new
wording, and it is the only thing that changed. This is not an evidence-volume problem; it is a
**source-of-evidence** problem.

Split by half:
- **8 live channels** — the rights holder is the **broadcaster**. Embedding is enabled by them on their own
  YouTube channel; what Apple appears to want is either the broadcaster speaking to it, or removal.
- **8 public-domain films** — there is **no rights holder to write a letter**; the publisher of the copy is
  the Internet Archive, whose item page declares PD. Apple's wording fits this half poorly.

## 4 · Options — for the Desk, not for me

| | path | cost | risk / note |
|---|---|---|---|
| **A** | Re-attach the same pack again | none | **Exhausted.** Apple has now twice answered it with the same boilerplate |
| **A′** | Same pack **plus** something with third-party provenance — e.g. a permission/attribution letter from a broadcaster, or archive.org's own written statement of the item's PD status | days of outreach, replies not guaranteed | Only A-variant that answers the new wording |
| **B** | **Remove the third-party content** — Apple's own alternative. Narrowest: drop the 8 live channels, keep the 8 PD films | loses the "live news" half; new binary + new review | **Live news is the app's front door.** Not inventable by me — Desk call |
| **B′** | Drop **all 16 rows** (both halves) | nothing third-party left to challenge | The app would ship empty — effectively a different product |
| **C** | **Ask Apple a question in the Resolution Center** — e.g. name the specific content, and state what form of evidence would satisfy them for a public-domain work | one message | Standing lock: RC letter only after a new binary is in Connect. **Needs the Desk to lift it again** |
| **D** | **App Review Board appeal** — challenge the finding itself | one submission | Slower; no guaranteed audience; typically used after evidence is rejected |
| **E** | Ship the 8 PD films **only** as a new binary while live news is parked | new binary + review | Same shape as B, different sequencing |

**What I will not do without a ruling:** reply in the RC, resubmit, build anything, edit ASC, or drop the
live set. All barred.

## 5 · About the 5.2.5 text

**Guideline 5.2.5 is NOT cited** in the rejection PDF — the only guideline in it is 5.2.2. The 5.2.5 text
was pasted into the chat separately, so **its source is unknown to me**; if the Desk sent it, its intent
isn't stated here.

Read on its own merits, 5.2.5 (Apple Products) governs apps that look confusingly like an Apple product,
reproduce Apple emoji, reuse iTunes/Apple Music previews, mimic Activity rings, or misuse WeatherKit data.
Measured against this build: the app has its own identity and mascot, no Apple emoji, no Apple media, no
Activity rings, no WeatherKit. **Nothing in the app is a 5.2.5 problem as far as this seat can measure.**
If the Desk sees 5.2.5 as a live risk, say what triggered it and I will measure that specifically.

## 6 · Where this leaves the two stores

- **Apple:** 1.0 (7) **rejected**, `UNRESOLVED_ISSUES`. Nothing queued. No ETA, no inquiry, no RC reply.
  **Waiting on the Desk.**
- **Play:** untouched and independent — production `1.0.0 (7)` still with Google, public URL still 404.
  **No Play change on the back of this.**
- **Site:** freeze unchanged — no site PR, `AD_UNIT_LIVE` false, no guides, no AdSense request.

## 7 · What I need from the Desk

1. **Which path** — A′, B, B′, C, D or E.
2. If **C**: permission to reply in the Resolution Center, and whether the reply may name specific rows.
3. If **B′/E**: confirmation that dropping content is ruled acceptable to this business, not just to Apple.
4. **5.2.5** — where that text came from and whether it should change anything.
5. **Timing** — is there any deadline pressure (seasonality, other commitments), or does this wait?

*Agent actions this round: 0. Reads only. No reply, no resubmit, no build, no ASC edit, no announcement.*
