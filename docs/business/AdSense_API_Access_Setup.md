# AdSense API access — step by step (2026-09-14)

**Why:** the AdSense site review state (Requires review / Getting ready / Ready / Needs attention) and any policy alerts are only visible by clicking around the Console. The API exposes the same state machine, so "is it ready yet?" becomes a command I can run, and we get told the moment the site flips to **Ready**.

## Read this first — three verified facts (checked 2026-09-14, not assumed)

1. **Service accounts do not work for AdSense.** Google's AdSense Management API getting-started says plainly *"Service Accounts are not supported"* — the API serves protected user data. AdSense user management also can't accept one, because that flow requires the invitee to accept an email invitation.
   *Empirically confirmed:* signing a JWT with our existing service-account key and calling `adsense.googleapis.com/v2/accounts` returns `403 PERMISSION_DENIED` — the key and scope are fine, the account simply has no AdSense identity.
2. **The OAuth Playground's own credential is a trap.** Its page states: *"The OAuth Playground will automatically revoke refresh tokens after 24h. You can avoid this by specifying your own application OAuth credentials."* So we use **our own OAuth client** in the Playground — that is what makes the token durable.
3. **The API cannot request a review.** There is no review-request endpoint — `accounts.sites` is read-only. **The "Request review" click stays yours**; what changes is that I can tell you the exact moment it's worth clicking, and detect the outcome within minutes instead of you checking daily.

## What the token gives me (and does not)

| Can | Cannot |
|---|---|
| Read site state: `REQUIRES_REVIEW` / `GETTING_READY` / `READY` / `NEEDS_ATTENTION` | Request a review (no such API — your click) |
| Read policy alerts and warnings | Change any setting |
| Read earnings/impressions reports once live | Touch payments or billing |
| Detect approval within minutes | Bypass review in any way |

Scope requested is **`https://www.googleapis.com/auth/adsense.readonly`** — read-only, deliberately.

---

## Part A — Google Cloud (about 4 minutes)

Use the **same project that already holds `whisco-agent`** (the project the GSC/Play service account lives in). Easiest way there: **https://console.cloud.google.com** → project selector at the top → pick the project that is *not* `whisco-gcc-geo`.

1. **Enable the API.** **APIs & Services → Library** → search **`AdSense Management API`** → open it → **Enable**.
   *(The API must be enabled in the project that owns the OAuth client, or every call fails with "has not been used in project … or it is disabled".)*
