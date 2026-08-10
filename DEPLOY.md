# Deploying Whisco TV to Vercel (free) — step-by-step

This gets you a permanent public URL (e.g. `https://whisco-tv.vercel.app`)
you can open on your Android phone (or share with anyone).

You'll need: a free **GitHub** account (you have one ✅) and a free
**Vercel** account (sign up with your GitHub account — one click, no
credit card needed) and a free **Neon** Postgres database.

---

## 1. Create a free Postgres database (Neon)

1. Go to https://neon.tech and click **Sign up** (you can sign up with GitHub).
2. Create a new project (any name, e.g. `whisco-tv`).
3. On the project dashboard, copy the **connection string** — it looks like:
   `postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require`
4. Keep this tab open — you'll need this URL twice (once now, once in Vercel).

## 2. Push this code to a new GitHub repo

On your own computer (with [Git](https://git-scm.com/downloads) and
[Node.js 20+](https://nodejs.org) installed):

```bash
unzip whisco-tv.zip
cd iptv-app

git init
git add .
git commit -m "Initial commit — Whisco TV"
```

Then on GitHub.com: click **New repository** (top right → "+"), name it
`whisco-tv`, leave it empty (no README/license), and click **Create**.
GitHub will show you commands like this — run them:

```bash
git remote add origin https://github.com/<your-username>/whisco-tv.git
git branch -M main
git push -u origin main
```

## 3. Set up the database schema + seed data (one-time, from your computer)

Still in the `iptv-app` folder:

```bash
cp .env.example .env
# open .env and paste your real Neon connection string as DATABASE_URL
# also set AUTH_SECRET to a random string, e.g. run: openssl rand -base64 32

npm install
npx prisma db push       # creates all the tables in your Neon database
npm run db:seed          # loads 225 live channels, 164 VOD titles, demo users
```

You only need to do this once (or again later if you want to reset the demo data).

## 4. Deploy on Vercel

1. Go to https://vercel.com/new and sign in with GitHub.
2. Click **Import** next to your `whisco-tv` repo.
3. Before deploying, expand **Environment Variables** and add:
   - `DATABASE_URL` → your Neon connection string (same one as above)
   - `AUTH_SECRET` → the same random string you used in `.env`
4. Click **Deploy**. Wait ~1–2 minutes.
5. You'll get a URL like `https://whisco-tv-yourname.vercel.app` — that's
   your permanent link.

## 5. Open it on your Android phone

Just open that `https://...vercel.app` URL in Chrome (or any browser) on
your phone. It's fully responsive. Log in with:
- Viewer: `demo@whiscotv.demo` / `Demo123!`
- Admin: `admin@whiscotv.demo` / `Admin123!`

Optional: on Android Chrome, tap the **⋮ menu → "Add to Home screen"** to
install it like an app icon on your phone.

---

## Notes

- Every time you `git push` new changes to `main`, Vercel automatically
  redeploys.
- To wipe/reset demo data later, just re-run `npm run db:seed` from your
  computer (with `.env` pointed at your Neon DB).
- Reminder: this uses placeholder streams and generated artwork. Before
  real customers use it, swap `Channel.streamUrl` / `Title.streamUrl` /
  `Episode.streamUrl` for your licensed content, and replace the mock
  checkout in `src/lib/actions/billing.ts` with a real payment provider.
