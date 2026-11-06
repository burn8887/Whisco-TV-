// Weekly AdSense readiness scan (Nov 2026 AdSense recovery plan).
// Crawls the pages an AdSense reviewer reaches and reports, in one GitHub Issue
// labelled "adsense-readiness", whether the gate in docs/ops/ADSENSE_RECOVERY.md
// passes. Never fails the workflow for findings (the Issue is the signal), so it
// does not flood the inbox; it exits non-zero only if the scan itself breaks.
// No dependencies: Node 20+ fetch.

const BASE = "https://www.whisco.tv";
const UA = "WhiscoReadinessScan/1.0 (+https://www.whisco.tv/about)";
const TITLE_SAMPLE = 100;
const PIRACY = [/online\s+free/i, /full\s+movie/i, /full\s+series/i, /\bwatch\b[^<]{0,80}\bfree\b/i];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  try {
    const r = await fetch(url, { redirect: "follow", headers: { "user-agent": UA } });
    return { url, status: r.status, body: await r.text() };
  } catch (e) {
    return { url, status: 0, body: "", error: String(e) };
  }
}
const pick = (html, re) => (html.match(re) || [])[1] || "";
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const headTitle = (h) => decode(pick(h, /<title[^>]*>([^<]*)<\/title>/i));
const metaDesc = (h) => decode(pick(h, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i));
const links = (h, prefix) => [...new Set([...h.matchAll(new RegExp(`href="(${prefix}[^"#?]+)"`, "g"))].map((m) => m[1]))];
const words = (s) => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3));
const jaccard = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / (a.size + b.size - i || 1); };

async function crawl(urls, conc = 4) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: conc }, async () => {
    while (i < urls.length) { const u = urls[i++]; out.push(await get(u)); await sleep(250); }
  }));
  return out;
}

function checkPage(p, kind) {
  const f = [];
  if (p.status === 0) f.push(`unreachable (${p.error})`);
  else if (p.status >= 500) f.push(`HTTP ${p.status}`);
  else if (p.status >= 400) f.push(`HTTP ${p.status}`);
  const t = headTitle(p.body), d = metaDesc(p.body);
  if (PIRACY.some((re) => re.test(t) || re.test(d))) f.push(`piracy-style title/description: "${t.slice(0, 90)}"`);
  if (/How to watch[^<]{0,120}online free/i.test(p.body)) f.push("boilerplate 'How to watch … online free' block");
  if (/"ratingCount"\s*:/.test(p.body)) f.push("structured data carries a rating count");
  if (kind === "guide" && !/By the Whisco TV editorial team/.test(p.body)) f.push("no byline");
  return f;
}

async function adsenseStatus() {
  const { ADSENSE_CLIENT_ID: id, ADSENSE_CLIENT_SECRET: secret, ADSENSE_REFRESH_TOKEN: rt } = process.env;
  if (!id || !secret || !rt) return "not checked (AdSense API secrets not set)";
  try {
    const tok = await (await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: rt, grant_type: "refresh_token" }),
    })).json();
    const h = { authorization: `Bearer ${tok.access_token}` };
    const acc = await (await fetch("https://adsense.googleapis.com/v2/accounts", { headers: h })).json();
    const name = acc.accounts?.[0]?.name;
    if (!name) return "AdSense API returned no account";
    const sites = await (await fetch(`https://adsense.googleapis.com/v2/${name}/sites`, { headers: h })).json();
    const site = (sites.sites || []).find((s) => /whisco\.tv$/i.test(s.domain || ""));
    return site ? `${site.domain}: ${site.state}` : "whisco.tv not listed in AdSense sites";
  } catch (e) {
    return `AdSense check failed: ${String(e).slice(0, 120)}`;
  }
}

