import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Weekly live-channel discovery — keeps the Live TV lineup growing without
// manual work. Pulls the community-maintained iptv-org index, filters to our
// target audience countries/languages, verifies each candidate stream is a
// real working HLS playlist (2-hop, same standard as the health checker),
// and adds verified newcomers. Everything added here is free-to-air content
// from the public index; the exclusion list keeps sanctioned/politically
// risky broadcasters out.

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const MAX_NEW_PER_RUN = 25; // grow steadily, keep run time bounded
const TIMEOUT_MS = 8000;
const CONCURRENCY = 10;

// Target audiences (subdivision of iptv-org country files we care about)
const COUNTRY_FILES: { code: string; country: string; countryCode: string; language: string }[] = [
  { code: "in", country: "India", countryCode: "IN", language: "Hindi" },
  { code: "pk", country: "Pakistan", countryCode: "PK", language: "Urdu" },
  { code: "bd", country: "Bangladesh", countryCode: "BD", language: "Bengali" },
  { code: "ph", country: "Philippines", countryCode: "PH", language: "Filipino" },
  { code: "id", country: "Indonesia", countryCode: "ID", language: "Indonesian" },
  { code: "np", country: "Nepal", countryCode: "NP", language: "Nepali" },
  { code: "lk", country: "Sri Lanka", countryCode: "LK", language: "Sinhala/Tamil" },
  { code: "sa", country: "Saudi Arabia", countryCode: "SA", language: "Arabic" },
  { code: "ae", country: "United Arab Emirates", countryCode: "AE", language: "Arabic" },
  { code: "kw", country: "Kuwait", countryCode: "KW", language: "Arabic" },
  { code: "qa", country: "Qatar", countryCode: "QA", language: "Arabic" },
  { code: "bh", country: "Bahrain", countryCode: "BH", language: "Arabic" },
  { code: "om", country: "Oman", countryCode: "OM", language: "Arabic" },
  { code: "eg", country: "Egypt", countryCode: "EG", language: "Arabic" },
  { code: "jo", country: "Jordan", countryCode: "JO", language: "Arabic" },
  { code: "lb", country: "Lebanon", countryCode: "LB", language: "Arabic" },
  { code: "tr", country: "Turkey", countryCode: "TR", language: "Turkish" },
];

// Sanctioned / politically risky broadcasters — never add.
const EXCLUDE = /al ?manar|mayadeen|press ?tv|irib|hezbollah|al ?alam|rojava|ronahi|welat|al ?wilayah|damascus radio/i;
// Skip adult/gambling/shopping junk.
const EXCLUDE_JUNK = /xxx|adult|18\+|casino|bet\b|shopping|teleshop|infomercial/i;

async function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (WhiscoTV-Discovery)" },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

// Same 2-hop verification standard as the health checker.
async function verifyStream(url: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return false;
    const text = await res.text();
    if (!text.includes("#EXTM3U")) return false;
    if (text.includes("#EXT-X-STREAM-INF")) {
      const variant = text.split(/\r?\n/).find((l) => l.trim() && !l.startsWith("#"));
      if (variant) {
        const variantUrl = new URL(variant.trim(), res.url).toString();
        const sub = await fetchWithTimeout(variantUrl, 5000);
        if (!sub.ok) return false;
        const subText = await sub.text();
        if (!subText.includes("#EXTM3U")) return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

type Candidate = { name: string; url: string; logo: string; country: string; countryCode: string; language: string };

function parseM3u(m3u: string, meta: (typeof COUNTRY_FILES)[number]): Candidate[] {
  const out: Candidate[] = [];
  const lines = m3u.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("#EXTINF")) continue;
    const info = lines[i];
    const url = (lines[i + 1] || "").trim();
    if (!url.startsWith("http") || !url.includes(".m3u8")) continue;
    const name = (info.split(",").pop() || "").trim().replace(/\s*\((\d+p|SD|HD|FHD)\)\s*$/i, "");
    if (!name || EXCLUDE.test(name) || EXCLUDE_JUNK.test(name) || EXCLUDE.test(url)) continue;
    const logo = info.match(/tvg-logo="([^"]*)"/)?.[1] || "";
    out.push({ name, url, logo, country: meta.country, countryCode: meta.countryCode, language: meta.language });
  }
  return out;
}

async function pool<T, R>(items: T[], conc: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out = new Array(items.length);
  let next = 0;
  async function w() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(conc, items.length) }, w));
  return out;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Known channels: match by name+country OR by exact stream URL.
  const existing = await prisma.channel.findMany({ select: { name: true, country: true, streamUrl: true } });
  const knownNames = new Set(existing.map((c) => `${c.name.toLowerCase()}|${c.country}`));
  const knownUrls = new Set(existing.map((c) => c.streamUrl));

  // Rotate: pick 4 country files per run based on day-of-year so all 17 get
  // covered across the week without blowing the time budget.
  const day = Math.floor(Date.now() / 86400000);
  const picks = [0, 1, 2, 3].map((k) => COUNTRY_FILES[(day * 4 + k) % COUNTRY_FILES.length]);

  const candidates: Candidate[] = [];
  for (const meta of picks) {
    try {
      const res = await fetchWithTimeout(`https://iptv-org.github.io/iptv/countries/${meta.code}.m3u`, 15000);
      if (!res.ok) continue;
      const parsed = parseM3u(await res.text(), meta);
      for (const c of parsed) {
        if (knownUrls.has(c.url)) continue;
        if (knownNames.has(`${c.name.toLowerCase()}|${c.country}`)) continue;
        candidates.push(c);
      }
    } catch {
      /* skip country on failure */
    }
  }

  // Dedupe within batch by name
  const seen = new Set<string>();
  const unique = candidates.filter((c) => {
    const k = `${c.name.toLowerCase()}|${c.country}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Verify (2-hop) until we have MAX_NEW_PER_RUN winners.
  const added: { name: string; country: string }[] = [];
  const CHUNK = 40;
  for (let i = 0; i < unique.length && added.length < MAX_NEW_PER_RUN; i += CHUNK) {
    const batch = unique.slice(i, i + CHUNK);
    const results = await pool(batch, CONCURRENCY, async (c) => ({ c, ok: await verifyStream(c.url) }));
    for (const { c, ok } of results) {
      if (!ok || added.length >= MAX_NEW_PER_RUN) continue;
      await prisma.channel.create({
        data: {
          name: c.name,
          logoUrl: c.logo || "/logo-mark.png",
          streamUrl: c.url,
          country: c.country,
          countryCode: c.countryCode,
          language: c.language,
          category: "Entertainment",
          isHD: true,
          isFeatured: false,
          isActive: true,
          lastStatus: "ok",
          lastCheckedAt: new Date(),
        },
      });
      added.push({ name: c.name, country: c.country });
    }
  }

  if (added.length) {
    revalidatePath("/live");
    revalidatePath("/");
  }

  return NextResponse.json({
    scannedCountries: picks.map((p) => p.code),
    candidatesFound: unique.length,
    added: added.length,
    channels: added,
    totalChannels: await prisma.channel.count(),
    timestamp: new Date().toISOString(),
  });
}
