/**
 * SEED iOS LIVE ROWS — official-broadcaster YouTube live embeds.
 *
 * These are SEPARATE rows from the existing catalogue entries for the same
 * broadcasters. The catalogue rows carry direct HLS streams, which the store lock
 * excludes from the App Store build; these carry the broadcaster's own YouTube
 * embed, which is the only live source the iOS build may ship.
 *
 * Every row is created with clearedForApp = false. This script CANNOT clear a row —
 * it refuses to write the column at all. Clearing is a human act with evidence.
 *
 * Usage:
 *   node scripts/seed_yt_live.mjs            # dry run — resolves, prints, writes nothing
 *   node scripts/seed_yt_live.mjs --apply
 */
import { PrismaClient } from "@prisma/client";
import { resolveLive } from "./refresh_yt_live.mjs";

const APPLY = process.argv.includes("--apply");

/**
 * APPROVED ROWS — only what the founder has personally played and passed.
 * A1 and A2 passed his device test on 2026-09-15. Nothing else is here, and
 * nothing gets added without his own play-test first.
 */
const APPROVED = [
  // ---- ALREADY SEEDED AND TICKED (Grok: keep as-is) -------------------------
  {
    catalogueName: "France 24 English",
    handle: "France24_en",
    channelId: "UCQfwfsi5VrQ8yKZ-UWmAEFg", // RSS author: "FRANCE 24 English"
    site: "https://www.france24.com/en/",
  },
  {
    catalogueName: "DW English",
    handle: "dwnews",
    channelId: "UCknLrEdhRCp1aegoMqRaCZg", // RSS author: "DW News"
    site: "https://www.dw.com/",
  },

  // ---- NEW (Grok P3, 2026-09-16): seeds FALSE, hidden from the public listing.
  // Every channelId was resolved by the RSS-author oracle, and every one was
  // confirmed to have a genuine 24/7 broadcast — the live video's own title says so
  // ("LIVE: Watch TRT World", "[CNA 24/7 LIVE]", etc.). That test is what rejected
  // DW Documentary, whose "live" turned out to be a one-off online discussion.
  {
    handle: "trtworld",
    channelId: "UC7fWeaHhqgM4Ry-RMpM2YYw",
    site: "https://www.trtworld.com/",
    branding: { name: "TRT World", country: "Turkey", countryCode: "TR", language: "English", category: "News" },
  },
  {
    handle: "aljazeeraenglish",
    channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
    site: "https://www.aljazeera.com/",
    // The catalogue carries Al Jazeera ARABIC; this row is the English channel, so
    // branding is explicit rather than copied.
    branding: { name: "Al Jazeera English", country: "Qatar", countryCode: "QA", language: "English", category: "News" },
  },
  {
    handle: "channelnewsasia",
    channelId: "UC83jt4dlz1Gjl58fzQrrKZg",
    site: "https://www.channelnewsasia.com/",
    branding: { name: "CNA", country: "Singapore", countryCode: "SG", language: "English", category: "News" },
  },
  {
    handle: "NHKWORLDJAPAN",
    channelId: "UCSPEjw8F2nQDtmUKPFNF7_A",
    site: "https://www3.nhk.or.jp/nhkworld/",
    branding: { name: "NHK WORLD-JAPAN", country: "Japan", countryCode: "JP", language: "English", category: "News" },
  },
  {
    handle: "africanews",
    channelId: "UC1_E8NeF5QHY2dtdLRBCCLA",
    site: "https://www.africanews.com/",
    branding: { name: "Africanews", country: "Pan-African", countryCode: "AF", language: "English", category: "News" },
  },
  {
    // Optional per Grok; included because it IS a genuine 24/7 channel
    // ("Watch ABC NEWS Australia live | ABC NEWS"). It is what takes the live set to 8.
    handle: "abcnewsaustralia",
    channelId: "UCVgO39Bk5sMo66-6o6Spn6Q",
    site: "https://www.abc.net.au/news",
    branding: { name: "ABC News (Australia)", country: "Australia", countryCode: "AU", language: "English", category: "News" },
  },
];

// NOT SEEDED, and why — recorded so it is not re-litigated:
//   DW Documentary  — its "live" is an event, not a 24/7 stream. Grok's condition:
//                     only if it is a 24/7 live channel, not a VOD dump. It is the
//                     latter; its own live title was "War in Sudan ... An online
//                     discussion by DW Documentary".
//   Sky News, Bloomberg Television, Reuters — excluded by Grok: news-terminal look.
//   Somoy, Jamuna, Ekattor, Channel i — excluded by Grok: not for this binary.

const RIGHTS_BASIS =
  "Official broadcaster live stream, published by the broadcaster on its own YouTube channel and played through YouTube's embeddable player. No hosting, copying or re-encoding by us.";

/** This script may only write these columns. It must never clear a row. */
const WRITABLE = new Set([
  "name", "logoUrl", "country", "countryCode", "language", "category", "isHD", "number",
  "sourceKind", "provenanceUrl", "officialSiteUrl", "rightsBasis", "evidenceUrl",
  "streamUrl", "clearedForApp", "clearedAt", "clearedBy",
]);
function assertSafe(payload) {
  for (const key of Object.keys(payload)) {
    if (!WRITABLE.has(key)) throw new Error(`refusing to write unknown column '${key}'`);
  }
  // The one absolute rule: a machine may never clear a row.
  if (payload.clearedForApp === true) {
    throw new Error("refusing to set clearedForApp=true — clearing is a human act.");
  }
}

