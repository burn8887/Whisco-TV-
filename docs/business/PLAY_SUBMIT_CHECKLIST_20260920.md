# Play — production release checklist

**2026-09-20. Production access was granted (Google email 2026-09-19 10:37 PM). This is the last step: put
versionCode 7 on the production track.** No re-upload needed — the AAB is already there.

---

## State, verified from the Play API just now

| Item | State |
|---|---|
| Production access | ✅ **GRANTED** |
| Production track | **EMPTY** — nothing released yet |
| versionCode 7 AAB | ✅ uploaded, currently on the closed track `build 7` |
| Listing title | `Whisco TV` ✅ |
| Short description | `Official live news and public-domain films. No signup.` ✅ |
| Full description | ✅ honest 8+8 copy, names the eight channels and eight films |
| Feature graphic | ✅ the NEW one, 1024×500 — "8 live news channels / 8 public-domain films" |
| Icon | ✅ set |
| Phone screenshots | ✅ **4, from the Android build** — 8 channels, source lines, PD evidence block |
| Tablet screenshots | none (not required) |
| Locales | en-US only |

The listing, graphic and screenshots are all the corrected versions. Nothing from the 625-channel client survives.

---

## The checklist

**1. Console → Whisco TV → Production → Create new release.**
Do not upload anything. Click **Add from library** and select **versionCode 7**.

**2. Release name.** Play fills a default. Set it to `1.0.0` (the closed tracks used "build 7" and "whisco.tv test" —
production should read clean).

**3. Release notes.** For a first release this is optional. If you fill it, one honest line:
`First release. Eight official live news channels and eight public-domain films.`

**4. Countries — THIS IS THE ONE DECISION.**
Two options, both defensible:

- **GCC six** — Bahrain, Saudi Arabia, UAE, Kuwait, Qatar, Oman. This is exactly what the production-access form told
  Google the audience was ("Gulf expatriate households"). Consistent with the declaration.
- **All countries** — wider reach. Also fine, and the app is legal everywhere it plays.

Pick one. If you want my read: **GCC six** keeps the app consistent with the audience we declared to Google and with
the listing copy ("for households in the Gulf"). Easy to widen later.

**5. Content rating** — already done? **Y / N** — say which. It is set during the app-content section, and Google only
granted production access after that section was complete, so it should read as done. Just eyeball for a green tick.

**6. Ads declaration** — answer **No**. The Android app carries no ad SDK. (The website has ads; the app does not —
they are separate surfaces. Do not tick "contains ads".)

**7. Data safety** — confirm **Data Not Collected** is still the saved state.

**8. Rollout** — **100%**. For a first release of this size a staged rollout adds nothing.

**9. Start rollout to production.** This is your tap, not mine.

**10. Confirm**: the production track should then show versionCode 7 with status *In review*, then *Available*.

---

## Two cosmetic items — worth 2 minutes, not blockers

**a. Three channel names in the Play description differ from the names inside the app.** The app is the source of
truth; the listing should match it.

| Listing currently says | App row says | Change to |
|---|---|---|
| `DW News` | `DW English` | `DW English` |
| `ABC News Australia` | `ABC News (Australia)` | `ABC News (Australia)` |
| `A Word to the Wives` | `Word to the Wives, A` | `Word to the Wives, A` |

This is the same class of mismatch we spent this week removing everywhere else — listing should not name rows
differently from the app. **Fix it before rollout if it takes two minutes; it is not worth delaying for.**

**b. The full description contains the string "500"** — in the sentence *"The app is a small, documented shelf — not
a 500-channel directory."* It is used to **disclaim**, not to claim, so it is not a false statement and does not break
the letter of the ban. But the standing rule was a blanket ban on that string in Play listing and notes.
**Grok's call** — if he wants it gone, the sentence becomes: *"The app is a small, documented shelf."* One edit.

---

## What is NOT allowed here

- Do not upload a new AAB. versionCode 7 is the right binary and it is already there.
- Do not put the old closed-test binary or the 625-channel client anywhere near production.
- No listing change that reintroduces a count, a dizi/Turkish-series claim, FTA, HLS, or an iptv-org mention.
- This checklist is the founder's to execute. The agent does not press release buttons.
