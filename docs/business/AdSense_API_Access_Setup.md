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
2. **Consent screen.** **APIs & Services → OAuth consent screen**:
   - User type **External** → **Create**
   - App name: **`Whisco TV Ops`**
   - User support email + Developer contact email: your address
   - **Save and continue** through Scopes and Test users without adding anything
   - Back on the overview, if **Publishing status** says **Testing**, click **Publish app** → **Confirm**.
     *Why it matters: apps left in Testing have refresh tokens that expire every 7 days. Published apps don't. Google may email about verification — ignore it, this app is only for your own account.*
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

## Revoking, any time

- **Access:** https://myaccount.google.com/permissions → **Whisco TV Ops** → **Remove access**.
- **The client itself:** Cloud Console → Credentials → delete **Whisco Ops CLI**.

Either one kills my access instantly; deleting the credential file on our side is immediate too.

## What I'll run and what you'll see

```bash
python3 asc/check_adsense.py
```

Prints: the AdSense account(s), every site with its state and the plain-English meaning, and any policy alerts.

Expected right now — the site is in review, submitted ~21 Aug for `whisco.tv`. Whatever it says, it becomes a line I can check daily without you touching anything.
