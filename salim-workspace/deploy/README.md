# Upload this folder to preview Salim online

Everything here is static. No build step, no server, no environment variables.

| File | Purpose |
| --- | --- |
| `index.html` | The Salim web demonstrator, compiled to **one self-contained file** (CSS, JS and 18 fonts inlined). ~708 KiB. |
| `privacy.html` | Privacy policy, to be served at `/privacy` |
| `support.html` | Support page, to be served at `/support` |
| `_redirects` | Netlify rules mapping `/privacy` and `/support` to the files above |
| `_headers` | Netlify security headers (nosniff, referrer policy, frame options) |
| `robots.txt` | Keeps the app demo out of search results while exposing the policy pages |

## Netlify, drag-and-drop

1. Sign in to Netlify → **Add new site → Deploy manually**.
2. Drag this whole `deploy` folder onto the drop area.
3. Netlify returns a URL such as `https://random-name-123.netlify.app`.
4. Open it. The demo runs immediately — no install, no sign-in.

Check `/privacy` and `/support` on the Netlify URL: the redirects should serve the pages directly.
Those are the exact paths the stores expect at the real domain.

## Netlify, Git-connected

| Setting | Value |
| --- | --- |
| Build command | *(leave empty)* |
| Publish directory | `salim-workspace/deploy` |

The folder is committed, so no build is needed. To rebuild it locally:

```sh
python3 salim-workspace/tools/materialize.py --output /home/user/Salim-deploy
cd /home/user/Salim-deploy/apps/salim-web && npm ci
cd /home/user/Salim-deploy && python3 tools/build_deploy.py
cp deploy/* /path/to/repo/salim-workspace/deploy/
```

`build_deploy.py` rebuilds `index.html` from source, inlines the stylesheet into the two publication
pages, and refuses to finish if any page still loads an external asset. Pass
`--allow-placeholders` while the operating entity is still unfilled.

## Any other host

Upload the folder as-is to Cloudflare Pages, GitHub Pages, Vercel, S3 or ordinary shared hosting.
`_redirects` and `_headers` are Netlify-specific; on other hosts create equivalent rewrites, or link
`/privacy.html` and `/support.html` directly. If your host cannot rewrite extensionless URLs, the
store URLs must be `https://www.salimdrive.com/privacy.html` instead — decide this before submitting
to either store, because the URL cannot change later without a review risk.

## Important

- **This is a preview, not the launch.** The bundle uses fictional Bahrain data and says so.
- **The domain is not connected.** Pointing `www.salimdrive.com` at the host is a separate DNS step
  that only the founder can perform.
- **The operating entity is still a placeholder** on the policy pages. Replace it before submitting
  to Google Play or App Store Connect; `tools/check_site.py` fails until it is filled.
- **Contact addresses are real:** `support@salimdrive.com` and `legal@salimdrive.com`. They must be
  monitored before the store records go live.
