# WHISCO TV — GOOGLE PLAY PRODUCTION ACCESS APPLICATION (walkthrough)
**Written 2026-09-14 for Ali. Click-by-click, with copy-ready answers.**
Sources: Google Play Console Help "App testing requirements for new personal developer accounts" (the form's three sections) + the target-API policy page. Every answer below is built from **documented facts in this repo** (mobile build history in WHISCO_TV_PROJECT_HANDOVER.md §6c) — nothing invented. Where a detail is yours to confirm, it is flagged ⚠️.

---

## STEP 0 — TWO CHECKS BEFORE YOU CLICK ANYTHING

### Check 1 — is the clock actually done?
Play Console → **Dashboard**. Look for a card that says **"Apply for production"** (sometimes worded as the production-access prompt).

- **Card present** → you are eligible. Continue.
- **Card absent** → the clock is not complete yet. Do not look for a workaround; there isn't one. The clock is measured **per tester**, and your real date is set by the **12th tester's continuous opt-in**, not by when the track was created. If testers dropped out and re-opted, that resets their individual timer.

Your track is named **`whisco.tv test `** (note: it appears to have a trailing space — that is cosmetic and does not affect anything). It holds **versionCode 6**, status *completed*, with tester group **`testers-community@googlegroups.com`**. Verify the opted-in count on that track's **Testers** tab: it must show **12 or more opted in**, not merely invited.

### Check 2 — the target API banner
On the **Dashboard** and on the closed-testing **release page**, look for any warning banner about the **target API level** ("must target Android 16 (API level 36)…").

**Expected result: no warning.** Your app is Expo SDK 57, and Expo's own compatibility table lists **SDK 57 → compileSdkVersion 36 / targetSdkVersion 36**, so the build already targets API 36 and is compliant with the 31 August 2026 requirement.

- **No banner** → proceed. Nothing to do.
- **Banner present** → stop, tell me, and I will add the `expo-build-properties` plugin pinned to `targetSdkVersion: 36` and rebuild before you apply. Applying first risks a rejection we can avoid.

⚠️ One honest limit: Google's API does not expose the target SDK of an already-uploaded bundle, so this is verified by Expo documentation rather than by reading the uploaded artefact. The banner is the authoritative check — that is why Check 2 exists.

---

## STEP 1 — OPEN THE FORM

1. Play Console → **Dashboard**.
2. Click **Apply for production**.
3. The form has **three sections**.

> ⚠️ **CRITICAL:** if you click **Discard**, or close/leave the page without clicking **Apply** at the end, **your answers are not saved**. Google states this explicitly. Write the answers in a notes app first, then paste them in one pass.

Each free-text answer has a limit of roughly **300 characters**. The answers below are written to fit.

---

## STEP 2 — SECTION 1: "ABOUT YOUR CLOSED TEST"

**Q1. How did you recruit users for your closed test?**
```
We recruited 26 testers through a dedicated Google Group shared with Gulf-based
households known to us personally, and invited them to the closed testing track.
Testers opted in individually and installed the app on their own Android devices.
```

**Q2. How easy was it to recruit testers for your app?** *(you pick an option)*
Choose honestly between *"Neither easy nor difficult"* and *"Somewhat difficult"*. Both are acceptable; Google uses this for its own research and it is not a scored question. Do not pick "Very easy" if it wasn't — the app has a specific audience (Gulf households), and a candid answer is more consistent with the rest of your application.

**Q3. Describe the engagement you received from testers during the closed test.**
```
Testers used the app repeatedly across the 14-day test rather than on a single
day. They browsed Live TV, opened On Demand shelves, played episodes, and saved
titles. Usage matched how we expect a real viewer to behave: opening the app to
watch a channel, browsing to find a movie.
```
*(⚠️ Confirm this matches what you actually observed.)*

**Q4. Provide a summary of the feedback you received, including how you collected it.**
```
Feedback came directly from testers by WhatsApp and in person. Three themes:
1) playback errors on some YouTube-hosted titles; 2) the default tab icons were
unclear at a glance; 3) the status bar overlapped content on some devices. All
three were acted on in later builds.
```
*(⚠️ Confirm/adjust to the feedback you actually received. If testers raised something else, say that instead — specific and true beats polished.)*

**Q5. What changes did you make to your app based on what you learned from the closed test?**
```
We fixed a playback failure on YouTube-hosted titles (error 153) by loading the
embeds from a host page with a valid origin; replaced the default tab icons with
custom Whisco icons; fixed a status bar overlap using safe-area insets; and
corrected the advertising-ID declaration in the manifest.
```

---

## STEP 3 — SECTION 2: "ABOUT YOUR APP"

**Q6. Who is the intended audience for your app?**
```
Gulf households: Gulf nationals and the large expatriate communities in Bahrain,
Saudi Arabia, the UAE, Kuwait, Qatar and Oman — South Asian, Filipino,
Indonesian, Arab and Turkish viewers who want television from home, in 13
languages.
```

**Q7. Describe how your app provides value to users.**
```
Whisco TV gives Gulf households free access to 600+ live channels and 16,000+
movies and shows from their home countries, with no subscription and no signup.
Viewers open the app and immediately find live TV and on-demand content they
recognise, in their own language.
```
*(Numbers are the approved public floors. Keep them as written.)*

**Q8. How many installs do you expect in the first year?** *(you pick a range)*
Pick a **modest** range — the lowest or second-lowest band offered. Rationale: this is a real question with real consequences. A small, honest number matches the app's actual stage (pre-launch, no paid marketing yet, no store presence) and cannot be held against you. An inflated number invites scrutiny you do not need, and violates the numbers doctrine: floors only, never ceilings.

---

## STEP 4 — SECTION 3: "ABOUT YOUR PRODUCTION READINESS"

**Q9. Describe how you determined your app is ready for production.**
```
We ran the full closed test with testers actively using Live TV, On Demand and
My List. Every issue they raised was fixed and verified in later builds
(versionCode 5 to 6). The final build has no blocking defects, and the core
viewer paths — browse, play, save — work on real Android devices.
```

**Q10. What did you do differently this time?** — *only if shown; re-applicants only.* Skip if absent. (It should not appear for a first application.)

Then click **Apply**.

---

## STEP 5 — AFTER YOU SUBMIT

1. **Tell me the moment you click Apply.** I will log the date and watch the Play API for the track change.
2. **Don't change the closed track.** Leave versionCode 6 in place, leave testers opted in. If Google comes back asking for more testing, an intact track resumes the clock; a dismantled one does not.
3. **Review time:** Google says the production-access decision is usually **within about 7 days** (some sources say ~48h for the decision, up to 7 days for production review). Approval is **not guaranteed** — it is judged on the quality and honesty of these answers.
4. **If rejected with "more testing required":** paste the message verbatim. The fix is almost always more engagement evidence, not more testers — we will add specific tester activity detail and re-apply.
5. **When approved:** upload the production build (versionCode 7, rebuilt so the version number moves — do **not** reuse 6), then submit for review. Then we start the Fire TV / Amazon Appstore step.

---

## THE FOUR THINGS THAT GET APPLICATIONS REJECTED (avoid all four)
1. "Feedback was positive, no bugs found" — Google treats a claim of zero issues as proof the testers never opened the app.
2. No changes listed — if nothing changed, testing looks pointless. (You are covered: your build history has four real changes.)
3. Short one-line answers — aim for full, specific sentences.
4. Claiming things the app doesn't have — do not mention payments, ads or sign-in features we do not ship in v1.

---

## WHAT I HAVE ALREADY VERIFIED FOR YOU (2026-09-14)
- Closed track **`whisco.tv test `** exists, holds **versionCode 6**, release status **completed**.
- Tester group: **`testers-community@googlegroups.com`** (only track with a tester list; production/beta/alpha are empty).
- Bundles on file: **versionCode 5** and **versionCode 6**.
- Target API: **Expo SDK 57 → targetSdkVersion 36** per Expo's compatibility table, so the API-36 requirement is expected to be met — confirm with Check 2 above.
- The Play API **cannot** confirm the 14-day opt-in clock or the target-API banner. Both are Console-only. That is why Step 0 is yours, not mine.

🐾
