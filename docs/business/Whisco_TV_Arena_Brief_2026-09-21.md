# Arena brief — 21 September 2026
From: Grok Desk. To: Arena (site + apps). Founder clicks stores / AdSense / merge-to-prod.

Read this before touching `whisco.tv` chrome, `/guides`, `/about`, or any mobile catalog gate.

---

## 0. Do not break these queues

| Queue | State now | Arena must not |
|---|---|---|
| **Google Play** | **In review.** First Production `7.aab` / `1.0.0 (7)`, full rollout, 176 countries + rest of world. Listing description change in the same packet. Managed publishing **off**. | Change app catalog gate. Restore harvested HLS. Push a new AAB. Edit Play listing / feature graphic / screenshots. Change `/about` into a live index (Play Website URL is `https://whisco.tv/about`). |
| **App Store** | iOS build 7 **Waiting for Review** (submitted 18 Sep). 8 official YT live news + 8 archive.org PD shorts. `supportsTablet false`. `UIBackgroundModes` audio **ABSENT**. | New iOS binary. Tick more than 8+8 `clearedForApp`. Put counts on `/about`. Reply in Resolution Center unless founder pastes Apple’s letter here first. |
| **AdSense** | `whisco.tv` **Needs attention.** Ownership verified. **Not ready to show ads.** Policy = **Low value content.** Request-review checkbox is available. | Tick Request review. Mass-publish hundreds of pages. Un-noindex the thin URL mass. Expand sitemap back toward 16k title URLs. Add a second ad slot or an ad next to a player. |

Apps stay **8+8** via `X-Whisco-Store: ios|android`. Website `cached.ts` stays **ungated**. Cron must never auto-tick `clearedForApp`.

---

## 1. What the founder actually submitted today (21 Sep)

Morning, Asia/Bahrain then EEST.

1. **Play production access** was already granted 19 Sep 22:37 (email). Access ≠ live.
2. Confirmed candidate binary **`7.aab` / version name `1.0.0`**, uploaded Thu 17 Sep 23:47, 34 MB. Same AAB as closed testing.
3. Permissions on that AAB (not a ship-stopper; strip later): `INTERNET`, `ACCESS_NETWORK_STATE`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `SYSTEM_ALERT_WINDOW`, `VIBRATE`, `WAKE_LOCK`, `com.android.vending.CHECK_LICENSE`, `tv.whisco.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`. No location / camera / mic / contacts.
4. Closed tracks: **Alpha** empty. **build 7** already on build 7. **whisco.tv test** was still on **6 (1.0.0)** dated 29 Aug (pre-gate). Founder created a closed-test release of `7.aab` on **whisco.tv test** so testers leave build 6.
5. Store settings instruction: Website → `https://whisco.tv/about` (not `/`). Public email → `legal@whisco.tv` not `partnerships@`. Confirm those two saved.
6. First **Production** release submitted ~07:37: `1.0.0 (7)` start full rollout + countries (176 + rest of world) + listing full-description change. Status: **Changes in review.**
7. AdSense opened: still **Low value content**. Desk order: **do not Request review in September.**

GitHub remains source of truth (`burn8887` site repo + `whisco-mobile`). Secrets stay in founder vault / Actions / Vercel. Do not paste keys into Arena chat.

---

## 2. Graphic / design-system work — allowed today if scoped

Homepage freeze lift is a **founder** call. Design system spec already exists: `artifacts/Whisco_TV_Design_System.md`.

**Allowed today (website only, not store listing assets):**

- Dark canvas `#0a0a0f`, ember `#f97316` → bloom `#db2777`.
- Type: Geist / Inter + IBM Plex Sans Arabic, self-hosted.
- Nav / empty states / guide template chrome.
- Cartoon Announcer Whisco on **marketing / empty** only. No public LoRA. No dog on Play feature graphic (already in review — do not replace).
- Collection covers on the **website** can stay richer than the apps.

**Not today:**

- Play feature graphic, screenshots, short description, title.
- App Store screenshots.
- `/about` rewrite that adds catalog counts or a live grid.
- Any “600 / 14,000 / 615 channels” chip on public chrome.
- New mobile binary.

If design-system PR would change `/about` body copy, **split the PR**. `/about` stays count-free until both stores exit review.

Deploy path: Arena implements on a branch → PR to GitHub → founder or Arena (with existing GitHub connector) merges → Vercel production. Desk does not push.

---

## 3. The “600+ articles” plan — do not ship today

Standing line in the handover: *Lift website freeze / ship 600 articles + design — Not released.*

That number is a **library fantasy**, not an AdSense plan. Operating rule is **~2 hand-written guides per week**. Policy suite: guides exist to help a household choose; they stay hand-written. Google’s current refusal is **low value content** plus “genuine user interest.” Dumping 600 pages in one day is the same class of signal as the first strike (thin title shells + a directory).

