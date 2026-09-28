# STORE WAIT STATUS — 2026-09-28

Measured 2026-09-28 13:50 UTC (16:50 Bahrain) · read-only APIs + public HTTP · agent clicks: 0

## The two clocks

| store | submitted | age now | state | has a human started? |
|---|---|---|---|---|
| **Apple** | **2026-09-23 12:32:39 UTC** (Wed 15:32 Bahrain) | **5 d 1 h** | `WAITING_FOR_REVIEW` | **No** — never entered `IN_REVIEW` |
| **Play** | **2026-09-21** (evening, listing copy + production release) | **≈7 days** | Console: *In review* · "Last updated Sep 21" | unknown — Play exposes no review state via API |

Apple detail: submission `c80e30c4…` is the only one on the account; version 1.0 and the item read
`WAITING_FOR_REVIEW`; build 7 `VALID`, not expired (uploaded 17 Sep — builds stay valid 90 days);
`UNRESOLVED_ISSUES = 0`, `IN_REVIEW = 0`. **No reviewer has picked it up yet** — this is queue time, not
review time.

Play detail: production track `1.0.0 (7)` vc 7 `completed`; public URL
`play.google.com/store/apps/details?id=tv.whisco.app` → **404**. That 404 is expected until the first
production release is approved — it is not a fault.

## Is it normal? Yes — but both sit at the upper edge of normal, not in the middle

**Apple, published expectations**

- Apple's own page: *"90% of submissions are reviewed in less than 24 hours."*
- Apple's June 2026 statement: 90% within **48 hours**, **average 1.5 days** across 200k+ weekly submissions.
- Third-party trackers put the *Waiting for Review* stage at ~8–14 h for **updates**.
- For **new apps** the 2026 band is **2–5 days**, with **7+ day spikes in peak periods** — and **September is
  named as a peak month**.
- A post-rejection resubmission effectively **restarts the clock**.

**Why ours is slower than the median:** it is a **first-ever release** (not an update), it is a
**post-rejection resubmission** carrying a **5.2.2 documentary-evidence pack** that a reviewer has to read and
validate, and it went in during a peak month. 5 days with no reviewer pickup is **inside** that band.

**Play, published expectations**

- Google's guidance: review **"typically takes seven days or less, but can occasionally take longer."**
- A **first production release** sits at the slower end of that range by design — there is no track record yet.
- Routine updates on an established app are much faster (hours to ~2 days); we do not have that history yet.
- At ≈7 days we are **exactly on the outer bound**, not past it.

## When it stops being normal — the checkpoints

| store | alarm threshold | our checkpoint |
|---|---|---|
| Apple | 7+ days with no status change; stuck reports at 9–20+ days | **Wed 30 Sep** — if still `WAITING_FOR_REVIEW`, past the new-app band |
| Play | beyond ~7–10 days for a first release | **Wed 30 Sep – Thu 1 Oct** |

Both checkpoints land mid-week. Nothing is late today.

## What we may do — and may not

**Allowed now: nothing to press.** There is no lever on either dashboard that helps a queued submission.

**Barred (standing rulings):**
- No inquiry to Apple, no Resolution Center reply, no expedited-review request without a Desk ruling.
- No Play Console writes, no admin action, no re-submit, no cancellation, no new build.
- No announcement, no "in review with Apple" public line.

**If a checkpoint passes with no movement, this becomes a Desk question, not an agent action.** The one real
lever that exists is Apple's **Expedited Review request** — it is discretionary, granted sparingly, and best
spent on a genuine time-critical case; asking is a Desk call, never a reflex.

## Signals to watch

1. **Apple state flip** `WAITING_FOR_REVIEW` → `IN_REVIEW` — the moment a human starts. Then 5.2.2 outcomes
   usually land within hours to a day.
2. **Founder inbox / Resolution Center** — if Apple needs something, that is where it arrives. Check the app's
   message thread; the API does not expose reviewer messages.
3. **Play URL 200** — the single unambiguous "approved and live" signal; Console may lag behind it.
4. Apple and Google are independent — one approving does not move the other.

*Agent clicks: 0. Every figure above was read with GET requests.*