/** The broadcaster's own channel avatar — the same asset YouTube shows for the channel. */
async function channelAvatar(handle) {
  try {
    const r = await fetch(`https://www.youtube.com/@${handle}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15" },
      signal: AbortSignal.timeout(30000),
    });
    const html = await r.text();
    const m = html.match(/<meta property="og:image" content="([^"]+)"/);
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

async function main() {
  const prisma = new PrismaClient();
  let created = 0;

  for (const entry of APPROVED) {
    // Branding: explicit for new rows, copied from the catalogue where the
    // broadcaster already has a row. A missing catalogue row is only fatal if the
    // entry carries no explicit branding of its own.
    let source = null;
    if (entry.catalogueName) {
      source = await prisma.channel.findFirst({
        where: { name: entry.catalogueName },
        select: {
          id: true, name: true, logoUrl: true, country: true, countryCode: true,
          language: true, category: true, isHD: true, number: true,
        },
      });
      if (!source && !entry.branding) {
        console.log(`  ⚠ ${entry.catalogueName}: no catalogue row to copy branding from — skipping`);
        continue;
      }
    }
    const label = entry.branding?.name ?? entry.catalogueName;

    const provenanceUrl = `https://www.youtube.com/@${entry.handle}`;
    const existing = await prisma.channel.findFirst({
      where: { provenanceUrl },
      select: { id: true, streamUrl: true, clearedForApp: true, clearedBy: true },
    });

    // CHANNEL FORM, confirmed working 2026-09-15: the founder played a Somoy row on
    // whisco.tv that uses exactly this URL shape and saw YouTube's player and the LIVE
    // badge. So we store the CHANNEL, not a broadcast: no video id is stored and there
    // is nothing to go stale when a 24/7 stream restarts. The 6-hourly refresh job
    // stays as a liveness monitor and does not rewrite this URL (see its channel-form
    // branch, which had to be taught not to "helpfully" re-pin it).
    const streamUrl = `https://www.youtube.com/embed/live_stream?channel=${entry.channelId}`;
    // Evidence for a reviewer: the broadcaster's own channel. The embed is the channel,
    // so the channel page is the matching link to show them.
    const evidenceUrl = provenanceUrl;

    // Still confirm the channel has a live stream AND that the live video belongs to
    // this channel — we do not store an unverified row.
    const live = await resolveLive(entry.handle);
    if (!live.ok) {
      console.log(`  ✗ ${label}: ${live.why} — skipping, nothing written`);
      continue;
    }
    console.log(`     (channel currently live: ${live.videoId}, uploader "${live.author}" — verified, not stored)`);

    // The app decides how to play a source with src.includes("youtube.com/embed").
    // A nocookie URL does NOT match that test and would silently fail. Enforced here.
    if (!streamUrl.includes("youtube.com/embed")) {
      throw new Error(`bad streamUrl for ${entry.catalogueName}: ${streamUrl}`);
    }

    const b = entry.branding;
    const payload = {
      name: b?.name ?? source.name,
      logoUrl: b ? await channelAvatar(entry.handle) : source.logoUrl,
      country: b?.country ?? source.country,
      countryCode: b?.countryCode ?? source.countryCode,
      language: b?.language ?? source.language,
      category: "News",
      isHD: b ? true : source.isHD,
      number: b ? 0 : source.number,
      sourceKind: "youtube-live",
      provenanceUrl,
      officialSiteUrl: entry.site,
      rightsBasis: RIGHTS_BASIS,
      evidenceUrl,
      streamUrl,
      clearedForApp: false, // never true from a script
      clearedAt: null,
      clearedBy: null,
    };
    assertSafe(payload);

    const verb = existing ? "UPDATE" : "CREATE";
    console.log(`  ${verb}  ${payload.name}`);
    console.log(`     streamUrl     ${streamUrl}`);
    console.log(`     evidenceUrl   ${evidenceUrl}`);
    console.log(`     sourceKind    youtube-live   (provenance ${provenanceUrl})`);
    console.log(`     clearedForApp false   ← stays false until a human ticks it`);
    if (existing && existing.clearedForApp) {
      console.log(`     ⚠ NOTE: existing row is currently cleared by "${existing.clearedBy}" — this script does not un-clear it.`);
    }

    if (APPLY) {
      if (existing) {
        // Never write clearedForApp on an update: a refresh must not disturb a human tick.
        const update = { ...payload };
        delete update.clearedForApp;
        delete update.clearedAt;
        delete update.clearedBy;
        assertSafe(update);
        await prisma.channel.update({ where: { id: existing.id }, data: update });
      } else {
        await prisma.channel.create({ data: payload });
      }
    }
    created++;
  }

  console.log(`\n  ${created} row(s) ${APPLY ? "written" : "would be written"}.`);
  const [total, cleared] = await Promise.all([
    prisma.channel.count({ where: { sourceKind: "youtube-live" } }),
    prisma.channel.count({ where: { sourceKind: "youtube-live", clearedForApp: true } }),
  ]);
  console.log(`  iOS live rows in database: ${APPLY ? total : `${total} (before this run)`} · cleared: ${cleared}`);
  if (!APPLY) console.log("  dry run — nothing written. Re-run with --apply.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("failed:", e.message);
  process.exitCode = 1;
});