Split the pile:

| Class | What it is | Who | When |
|---|---|---|---|
| **A. Publisher guides** | 1,200–2,000 word, sourced, dated, honest “where to watch / how to set up legally.” SEO pack TOP 20 + `/where` + apartment setup. | **Grok Desk drafts.** Founder voice-pass (15 min). | Cadence: **5 this week max**, then 2/week. Not 600. |
| **B. Design chrome** | Tokens, nav, guide layout, OG cards. | **Arena implements + deploys.** | Today OK if `/about` and store URLs untouched. |
| **C. Catalog title/channel pages** | Already exist (~16k VOD + ~600 live). Not articles. | Arena / crons already. | Keep **noindex** on the thin set. Do not put them back in the short sitemap. |
| **D. “600 articles” generated from metadata** | Spun H1s on every title. | Nobody. | **Forbidden.** This is how G1 dies twice. |

### Who writes what (class A)

Desk (this project) already has full drafts for SEO gaps **1, 4, 11, 14, 20** in `Whisco_TV_SEO_Content_Pack.md` and briefs for all 20.

**This week’s five (ship these, not 595 more):**

1. Legal HD English-sub Turkish series hub (gap 1)  
2. Legal TV in a GCC apartment / no-dish (radar 1.2 + pack)  
3. Fire TV / official-app path — no sideload (gap 14 class)  
4. Hindi / Malayalam legal stack on a Gulf IP (gap 4 / 11 class)  
5. One `/where` pillar: “where to watch [show-class] legally in BH/AE/SA”

Arabic: Gulf MSA only. Brand lock-up **وسکو تي في**. Do not machine-paste EN into AR and call it a second article.

Founder: 15-minute read for lies (VPN, geo-filter we do not have, catalog counts, “now on Play” before a non-tester can install). Human posts community links. Desk/Arena do not post to groups.

### Who deploys

| Step | Owner |
|---|---|
| Draft markdown in `/guides/[slug]` voice | Grok Desk |
| Fact check + rights-churn date stamp | Grok Desk + founder |
| MDX/page, internal links, OG, IndexNow **only those slugs** | Arena |
| `noindex` stays on thin catalog URLs | Arena — verify, do not invert |
| Merge to `main` / Vercel prod | Arena with founder nod |
| AdSense **Request review** | Founder only, and **not in September** |
| Play / Apple replies | Founder only, after this desk sees the letter |

Grok cannot push. Arena engineers. Founder is keyholder.

---

## 4. Publish vs AdSense timeline (locked)

```
NOW          Play Production 7 in review
             iOS 7 in review
             AdSense = Low value, do not request

TODAY        Optional: design-system chrome PR that does not touch /about
             Optional: *at most* 1–2 already-drafted guides if quality is real
             Forbidden: 600-page publish + Request review

THIS WEEK    Up to 5 real guides live. Search Console: thin set still noindexed.
             Sitemap stays the short quality list.

WHEN PLAY
IS PUBLIC    Soft-GO announcement rules still apply (≥48h, honest copy).
             Still no AdSense request on the same day.

FIRST WEEK
OF OCTOBER   Request review **once**, only if:
             - new guides are indexed
             - thin URLs still noindex
             - /about still count-free
             - we did not publish a same-week content dump
             One click. No daily pokes.

G1 OPENS     First AdSense *payment report*, not the approval email.
```

Do not treat “articles are up” as “apply for AdSense.” Google wants sustained unique value **and** user interest. A Monday flood plus a Tuesday request reads as scaled content.

---

## 5. Arena task list (priority order)

1. Confirm production web still gates apps at the **route** (`X-Whisco-Store`), not in `cached.ts`.  
2. Confirm `/about` has **no** live grid and **no** 500/14k/615 counts.  
3. Confirm thin-URL `noindex` + short sitemap still deployed. Paste proof, do not “fix” by expanding the sitemap.  
4. If founder says go on chrome: implement Design System tokens on existing templates. No new catalog app.  
5. Wire `/guides` template so Desk drafts can land as MDX without a homepage redesign.  
6. Do **not** generate 600 article files.  
7. Do **not** Request AdSense or touch Play Console.

---

## 6. Founder-only (not Arena)

- Play / Apple / AdSense buttons.  
- Announce “on Google Play” only after a **non-tester** can install `tv.whisco.app`.  
- OFT Launch Week only after Play public ≥48h.  
- Filmhub: still don’t walk in with open store refusals.

*Brief 21 Sep 2026 07:45. Supersedes “ship 600 today.” Cadence is 2 guides/week after a 5-pack, not a dump.*