async function upsertIssue(body, pass) {
  const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repo } = process.env;
  if (!token || !repo) { console.log("(no GITHUB_TOKEN; report printed only)"); return; }
  const api = `https://api.github.com/repos/${repo}`;
  const h = { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "content-type": "application/json" };
  const open = await (await fetch(`${api}/issues?state=open&labels=adsense-readiness&per_page=5`, { headers: h })).json();
  const title = `AdSense readiness: ${pass ? "PASS" : "not ready"} (weekly scan)`;
  if (Array.isArray(open) && open.length) {
    await fetch(`${api}/issues/${open[0].number}`, { method: "PATCH", headers: h, body: JSON.stringify({ title, body }) });
    console.log(`updated issue #${open[0].number}`);
  } else {
    const r = await (await fetch(`${api}/issues`, { method: "POST", headers: h, body: JSON.stringify({ title, body, labels: ["adsense-readiness"] }) })).json();
    console.log(`opened issue #${r.number}`);
  }
}

const home = await get(`${BASE}/`);
const guidesIndex = await get(`${BASE}/guides`);
const vod = await get(`${BASE}/vod`);
const newPage = await get(`${BASE}/new`);
if (home.status !== 200 || guidesIndex.status !== 200) {
  console.error(`site not reachable: / ${home.status}, /guides ${guidesIndex.status}`);
  process.exit(1);
}
const guideUrls = links(guidesIndex.body, "/guides/").map((p) => BASE + p);
const homeTitles = links(home.body, "/title/");
let titlePaths = [...new Set([...homeTitles, ...links(vod.body, "/title/"), ...links(newPage.body, "/title/")])].sort();
if (titlePaths.length > TITLE_SAMPLE) {
  const step = titlePaths.length / TITLE_SAMPLE;
  titlePaths = Array.from({ length: TITLE_SAMPLE }, (_, k) => titlePaths[Math.floor(k * step)]);
}
const guides = await crawl(guideUrls);
const titles = await crawl(titlePaths.map((p) => BASE + p));

const rows = [];
const fail = (where, what) => rows.push(`- [ ] ${where}: ${what}`);
for (const p of [home, guidesIndex, vod, newPage]) for (const f of checkPage(p, "core")) fail(p.url, f);
for (const p of guides) for (const f of checkPage(p, "guide")) fail(p.url, f);
for (const p of titles) for (const f of checkPage(p, "title")) fail(p.url, f);

// Homepage must not route reviewers to single uploads.
const SINGLE = /\b(?:ep|episode)\.?\s*\d+|\blive\b|\bfull\s+movie\b|\[\s*eng\s*sub|\bpresented by\b/i;
const homeLinkTexts = [...home.body.matchAll(/<a[^>]+href="\/title\/[^"]+"[^>]*>([\s\S]{0,400}?)<\/a>/g)].map((m) => m[1].replace(/<[^>]+>/g, " "));
for (const t of homeLinkTexts) if (SINGLE.test(t)) fail("homepage", `links a single upload: "${t.replace(/\s+/g, " ").trim().slice(0, 80)}"`);

// Near-duplicate guides (intro word overlap).
const intros = guides.filter((g) => g.status === 200).map((g) => ({ url: g.url, w: words(metaDesc(g.body) + " " + headTitle(g.body)) }));
for (let i = 0; i < intros.length; i++) for (let j = i + 1; j < intros.length; j++) {
  const sim = jaccard(intros[i].w, intros[j].w);
  if (sim >= 0.6) fail("guides", `near-duplicate (${Math.round(sim * 100)}%): ${intros[i].url} ↔ ${intros[j].url}`);
}

const pass = rows.length === 0;
const status = await adsenseStatus();
const body = [
  `**Scan:** ${new Date().toISOString().slice(0, 16)} UTC · pages checked: ${4 + guides.length + titles.length} (${guides.length} guides, ${titles.length} title pages)`,
  `**AdSense site status:** ${status}`,
  `**Automated checks:** ${pass ? "PASS — no findings" : `${rows.length} finding(s)`}`,
  "",
  "Gate items this scan cannot see (confirm in the Monday review): database errors under 10/day for 14 days; ≥50 series write-ups and the guide merge live; four weeks since the last big template change. See docs/ops/ADSENSE_RECOVERY.md.",
  "",
  ...(pass ? [] : ["### Findings", ...rows.slice(0, 200), rows.length > 200 ? `…and ${rows.length - 200} more` : ""]),
].join("\n");
console.log(body);
if (process.env.GITHUB_STEP_SUMMARY) { const fs = await import("node:fs"); fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, body + "\n"); }
await upsertIssue(body, pass);
