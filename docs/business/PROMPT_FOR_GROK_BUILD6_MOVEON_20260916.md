# Prompt for Grok — Build 6: play-test done, catalogue complete, permission to move
**2026-09-16, late. Supersedes nothing; your 22:45 ruling stands as the governing permission.**

---

## 1. What changed since your 22:45 ruling

Your condition for unblocking was: get live to **8–12 play-tested official YouTube news**, VOD to the
**2 ticked + at most 6 more** Prelinger H.264 shorts, then come back. That is now done, at 8 and 8.

**The founder play-tested all twelve new rows on his phone. All twelve passed.** He then ticked them by
name. I wrote the tick with the clearance script using `--by "Ali"`, so every row carries an attributable
human sign-off. **No automation set `clearedForApp` at any point — that remains the one value only a human
tick writes**, exactly as your lock requires.

**Live — 8 rows, all `clearedForApp=true`, all `clearedBy=Ali`, all `sourceKind=youtube-live`, all channel-form:**

| # | Channel | Channel id embedded | Official channel |
|---|---|---|---|
| 1 | France 24 English | `UCQfwfsi5VrQ8yKZ-UWmAEFg` | `youtube.com/@France24_en` |
| 2 | DW English | `UCknLrEdhRCp1aegoMqRaCZg` | `youtube.com/@dwnews` |
| 3 | TRT World | `UC7fWeaHhqgM4Ry-RMpM2YYw` | `youtube.com/@trtworld` |
| 4 | Al Jazeera English | `UCNye-wNBqNL5ZzHSJj3l8Bg` | `youtube.com/@aljazeeraenglish` |
| 5 | CNA | `UC83jt4dlz1Gjl58fzQrrKZg` | `youtube.com/@channelnewsasia` |
| 6 | NHK WORLD-JAPAN | `UCSPEjw8F2nQDtmUKPFNF7_A` | `youtube.com/@NHKWORLDJAPAN` |
| 7 | Africanews | `UC1_E8NeF5QHY2dtdLRBCCLA` | `youtube.com/@africanews` |
| 8 | ABC News (Australia) | `UCVgO39Bk5sMo66-6o6Spn6Q` | `youtube.com/@abcnewsaustralia` |

**Films — 8 rows, all `clearedForApp=true`, all `clearedBy=Ali`, all Prelinger, all measured on the actual file as
`h264 / avc1 / Constrained Baseline / 640×480`:** American Look (Part I), A Word to the Wives, Bookbinders,
Out of This World, Design for Dreaming, San Francisco Earthquake Aftermath Pt 3, Skateboard Sense,
More Dangerous Than Dynamite. Longest is 13.5 minutes; none is over your 35-minute limit.

**Both of your rejections were enforced:**
- **DW Documentary is not in the app.** Probed live and embeddable, but its broadcast title was *"War in Sudan …
  An online discussion"* — a scheduled event, not a 24/7 channel. Rejected on that evidence alone.
- **Sky News, Bloomberg, Reuters** not seeded. **Somoy, Jamuna, Ekattor, Channel i** not seeded.
- Still `false`, untouched: Park Conscious, All About Polymorphics, Topper, the Somoy row.

**Rights pack rewritten** (`docs/business/RIGHTS_PACK_build6.md`) from "2 live rows" to the final ticked set —
all 8 live rows in channel form with official channels, all 8 films with their file URLs, item pages and the
verbatim licence line. The scope note now reads "only the eight items above".

---

## 2. Verification — production, not local

| Check | Result |
|---|---|
| `GET /api/mobile/v1/live` with `X-Whisco-Store: ios` | **exactly 8 rows**, `store: "ios"`, `cache-control: private, no-store`, `vary: x-whisco-store` |
| `GET /api/mobile/v1/vod` with the iOS header | **exactly 8 titles** |
| `GET /api/mobile/v1/live` with no header | the six new rows are **absent**; France 24 and DW still listed; **0 duplicates** |
| Database | cleared = **8 channels, 8 titles**, every one `clearedBy=Ali` |
| Every row's public URL | 16/16 return **200** (`/live/<id>` ×8, `/title/<slug>` ×8) |

---

## 3. Three things the founder asked me to put in front of you

**3.1 — Live sits exactly on the floor of your band.**
2 existing + 6 new = **8**, your lower bound, no margin. **One row failing in a future review drops us to 7**,
which is outside the band — and you approved no spare, because the only other candidate you allowed was
ABC News (Australia), which is already in. *Ruling wanted:* either approve a small reserve of 2–4 further
official 24/7 news channels so we sit at 10–12 instead of 8, or confirm 8 stands and no reserve is needed.

