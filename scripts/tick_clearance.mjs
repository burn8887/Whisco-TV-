/**
 * TICK CLEARANCE — the human act that lets a row into the App Store build.
 *
 * The store lock is explicit: `clearedForApp` may only be set true by a person, with
 * evidence, deliberately, one row at a time. No cron and no automation may do it.
 * This script exists so that the founder's tick is an explicit, auditable command
 * rather than an ad-hoc database edit — but the decision is still his, and the
 * script refuses to run without his name attached.
 *
 * It shows the row, its evidence link and its source before writing anything, and it
 * is a dry run unless --apply is passed.
 *
 * Usage:
 *   node scripts/tick_clearance.mjs --live  <channelId>  --by "Ali"
 *   node scripts/tick_clearance.mjs --title <slugOrId>   --by "Ali"
 *   ... add --apply to actually write.
 *   node scripts/tick_clearance.mjs --show-live      # list rows awaiting a tick
 */
import { PrismaClient } from "@prisma/client";

const argv = process.argv;
const APPLY = argv.includes("--apply");
const argOf = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
};

const liveId = argOf("--live");
const titleRef = argOf("--title");
const by = argOf("--by");
const showLive = argv.includes("--show-live");

function requireBy() {
  if (!by || by.trim().length < 2) {
    throw new Error('refusing to clear without --by "<your name>" — a tick must be attributable.');
  }
}

async function main() {
  const prisma = new PrismaClient();

  if (showLive) {
    const rows = await prisma.channel.findMany({
      where: { sourceKind: "youtube-live" },
      select: { id: true, name: true, streamUrl: true, evidenceUrl: true, clearedForApp: true, clearedBy: true },
      orderBy: { name: "asc" },
    });
    console.log(`  App-Store live rows: ${rows.length}`);
    for (const r of rows) {
      console.log(`\n  ${r.name}`);
      console.log(`     id          ${r.id}`);
      console.log(`     streamUrl   ${r.streamUrl}`);
      console.log(`     evidence    ${r.evidenceUrl}`);
      console.log(`     cleared     ${r.clearedForApp}${r.clearedBy ? ` (by ${r.clearedBy})` : ""}`);
    }
    const titles = await prisma.title.findMany({
      where: { sourceKind: "archive-org", clearedForApp: false, isActive: true, streamUrl: { contains: "archive.org" } },
      select: { id: true, slug: true, name: true, streamUrl: true, clearedForApp: true },
      orderBy: { name: "asc" },
      take: 200,
    });
    console.log(`\n  archive.org titles not cleared: ${titles.length} (showing the short list only if small)`);
    if (titles.length <= 12) {
      for (const t of titles) console.log(`     ${t.slug}  ${t.id}  ${t.streamUrl}`);
    }
    await prisma.$disconnect();
    return;
  }

  if (liveId) {
    requireBy();
    const row = await prisma.channel.findUnique({
      where: { id: liveId },
      select: { id: true, name: true, streamUrl: true, evidenceUrl: true, rightsBasis: true, clearedForApp: true, sourceKind: true },
    });
    if (!row) throw new Error(`no channel with id ${liveId}`);
    console.log(`  ${row.name}`);
    console.log(`     streamUrl  ${row.streamUrl}`);
    console.log(`     evidence   ${row.evidenceUrl}`);
    console.log(`     rights     ${row.rightsBasis}`);
    console.log(`     currently  cleared=${row.clearedForApp}`);
    if (APPLY) {
      await prisma.channel.update({
        where: { id: liveId },
        data: { clearedForApp: true, clearedAt: new Date(), clearedBy: by },
      });
      console.log(`  ✓ CLEARED by ${by}`);
    } else {
      console.log(`  dry run — would clear by "${by}". Add --apply to write.`);
    }
    await prisma.$disconnect();
    return;
  }

  if (titleRef) {
    requireBy();
    const row = await prisma.title.findFirst({
      where: { OR: [{ id: titleRef }, { slug: titleRef }] },
      select: { id: true, slug: true, name: true, streamUrl: true, evidenceUrl: true, rightsBasis: true, clearedForApp: true },
    });
    if (!row) throw new Error(`no title matching ${titleRef}`);
    console.log(`  ${row.name}`);
    console.log(`     id         ${row.id}`);
    console.log(`     slug       ${row.slug}`);
    console.log(`     mp4 URL    ${row.streamUrl}`);
    console.log(`     evidence   ${row.evidenceUrl}`);
    console.log(`     rights     ${row.rightsBasis}`);
    console.log(`     currently  cleared=${row.clearedForApp}`);
    if (APPLY) {
      await prisma.title.update({
        where: { id: row.id },
        data: { clearedForApp: true, clearedAt: new Date(), clearedBy: by },
      });
      console.log(`  ✓ CLEARED by ${by}`);
    } else {
      console.log(`  dry run — would clear by "${by}". Add --apply to write.`);
    }
    await prisma.$disconnect();
    return;
  }

  console.log("  nothing to do. Try --show-live, --live <id>, or --title <slug>.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("failed:", e.message);
  process.exitCode = 1;
});
