# Both submissions — verified state, 2026-09-18

Recorded at the founder's sign-off. Read from Apple's API and Google Play's API directly, not from memory.

---

## iOS — App Store Connect ✅ submitted, in review

| Field | Value |
|---|---|
| Version | 1.0 |
| State | **WAITING_FOR_REVIEW** |
| Submitted | 2026-09-17T23:43:22Z (02:43 Bahrain, 18 Sep) |
| Build attached | **7** — VALID, uploaded 2026-09-17T05:18:12-07:00 |
| Screenshots | `APP_IPHONE_61` ×4 (1179×2556) · `APP_IPHONE_67` ×4 (1290×2796) |
| Review notes | 2,875 characters |
| Attachment | `Whisco tv content rights statement build 6 .pdf` |
| Contact | burn8887@gmail.com · +973 3930 3973 · demo account not required |

The notes grew from 1,416 to 2,875 characters — the RC letter was pasted in, and it fits (limit is 4,000).
Build 7 is the build under review, not build 6. Both screenshot sets are populated.

**Two cosmetic mismatches remain, neither blocking:**
1. The attachment filename still says *build 6* while the build under review is 7. Content is identical between
   the packs — only the label differs. A build-7-named replacement is ready at
   `Whisco_TV_Content_Rights_Statement_build7.pdf` if a swap is wanted.
2. The notes reference that same build-6 filename.

Neither is a rejection risk on its own. Do not touch the submission to fix them unless Apple asks.

---

## Android — Google Play: the new binary is on a closed track; production is still empty

**Everything the founder has done on Play, read from the API:**

| Track | Release | versionCode | Status |
|---|---|---|---|
| `production` | — | — | **EMPTY** |
| `beta` | — | — | EMPTY |
| `alpha` | — | — | EMPTY |
| `internal` | `5 (1.0.0)` | 5 | completed |
| `build 7` | `build 7` | **7** | completed |
| `whisco.tv test ` | `6 (1.0.0)` | 6 | completed |

Bundles uploaded to the account: **versionCode 5, 6, 7**. The new 8 + 8 binary is versionCode **7**, and it sits on
the closed track named `build 7` with the `testers-community@googlegroups.com` group attached. That is the correct
precondition for a production-access application: the right binary is the one testers got.

**The production track has no release in it.**

This is *expected and fine* if the founder tapped **Apply for production access** — that is a Console application
form, not a release, and it does not appear in the Play API. It would also read as "waiting for review" in Console.

It would **not** be fine if he believed he had created a production release, because the API shows none exists.

**Question to put to him:** which button was pressed — *Apply for production access* (a form) or a production
release rollout? If it was the form, nothing further is required and the state above is exactly right.

---

## Barred actions — all still untouched

No `eas build` run by the agent. No Apply for production tapped by the agent. No catalogue row ticked. No homepage
deploy. No Part-2 repoint. No AdSense request. No direct contact with Grok or Apple. No `Submit for Review` /
`Update Review` / `Add for Review` / `Resubmit` pressed by the agent.

---

## What happens next

Both apps sit in review. Nothing is required from anyone tonight.

- **iOS:** Apple reviews. If rejected again, the reply path reopens at *App Review page → Resolve → Reply to App
  Review*, and the reviewer's message will say which guideline. The `/about` and `/guides` count cleanup is already
  live, so a 2.3.1(a) re-raise would have nothing to point at.
- **Play:** if the production-access application was submitted, review is typically days, not hours. If the form was
  not what was tapped, the production release still has to be created.
- **Do not press anything in either console** until the question above is answered.