**3.2 — The three "unpushed" docs are already public.**
`DRAFT_Apple_Resubmission_Action_Plan.md`, `BRIEFING_FOR_GROK_20260915.md` and
`BRIEFING_ADDENDUM_Bahrain_Result_20260915.md` were committed in `e6ebc66` and pushed with the build-6 branch
**before** the "unpushed docs stay unpushed" instruction reached me. They are on the public remote right now, in
`github.com/burn8887/Whisco-TV-`. Removing them from published history requires a **history rewrite**, which I
have not done and will not do without a direct instruction. *Ruling wanted:* leave as-is, or authorise a rewrite.

**3.3 — The site repo is not called what the name suggests.**
The site repository is **`github.com/burn8887/Whisco-TV-`** — with a trailing dash. Last night's push to
`burn8887/iptv-app` failed with "Repository not found" until I found the real name. *Ruling wanted:* confirm no
workflow, doc or script assumes the old name, since a silent push failure is exactly how a "deployed" change
fails to deploy.

**Three further disclosures, because you said verify before passing claims on:**

**3.4 — The public `/live` count differs between a fresh render and the cached one.** Same URL, same moment:
**fresh render = 623 total / 57 rows; edge-cached snapshot = 617 / 58 rows**, reproducible 4/4. The six new rows are
absent in both, and the iOS path is exact. Cause: the public route is cached (ISR) while the iOS path is
`private, no-store`. It predates this week's work. *Ruling wanted:* refresh the cache after the freeze (Sep 20+),
or leave it — and whichever number we ever quote, quote the fresh render.

**3.5 — All 8 films have `durationMins: null` in the database**, although the app plays them and the measured
durations are in the rights pack. Cosmetic, a data fix, no deploy — but if a reviewer looks for a duration, it is
blank. *Ruling wanted:* backfill now (allowed under the freeze as a data fix) or leave it.

**3.6 — The Play feature graphic is still unusable.** `store/feature-graphic.png` reads *"500+ Live TV Channels /
14,000+ Free Movies & Shows"* and shows the brand dog. It cannot be submitted as-is, and it contradicts the
listing rules you set. Not an iOS blocker; it is the next Play blocker whenever we get to P7 step 2.

---

## 4. What we are asking for — permission to move

1. **P1 — Build.** Your "NO" was conditioned on a thin catalogue: *"do not `eas build` at 2+2"*. At **8 play-tested
   live + 8 PD films**, that condition is met. **May we build?** Standing procedure if yes: build from
   `whisco-mobile` `main` @ `3669584`, **read the EAS-assigned build number rather than assuming 6**, then unzip
   the IPA and print `UIBackgroundModes` — it must come back **absent**.
2. **P2 — Catalogue.** You said HOLD. Release it?
3. **P4 — Submit.** You said NO. Now that the binary would carry the full play-tested set, do we submit?
4. **P5 — Review notes.** Rights pack is rewritten to the final ticked set. Proposed claim set for the notes and
   listing, floors only: *"8 live news channels from their official YouTube channels, and 8 public-domain films"* —
   no Movies, no 500, no 14,000, no dizi, no FTA HLS, Marketing URL `/about`, never `/`. Confirm the doctrine and
   we will hand the founder the exact text for his approval. **Resolution Center letter still only after the new
   binary is in Connect** — not on build 5, not silent.
5. **P7 — Sequencing.** On your order: 1) iOS screenshots + letter, 2) Play listing rewrite + same-doctrine Android
   binary, 3) Play apply for production, 4) Part-2 archive dry-run on a branch, 5) AdSense later.

**Still not doing, and will not do without a separate word:** `eas build` before you answer (1), `eas submit`,
replying to Apple, Play apply, deploying the homepage, the production Part-2 repoint, clearing any row that is not
on the founder's play-tested list, and rewriting git history.

---

## 5. Repo state for the record

- `iptv-app` (= `burn8887/Whisco-TV-`) `main` @ play-test sheet + seeds commit; working tree clean.
- `whisco-mobile` `main` @ `3669584` (build-6 iOS store work merged), branch `build6-ios-store` @ `faac6a1`.
- Freeze 16–19 Sep respected: no site code touched, no homepage, no production repoint. Only docs, data, and the
  founder's own clearance ticks.
