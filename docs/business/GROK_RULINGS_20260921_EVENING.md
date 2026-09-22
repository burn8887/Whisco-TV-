# GROK RULINGS — 21 September 2026, evening (GO/NO-GO packet)

Recorded verbatim as received. Prompt sent: `PROMPT_FOR_GROK_20260921_GONOGO.md`.

---

## Grok's response, verbatim

> GO/NO-GO — 21 Sep evening
>
> 1. GO edit listing NOW if the description field is editable.
>
>    If greyed out: WAIT and report. No new AAB.
>
> 2. GO these three strings, plain text:
>
> Official live news and public-domain films. Watch with no signup.
>
> Whisco TV is a free, ad-supported app for households in the Gulf. Watch without signing up — an account is optional. No subscription. No credit card.
>
> Privacy: if you create an account we collect your email address and a user ID, as declared in our Data safety section. Full policy: whisco.tv/privacy
>
> 3. GO leave Data safety Email + User ID.
>
> 4. GO doc-only fix store/play-listing.md on whisco-mobile main. No EAS, no Play write.
>
> 5. GO legal@whisco.tv everywhere. No privacy@ split.
>
> 6. GO worldwide distribution as already in the packet.
>
> 7. Founder confirms feature graphic. You do not upload art.
>
> Founder clicks Save / Send for review. You do not commit a Play edit.
>
> Still no announcement, no OFT, no AdSense, no Apple reply.

---

## Execution — what each ruling produced

| # | ruling | executed | evidence |
|---|---|---|---|
| 1 | edit listing now, if editable | ✅ **EXECUTED** — field was **not** greyed out; founder edited | see *Founder execution* below |
| 2 | three strings approved | ✅ **EXECUTED** — pasted as plain text | see *Founder execution* below |
| 3 | Data safety unchanged | **no action taken** — deliberately not touched | declaration reads Email + User ID, unchanged |
| 4 | doc-only fix, mobile repo | ✅ **shipped** `cd92f2a` on `whisco-mobile` main, doc-only | raw file re-fetched from GitHub: `Data Not Collected` gone, `Watch with no signup.` in, `Email + User ID` row in |
| 5 | `legal@` everywhere | ✅ **shipped** PR #19 → merge `3378da2`, Vercel READY | prod `/privacy` `/contact` `/about` `/terms` → `privacy@whisco.tv` **0**, `legal@whisco.tv` present |
| 6 | worldwide distribution | **no action** — no objection recorded | distribution was already in the in-review packet |
| 7 | founder confirms graphic; no art from me | ✅ **CONFIRMED CLEAN** by founder — banner has no counts, no dog | nothing uploaded by me |

**Barred and observed:** no announcement, no OFT, no AdSense request or review press, no Apple reply,
no Play write by me, no new AAB. **I wrote nothing to Play at any point — the founder made every Console
click**, including Save and Send for review.

## Founder execution — completed 21 Sep, ~23:15 Asia/Bahrain

**Rulings 1, 2 and 7 are done.** Confirmed by the founder in Play Console:

- The full-description field was **not greyed out** — Googled permits the edit while the previous
  change set is in review. The WAIT branch of ruling 1 did not apply.
- **Short description** replaced with `Official live news and public-domain films. Watch with no signup.`
- **Full description** — first line replaced with the *watch without signing up — an account is
  optional* line; last line replaced with the privacy line pointing at `whisco.tv/privacy`.
- Pasted as **plain text** (no markdown, no brackets).
- **Feature graphic confirmed clean** — no `500+`, no `14,000+`, no dog.
- **Saved and submitted for review.**

### Net effect on the open review

A **second change set is now in review** alongside the production full-rollout set. Because
**Managed publishing is OFF**, both publish **automatically on approval** — the corrected copy and
the corrected graphic are what the first public version of the listing will carry. The false
*"does not collect your data"* line is now **replaced, not merely pending**: it cannot ship as-is
after this submission is approved.

### Still open, in this order

1. **Google's review** — outcome unknown, no ETA. The public URL is still **404** as of this record.
2. **The public URL going live** — the gate for any announcement, indefinitely barred until then.
3. **Founder GSC clicks** — 16 URLs, top-down, quota-limited; see
   `GSC_FOUNDER_CLICK_LIST` path in `GSC_FOUNDER_CLICK_PATH_20260921.md`. This is the last
   independent item on the list.

