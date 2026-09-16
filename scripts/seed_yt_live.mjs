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
  {
    catalogueName: "France 24 English", // reuse the catalogue row's branding fields
    handle: "France24_en",
    site: "https://www.france24.com/en/",
  },
  {
    catalogueName: "DW English",
    handle: "dwnews",
    site: "https://www.dw.com/",
  },
];

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

async function main() {
  const prisma = new PrismaClient();
  let created = 0;

  for (const entry of APPROVED) {
    const source = await prisma.channel.findFirst({
      where: { name: entry.catalogueName },
      select: {
        id: true, name: true, logoUrl: true, country: true, countryCode: true,
        language: true, category: true, isHD: true, number: true, streamUrl: true,
      },
    });
    if (!source) {
      console.log(`  ⚠ ${entry.catalogueName}: no catalogue row to copy branding from — skipping`);
      continue;
    }

    const provenanceUrl = `https://www.youtube.com/@${entry.handle}`;
    const existing = await prisma.channel.findFirst({
      where: { provenanceUrl },
      select: { id: true, streamUrl: true, clearedForApp: true, clearedBy: true },
    });

    const live = await resolveLive(entry.handle);
    if (!live.ok) {
      console.log(`  ✗ ${entry.catalogueName}: ${live.why} — skipping, nothing written`);
      continue;
    }
    const streamUrl = `https://www.youtube.com/embed/${live.videoId}`;
    const evidenceUrl = `https://www.youtube.com/watch?v=${live.videoId}`;

    // The app decides how to play a source with src.includes("youtube.com/embed").
    // A nocookie URL does NOT match that test and would silently fail. Enforced here.
    if (!streamUrl.includes("youtube.com/embed")) {
      throw new Error(`bad streamUrl for ${entry.catalogueName}: ${streamUrl}`);
    }

    const payload = {
      name: source.name,
      logoUrl: source.logoUrl,
      country: source.country,
      countryCode: source.countryCode,
      language: source.language,
      category: "News",
      isHD: source.isHD,
      number: source.number,
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
    console.log(`  ${verb}  ${source.name}`);
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
