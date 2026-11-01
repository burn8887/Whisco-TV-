# salimdrive.com — static site source

Three static pages and one stylesheet, ready to publish at **https://www.salimdrive.com**:

| File | Served at |
| --- | --- |
| `index.html` | `/` |
| `privacy.html` | `/privacy` (or `/privacy.html`) |
| `support.html` | `/support` (or `/support.html`) |
| `style.css` | `/style.css` |

Both stores require a **publicly reachable** privacy-policy URL and a support contact before review.
Until the pages below are live at the domain, store submission cannot proceed.

## Current status — not published

As of 20 October 2026, `salimdrive.com` and `www.salimdrive.com` do not resolve in DNS. The Founder
has chosen this domain, but no record, host or TLS certificate has been verified. **Do not paste the
URL into Play Console or App Store Connect until the pages load over HTTPS in a private browser
window.**

## Before publishing

Replace every highlighted placeholder. The checker refuses to pass while any remain.

| Placeholder | Needed value |
| --- | --- |
| `OPERATING ENTITY` | Owner of the app records — **filled**: Ali Albaharna |
| `SUPPORT EMAIL` | Monitored support address on the domain, e.g. `support@salimdrive.com` |
| `PRIVACY EMAIL` | Address for privacy requests, e.g. `privacy@salimdrive.com` |
| `EFFECTIVE DATE` | Date the policy takes effect |
| `LAST UPDATED` | Date of the last substantive edit |
| `YEAR` | Current year for the footer copyright |

Also confirm:

- The privacy text matches what the **shipping build** actually does. If live feed, accounts,
  payments or reporting are added, update it first.
- The Arabic tagline has been read aloud by a native Bahraini/Gulf speaker.
- The support address is actually monitored. An unmonitored address is worse than none.

## Check

```sh
python3 salim-workspace/tools/check_site.py salim-workspace/site
```

With `--allow-placeholders` it reports the placeholders instead of failing, which is useful while
drafting. Tests: `python3 -m unittest discover -s salim-workspace/tools -p 'test_*.py'`.

## Deploy

Any static host works (Vercel, Cloudflare Pages, GitHub Pages with a custom domain, or the existing
hosting provider). Publishing to production is a separate decision that requires the Founder's
explicit approval; this repository contains the source only. Suggested routing:

- `/` → `index.html`
- `/privacy` → `privacy.html`
- `/support` → `support.html`

Keep `https://www.salimdrive.com/privacy` stable once submitted to the stores — a broken or moved
policy URL is a common cause of review rejection and later removal.