2. **Consent screen / Google Auth Platform.** Open **APIs & Services → Google Auth Platform** (the old "OAuth consent screen" menu item was replaced in 2024; the direct link is **https://console.cloud.google.com/auth/audience** — check the project selector says your project).
   - If it isn't configured yet: click **Get started** and run the 4-step wizard → App name **`Whisco TV Ops`**, support email = your address, **User type: External** → Create.
   - **Audience tab → Test users → + Add users → add `burn8887@gmail.com` → Save.**
     ⚠️ **Do not skip this.** An app in *Testing* status is limited to listed test accounts; without it, authorizing fails with **"Error 403: access_denied — Access blocked: Whisco TV Ops has not completed the Google verification process. This app can only be accessed by developer-approved test accounts."** Adding the test user takes effect immediately.
   - **Complete the Branding page first — "Publish app" is disabled until you do.** Google Auth Platform → **Branding** → fill every field it marks required:
     - App name: **Whisco TV Ops**
     - User support email: **burn8887@gmail.com**
     - App homepage: **https://www.whisco.tv**
     - Privacy policy: **https://www.whisco.tv/privacy**
     - Terms of service: **https://www.whisco.tv/terms**
     - Authorised domain: **whisco.tv**
     - Developer contact email: **burn8887@gmail.com**
     - ⚠️ **Do not upload a logo.** A logo is what pushes an app into Google's verification requirements; without one, publishing stays verification-free for a single-user ops client. (Verified live 2026-09-14: all four URLs return 200.)
   - **Then Audience tab → Publishing status → Publish app → Confirm ("push to production?").**

   ### Which project am I actually in? (check before any of the above)
   An OAuth client's ID begins with the **project number** that owns it. Ours is **`1030975964145`**. If the project selector does not match, every fix lands in the wrong project:
   - **Google Auth Platform → Clients** — is **`Whisco Ops CLI`** listed? If yes, this is the right project.
   - If not, switch projects in the top selector and check again; or confirm by opening **IAM & Admin → Settings** in each candidate project and comparing **Project number** to `1030975964145`.
   - The project must also have the **AdSense Management API enabled** (Part A step 1) — the API and the OAuth client have to live in the same project.
     *Two reasons, both real: (a) apps left in Testing expire refresh tokens every **7 days**, while published apps' tokens persist; (b) it removes the test-account restriction entirely. If Google shows "Needs verification", **do not start verification** — unverified apps can still be authorized by the owner through the "Advanced → Go to … (unsafe)" link, and verification is unnecessary for a single-user ops client.*
3. **Create the OAuth client.** **APIs & Services → Credentials → + Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: **`Whisco Ops CLI`**
   - **Authorized redirect URIs → Add URI** → paste exactly:
     ```
     https://developers.google.com/oauthplayground
     ```
   - **Create** → copy the **Client ID** and **Client secret** it shows.

## Part B — mint the refresh token (about 2 minutes)

4. Open **https://developers.google.com/oauthplayground/**
5. Click the **gear icon** (top right) → tick **“Use your own OAuth credentials”** → paste the **Client ID** and **Client secret** from step 3 → close the panel.
   *Leave the other settings alone — “Access type: Offline” and “Force prompt: Consent Screen” are the defaults and are what make a refresh token come back.*
6. **Step 1** — in the **“Input your own scopes”** box, paste:
   ```
   https://www.googleapis.com/auth/adsense.readonly
   ```
   Click **Authorize APIs** → sign in as the Google account that owns AdSense → if you see *“Google hasn’t verified this app”*, click **Advanced → Go to Whisco TV Ops (unsafe)** → **Continue/Allow**.
7. **Step 2** — click **Exchange authorization code for tokens**. A **Refresh token** now appears. Copy it.

## Part C — hand it over (1 minute)

8. Create a plain text file named **`adsense-oauth.json`** containing exactly this, with your three values:

```json
{
  "client_id": "PASTE_CLIENT_ID_HERE",
  "client_secret": "PASTE_CLIENT_SECRET_HERE",
  "refresh_token": "PASTE_REFRESH_TOKEN_HERE"
}
```

9. **Attach that file to your next message** (don't paste the values into the chat text — same practice as the succession pack).

**What I do with it:** move it to `/home/user/.keys/adsense-oauth.json` with `600` permissions, **delete the upload**, run `python3 asc/check_adsense.py`, and report the state table. As always: never committed, never echoed. (`.keys/` is gitignored; `git status` is checked clean after every credential write.)

## Troubleshooting — errors seen in practice

| Symptom | Cause | Fix |
|---|---|---|
| **`Error 403: access_denied` — "has not completed the Google verification process… can only be accessed by developer-approved test accounts"** | App is in **Testing** status and the signed-in account is not a listed test user | Google Auth Platform → **Audience** → add **`burn8887@gmail.com`** under **Test users**; then **Publish app**. (Hit for real on 2026-09-14 — the first version of this guide wrongly said to skip Test users.) |
| *"Google hasn't verified this app"* after a successful publish | Normal for a published app requesting a sensitive scope | Click **Advanced → Go to Whisco TV Ops (unsafe)** → Continue. Expected on every fresh authorization for an unverified app. |
| **`401 Unauthorized` / `{"error":"unauthorized_client"}` at "Exchange authorization code for tokens"** | The code was issued to **our** client (the consent URL carried our client_id) but the Playground tried to redeem it with the **Playground's own** client — the gear panel was never set to "Use your own OAuth credentials". A code is only redeemable by the client it was issued to. | Either (a) set the gear panel to our client **before** authorizing, or (b) simpler: send the fresh `code` to the exec and let it redeem server-side with our client secret — no Playground config, and no 24-hour revocation risk. |
| `redirect_uri_mismatch` | The redirect URI is not exactly right | Client must list **`https://developers.google.com/oauthplayground`** verbatim, no trailing slash |
| Token stops working after ~7 days | The app stayed in **Testing** | Publish the app, then re-run Part B to mint a fresh token |
| *"AdSense Management API has not been used in project … or it is disabled"* | API not enabled in the project that owns the OAuth client | Enable it there (Part A step 1) |

## Revoking, any time

- **Access:** https://myaccount.google.com/permissions → **Whisco TV Ops** → **Remove access**.
- **The client itself:** Cloud Console → Credentials → delete **Whisco Ops CLI**.

Either one kills my access instantly; deleting the credential file on our side is immediate too.

## What I'll run and what you'll see

```bash
python3 asc/check_adsense.py     # lives at /home/user/asc/ — workspace ops tooling,
                                 # kept out of the repo like the Apple/GSC/Play helpers
```

Prints: the AdSense account(s), every site with its state and the plain-English meaning, and any policy alerts.

Expected right now — the site is in review, submitted ~21 Aug for `whisco.tv`. Whatever it says, it becomes a line I can check daily without you touching anything.
