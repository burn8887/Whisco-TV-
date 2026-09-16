/**
 * STAGE CLASS B VOD ROWS — the four Prelinger shorts, with their rights evidence.
 *
 * Scope is deliberately tiny. The founder's rule: do NOT clear the 492 archive
 * public-domain rows — the iOS build carries these Prelinger shorts only. So this
 * script touches four slugs and refuses to touch anything else.
 *
 * It also fixes the one genuine data defect the codec audit turned up: the
 * `word-to-the-wives-a` row pointed at `Wordtoth1955_edit.mp4`, which is MPEG-4
 * Part 2 — iOS decodes its audio and shows no picture. The founder confirmed that
 * on his own device. It now points at `Wordtoth1955.mp4`, which is H.264.
 *
 * It never writes clearedForApp. Clearing stays a human act.
 *
 * Usage: node scripts/stage_class_b_vod.mjs [--apply]
 */
import { PrismaClient } from "@prisma/client";

const APPLY = process.argv.includes("--apply");

const ITEM_PAGE = (id) => `https://archive.org/details/${id}`;
const RIGHTS_BASIS = (id, text) =>
  `${text} — declared on the item's own Internet Archive page (${ITEM_PAGE(id)}). Prelinger Archives.`;

const ROWS = [
  {
    slug: "american-look-part-i",
    identifier: "American1958",
    file: "American1958.mp4",
    rights: 'Public Domain',
  },
  {
    slug: "word-to-the-wives-a",
    identifier: "Wordtoth1955",
    file: "Wordtoth1955.mp4", // H.264. NOT Wordtoth1955_edit.mp4 (MPEG-4 Part 2, audio-only on iOS)
    rights: 'Public Domain',
  },
  {
    slug: "park-conscious",
    identifier: "ParkCons1938",
    file: "ParkCons1938.mp4",
    rights: 'Public Domain',
  },
  {
    slug: "all-about-polymorphics",
    identifier: "AllAboutPolymorphics",
    file: "AllAboutPolymorphics.mp4",
    rights: 'Public Domain',
  },
];

const ALLOWED_SLUGS = new Set(ROWS.map((r) => r.slug));

async function main() {
  const prisma = new PrismaClient();
  let fixed = 0;

  for (const row of ROWS) {
    if (!ALLOWED_SLUGS.has(row.slug)) throw new Error(`slug out of scope: ${row.slug}`);

    const title = await prisma.title.findUnique({
      where: { slug: row.slug },
      select: { id: true, name: true, streamUrl: true, clearedForApp: true, evidenceUrl: true, rightsBasis: true },
    });
    if (!title) {
      console.log(`  ⚠ ${row.slug}: not in database — skipped`);
      continue;
    }

    const wanted = `https://archive.org/download/${row.identifier}/${row.file}`;
    const urlChanged = title.streamUrl !== wanted;

    console.log(`  ${title.name}`);
    console.log(`     id            ${title.id}`);
    console.log(`     mp4 URL       ${wanted}${urlChanged ? "   ← CHANGED" : "   (already correct)"}`);
    if (urlChanged) console.log(`        was:       ${title.streamUrl}`);
    console.log(`     rightsBasis   ${RIGHTS_BASIS(row.identifier, row.rights)}`);
    console.log(`     clearedForApp ${title.clearedForApp}  ← untouched, stays yours to set`);

    const payload = {
      streamUrl: wanted,
      evidenceUrl: ITEM_PAGE(row.identifier),
      rightsBasis: RIGHTS_BASIS(row.identifier, row.rights),
      sourceKind: "archive-org",
    };
    if ("clearedForApp" in payload) throw new Error("refusing to write clearedForApp");

    if (APPLY) await prisma.title.update({ where: { id: title.id }, data: payload });
    if (urlChanged) fixed++;
  }

  console.log(`\n  ${APPLY ? "applied" : "would apply"} · streamUrl corrections: ${fixed}`);
  if (!APPLY) console.log("  dry run — nothing written. Re-run with --apply.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("failed:", e.message);
  process.exitCode = 1;
});