## Item 5 detail — the second address was live on three surfaces

Grok's ruling exposed a real defect: `privacy@whisco.tv` was published on `/privacy`, `/contact` and
`/about`, while the deletion-by-email route on the same pages points at `legal@whisco.tv`. One policy
page, two addresses, one of them with no declared owner.

| file | before | after |
|---|---|---|
| `privacy/page.tsx` | "Contact us at `privacy@whisco.tv`." | `legal@whisco.tv` |
| `contact/page.tsx` | separate *Privacy* card sharing the legal inbox | one card: **Rights Holders, Legal & Privacy** |
| `about/page.tsx` | *Rights holders:* + *Privacy:* rows, one inbox | one row: **Rights & privacy:** |

**Guardrail moved by ruling, not drift:** `/about` body sha `ae162fced3a3a3f0` (2,145 chars) →
**`df90b9162736ac84` (2,120 chars)** — the email row only; no counts, no tiles, no copy rewrite.
One-commit revert if the Desk disagrees.

## Item 4 detail — the public doc was carrying the false claim

`github.com/burn8887/whisco-mobile` is **public**. `store/play-listing.md` on `main` was fetchable by
anyone and read `| Data safety | Data Not Collected |` — the same claim that was about to go live on
Play. Corrected doc-only at `cd92f2a`: short description, the account line, the Data safety row, the
wrong character-count claim (54 → 65, not 57), and the now-superseded "do not apply for production"
instruction. No build, no EAS, no Play write.

**Not touched, flagged:** `whisco-mobile/store/listing.md` line 27 still reads
*"No account needed to watch; sign-up only adds watchlist & resume"* — the same false family, outside
the ruling's named file.



---

# GROK RULINGS — 21 Sep, LATE NIGHT (website briefing review)

Received verbatim:

> WEBSITE — 21 Sep night. NO new site PR tonight.
>
> Accepted: #8–#19 except the recorded #17 orphan (already superseded by #18).
>
> Do not touch /about again. Do not touch tokens, cards, Maghrib, ads.ts,
> X-Whisco-Store, sitemap noindex, or AdSense.
>
> 9.2 HOLD: AD_UNIT_LIVE stays false. AdSlot stays null.
>     Do not create a unit. Do not Request AdSense review.
>
> 9.8 HOLD: no new guides until next week (2 only, Desk names slugs).
>
> 9.7 GO on mobile repo only (not Whisco-TV-):
>     store/listing.md line 27 — doc-only, match Play strings
>     (watch without signing up / account optional / Email + User ID).
>     No EAS. No Play Console.
>
> Barred: announcement, OFT, Apple reply, new AAB, GSC API fake-submit,
> /title/* Request indexing, second sitemap, WebGL, new mascot.
>
> Next site work waits on: Play public URL 200, or Desk naming two guide slugs
> next week, or a store letter.

## Execution

| item | ruling | done |
|---|---|---|
| 9.7 | GO · mobile repo only · doc-only | ✅ **`3ad78c8`** on `whisco-mobile` main — public raw file re-fetched and string-checked |
| 9.2 | HOLD | **no action** — `AD_UNIT_LIVE` stays false, `AdSlot` stays `null`, no unit created, no AdSense press |
| 9.8 | HOLD | **no guides written** |
| — | no new site PR tonight | ✅ `Whisco-TV-` main still `07cc2cb` (20:18) — untouched since the `legal@` merge |
| — | protected list | ✅ `/about`, tokens, cards, Maghrib, `ads.ts`, `X-Whisco-Store`, sitemap noindex, AdSense — **none touched** |

**Two open holds carried forward, unchanged:** 9.2 (revenue-zero is the accepted state) and 9.8
(next two guides only when the Desk names the slugs).

**Next site work gate, recorded:** Play public URL **200**, or Desk naming two guide slugs next week,
or a store letter.

## 9.7 detail — what was corrected, and what was deliberately left

`whisco-mobile/store/listing.md` is the **old draft**, not the corrected one. Corrected tonight:
the account line, the Data safety rows (`declare NO data collected` → **Email + User ID**), and the
dead `privacy@` address. A **SUPERSEDED** banner now points at `store/play-listing.md`.

**Left standing, flagged for a separate ruling:** this draft's short description still reads
`500+ free live TV channels & 14,000+ movies and shows` and its body names `dizi`, `Bollywood`,
`free-to-air` and an `iptv` tag. Rewriting that description is a bigger decision than "match the Play
strings", so it was not taken unilaterally. Both files on the public raw endpoint return **200**.


---

# 9.7 FOLLOW-UP — GO delete (received 21 Sep, late)

> Delete `whisco-mobile/store/listing.md` on main.
> Doc-only. No EAS. No Play Console. No Whisco-TV- commit.
> Reason: public old draft still carries 500+ / 14,000+ / dizi / IPTV tags.
> `play-listing.md` is the only listing source.
> If anything unique exists (Amazon Fire note), move one factual line into `play-listing.md` as
> "not submitted — do not paste counts." Then delete `listing.md`.
> Verify raw GitHub 404 on `listing.md` after push.
> Site stays frozen. `AD_UNIT_LIVE` false. No guides. No AdSense.

## Executed — `whisco-mobile` `a7bd3e7`

| step | result |
|---|---|
| Amazon note preserved first | moved into `play-listing.md` under **Other stores**: *"Amazon Appstore (Fire TV) — **not submitted** … do not paste counts from anywhere — same 8 live channels and 8 films, no `500+`, no `14,000+`, no `dizi`, no `iptv`."* |
| `store/listing.md` deleted | staged as `D store/listing.md` (−81 lines) — verified in the staged list **before** commit |
| raw GitHub 404 | **HTTP 404** (2 attempts) |
| contents API 404 | **HTTP 404** — decisive, no CDN in the path |
| `play-listing.md` on main | **HTTP 200**, 5,927 bytes, local == committed == GitHub (byte-identical) |
| `store/` now | `ios-listing.md` · `play-listing.md` · `feature-graphic-1024x500.png` · `play-icon-512.png` · `retired/` |
| EAS / Play Console / Whisco-TV- | **none touched** by this task |

**Checked, not assumed:** the surviving `play-listing.md` still contains the string `dizi` — four
times, **every one inside the ban table or as an instruction never to use it** (lines 12, 77, 79, 121).
That is the ban list doing its job, not a claim.

**Separate instruction, separate commit:** the founder asked for a README pointer to the handover. That
landed as `Whisco-TV-` `1f2d36c` — `README.md` +11 lines, **docs only**. The ruling's "no Whisco-TV-
commit" was scoped to the delete task; this is a distinct, user-instructed docs change. Verified
frozen since the last site-affecting merge `3378da2`: **0 files under `src/`**, **0 under `public/`**,
0 non-doc files. `AD_UNIT_LIVE` false, no guides, no AdSense — unchanged.


---

# 9.7 ACCEPTED — plus the standing gate, restated (21 Sep, night)

> **9.7 accepted.** `store/listing.md` is gone. Raw 404 is the proof that matters.
> Amazon Fire line in `play-listing.md` is the right place for it: same 8+8, no counts, not submitted.
> **README commit `1f2d36c` is fine.** Docs-only on Whisco-TV- is not a site PR. Freeze was
> src/ / public/ / ads / guides. Leave it; do not revert.
> Parked gate unchanged: **Play URL 200, two Desk-named slugs, or a store letter.**
> You have nothing to click tonight except GSC if quota is back.

## Correction — I have no clicks, ever

The last line is addressed to me, and it does not apply: **I do not click.** Not GSC, not Play, not
AdSense, not EAS, not Apple. The standing lock (**A8 Option 2**) is explicit — *no signed-in GSC
browser farm, no bot driving a Google UI*, and the weekly log carries **`Clicked by me: 0`
permanently**. The API is read-only and has **no Request Indexing endpoint**, so there is nothing an
agent *can* submit, and nothing an agent *should*.

What I own on GSC is **measurement and the hand-off**: run the read-only inspection, produce the
numbered list, report the share. What the founder owns is **the clicks**.

**Tonight's state is already fresh** — inspection re-run at ~23:15 Asia/Bahrain (same-day `--refresh`):
**14 / 30 = 47%**, **16 URLs** outstanding, **0 crawled** among them. Nothing changes in an hour; the
next scheduled run is **Monday 28 Sep 10:30**.

## Status after acceptance

| item | state |
|---|---|
| 9.7 (delete `listing.md`) | **accepted and closed** — raw 404, API 404 confirmed |
| README `1f2d36c` | **accepted, left in place, not reverted** |
| Freeze | intact — since `3378da2`: 0 `src/`, 0 `public/`, 0 non-doc files |
| `AD_UNIT_LIVE` | **false** (9.2 HOLD) |
| Guides | **none** (9.8 HOLD — Desk names 2 slugs next week) |
| AdSense | untouched, not requested |
| Parked gate | Play URL **200** · two Desk-named slugs · store letter |

**Nothing is open on my side.** Everything remaining belongs to the founder (GSC clicks, and the
clicks that follow a store outcome) or to the Desk (naming slugs).


---

# STORE LETTER — APPLE, 22 Sep (stop condition triggered)

App Store Connect emailed **"There's an issue with your Whisco TV (iOS) submission"** at
~02:50 Asia/Bahrain on 22 Sep. Read-only API pass confirms:

- version 1.0 → **`REJECTED`** · submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf` → **`UNRESOLVED_ISSUES`**
- submission item → **`REJECTED`** · build **7 `VALID`**, not expired
- **the reason is NOT IN DATA** — six endpoints probed; the reviewer's message is exposed only in the
  Resolution Center

**Actions taken by me: none.** No reply, no resubmission, no ASC edit, no build. Working brief:
`/home/user/APPLE_REJECTION_20260922.md`.

**Barred until ruled:** Apple reply · RC letter (Grok lock: only after a new binary in Connect) ·
resubmission · new binary / EAS · any ASC edit · any public statement.

**Founder action:** read the Resolution Center message verbatim (guideline number first) and hand it
over. Nothing is decidable without it.

---

# APPLE 5.2.2 — DESK RULINGS (22 Sep) + execution

> 1. **Option A. Not B.**
> 2. Attach: build-7 rights statement (not the build-6 PDF) + 16-row evidence appendix + cover note
>    that names BUILD 7 and the 8+8 gate. Cover may (must) say the Sept 15 615-channel screenshot is
>    the old binary. Do not use "we ship no content."
> 3. **GO fix /home live row under X-Whisco-Store: ios now.** Server only. No EAS. No site chrome PR
>    beyond that endpoint.
> 4. **RC lock lifted THIS LETTER ONLY.** Draft the reply. Founder attaches files in App Review
>    Information, pastes the letter, then resubmit THE SAME build 7.
> 5. No PD-only shrink. No new binary. No Play change. No public statement.

## Executed by me

| item | result |
|---|---|
| 3 — `/home` live row | ✅ **shipped** PR **#20** → merge **`9742914`**, Vercel READY, prod-verified |
| 1, 2, 4 — drafts | ✅ three parts written: `/home/user/APPLE_5.2.2_DRAFT_20260922.md` (also in `docs/business/`) |

### The `/home` fix, measured

Cleared-store branch built a `live` row with a hardcoded `items: []` and then kept it with
`|| r.key === "live"`. The app renders every row it receives → **a labelled, empty shelf on the first
screen a reviewer opens**. Fixed by removing the stub; the eight cleared channels were already on that
screen as `featuredChannels` under "Featured live channels".

| header | before | after |
|---|---|---|
| `ios` | live **0**, docs 8, publicdomain 8 | docs **8**, publicdomain **8**, no empty rows, featured **8** |
| `android` | same as ios | same as ios |
| *none* | 5 rows × 16 | **unchanged** |

`/live` 8 · `/vod` 8 · `/title/cennetin-cocuklari` **404** · `/` `/guides` `/about` **200**.

### Evidence gathered for the appendix (all read-only, all verifiable by Apple)

- 8 live channels: broadcaster channel IDs + official-channel URLs, all **HTTP 200** on 22 Sep
- 8 films: archive.org metadata per item — **format h.264**, 640×480, byte size, MD5, duration,
  **licence URL `creativecommons.org/licenses/publicdomain/`**, collection `prelinger`
- Saved: `/home/user/apple_evidence_items.json`

### Flagged, NOT acted on (needs a new binary → barred this round)

`whisco-mobile/app/(tabs)/index.tsx` still carries **"Life's better at full speed — and full free."**
— the exact phrase on the Design System §1.4 forbidden list, live in build 7's Home screen. Same
defect we fixed on the website. **Fix in the next build regardless of how 5.2.2 resolves.**
