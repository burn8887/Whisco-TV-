# One-time handoff prompt — AdSense API access (2026-09-14)

Written to be pasted to the previous agent. Founder-approved as a **one-time exception**:
that agent acts on Google Cloud only, for this task only.

---

**TASK — one-time exception, Google Cloud only. Do NOT touch the website, the git repo, or
any other Google resource.**

Finish AdSense read-only API access for Whisco TV. Context, verified today:

- An OAuth client named **`Whisco Ops CLI`** already exists. Its client ID begins **`1030975964145-`**
  — that number is the **project number** of the project that owns it. Find that project
  (IAM & Admin → Settings shows "Project number"); it may not be the one you remember.
- Redirect URI `https://developers.google.com/oauthplayground` was already set on that client,
  and a test user was added **in the wrong project** (`whisco-gcc-geo`) — clean that up.

1. Work in the project whose **Project number is `1030975964145`**. Confirm `Whisco Ops CLI` is
   listed under **Google Auth Platform → Clients**. If it is not, locate the project that has it.
2. Enable **AdSense Management API** (APIs & Services → Library) in that same project.
3. **Google Auth Platform → Branding** — fill every required field:
   App name `Whisco TV Ops` · support + developer contact `burn8887@gmail.com` ·
   homepage `https://www.whisco.tv` · privacy `https://www.whisco.tv/privacy` ·
   terms `https://www.whisco.tv/terms` · authorised domain `whisco.tv`.
   **Do not upload a logo** — a logo triggers Google verification requirements.
4. **Audience**: add test user `burn8887@gmail.com`; remove it from `whisco-gcc-geo` if you added
   it there; then **Publish app** → confirm. **Do not start verification.**
5. Ensure `Whisco Ops CLI` is a **Web application** client with redirect URI
   `https://developers.google.com/oauthplayground` exactly.
6. Obtain a **refresh token for `burn8887@gmail.com`** with the single scope
   `https://www.googleapis.com/auth/adsense.readonly` (`access_type=offline`, `prompt=consent`).
   If a browser consent is needed, send the founder **one URL** and ask him to paste back the
   `code` value. **Service accounts do not work with the AdSense API — do not attempt one.**
7. **Verify before handing over:** exchange the refresh token and call
   `GET https://adsense.googleapis.com/v2/accounts` — it must return **HTTP 200**.
8. Hand back **only**: a file named **`adsense-oauth.json`** containing
   `{"client_id","client_secret","refresh_token"}`, plus the HTTP result from step 7.
   Write the values to the file — **never print the client secret or refresh token in chat.**

**Do not:** create service-account keys (an org policy blocks it), change org policies, start
Google's verification process, or modify any resource outside the list above. Then stop.

---

## Fallback if that agent cannot complete it

The manual path is already documented and half-done (guide: `docs/business/AdSense_API_Access_Setup.md`):
only the Branding page, the publish click, and the token exchange remain. Either route ends at the
same file, checked by `python3 asc/check_adsense.py`.
