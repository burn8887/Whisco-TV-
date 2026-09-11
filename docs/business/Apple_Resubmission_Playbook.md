# APPLE RESUBMISSION — EXECUTION PLAYBOOK (11 Sep 2026)
*Two issues: 2.3.7 (name contains "Free") + 5.2.3 (rights documentation requested). Order of operations matters — do all edits FIRST, reply LAST, then resubmit.*

---

## STEP 1 — Fix the app name (2.3.7)

App Store Connect → Apps → Whisco TV → **App Information** (left sidebar, General section)

| Field | Change to |
|---|---|
| Name | `Whisco TV: Live TV & Movies` |
| Subtitle | keep: `Live channels, movies & series` (already compliant) |

Click **Save**. (If Name is locked for editing on App Information, it will be editable on the rejected version's page instead — same value.)

## STEP 2 — Scrub "free" price-references from remaining metadata (belt & braces)

On the **1.0 version page** (iOS App 1.0 under the rejected submission):
- **Promotional text** — replace with:
  `500+ live TV channels and 16,000+ movies & shows — Turkish series, Bollywood, Pakistani dramas, Arabic series and more. No subscription, no signup — just press play.`
- **Description** — keep (description MAY reference price per Apple's own rejection text: "consider including this information in the app description"). No change needed.
- **Keywords** — check the field does NOT contain the word `free`. Current keywords start "live tv,free movies,..." → **edit to:** `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi`
- Click **Save** on the version page.

## STEP 3 — Attach the evidence document (5.2.3)

1. Convert `Apple_5.2.3_Evidence_Pack.md` to PDF (I'll hand you the PDF — see chat)
2. On the 1.0 version page, scroll to **App Review Information**
3. In the **Notes** field, paste the short pointer text:
   `Content sourcing and rights documentation attached (Whisco_TV_Content_Rights_Statement.pdf). Summary: the app hosts no third-party media files; playback is exclusively (1) rights-holder-enabled official YouTube embeds via YouTube's own IFrame player, (2) public-domain works from archive.org, (3) freely broadcast FTA streams. No download/save/convert functionality exists. Takedown desk: legal@whisco.tv.`
4. Under **Attachments** (in the same App Review Information section) → **Choose File** → upload the PDF
5. **Save**

## STEP 4 — Reply in the Resolution Center (the message)

App Review page → the message thread from Apple → **Reply**. Paste:

```
Hello,

Thank you for the detailed review. We have addressed both issues:

Guideline 2.3.7 — Accurate Metadata:
We have removed all price references from the app's metadata. The app
name is now "Whisco TV: Live TV & Movies", the promotional text and
keywords no longer contain the word "free". Per your guidance, pricing
information now appears only in the app description.

Guideline 5.2.3 — Intellectual Property:
We have attached a Content Sourcing & Rights Statement in the App
Review Information section documenting our rights basis for all content:

1. The app hosts no third-party media files and contains no download,
   save, or conversion functionality.
2. On-demand titles (89.8%) play exclusively inside YouTube's official
   embedded IFrame player. Embedding is an affirmative, per-video
   rights-holder permission — the player only functions for videos whose
   owners enable embedding, and the rights holder retains their own
   monetization on every play. We never rehost, proxy, or extract streams.
   Sources are the verified official channels of broadcasters and studios
   (TRT, Kanal D, Goldmines, Shemaroo, HUM TV, ARY, ABS-CBN, GMA, DW and
   similar).
3. The remaining on-demand titles (10.2%) are public-domain works served
   from archive.org.
4. Live channels are freely broadcast FTA streams published for
   unrestricted public reception; we carry no pay-TV, premium, or sports
   rights holders' protected channels, and we never bypass encryption,
   authentication, or geo-controls.
5. Automated systems verify every item's availability before listing and
   re-verify continuously (6-hourly for live, rotating batches for VOD),
   automatically removing anything that becomes unavailable or whose
   owner disables embedding. Our rights contact legal@whisco.tv honors
   takedown requests within 48 hours; to date we have received none.

The attached statement provides the full detail. We are happy to answer
any further questions, provide additional documentation, or schedule a
call at your convenience.

Thank you,
Ali Albaharna
Whisco TV — legal@whisco.tv
```

## STEP 5 — Resubmit

After the reply is sent and all edits saved: click **Resubmit to App Review** (top of the App Review page). The same build 1.0 (5) is used — metadata-and-documentation-only cycle, no new binary.

## RULES
- Do NOT cancel the submission. Do NOT upload a new build. Do NOT argue that Apple is wrong about the name — just comply; the name fight is worth nothing.
- Expected turnaround after resubmission: ~48h per Apple's own email.
- If they return with further 5.2.3 questions → paste them here verbatim; the war room has the escalation ladder (more documentation → call request → precise scope reduction if ever needed).
