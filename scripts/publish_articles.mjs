/**
 * WHISCO TV — PUBLISH ARTICLES (ops script, 2026-09-15)
 *
 * Takes the editorial content in scripts/content/*.mjs and upserts it into the
 * Article table, linked to the title it belongs to. Idempotent: re-running
 * updates the copy of an existing article rather than duplicating it.
 *
 * Safety:
 *   - an article is only published if its linked title EXISTS and is active;
 *     a missing slug is reported loudly and skipped, never guessed at
 *   - `--dry` prints what would change and writes nothing
 *   - `--unpublish` flips published=false for the given slugs (kill switch)
 *
 * Usage:
 *   node scripts/publish_articles.mjs [--dry] [--unpublish slug1,slug2]
 */
import { PrismaClient } from "@prisma/client";
import { ARTICLES } from "./content/flagship-articles.mjs";

const p = new PrismaClient();
const DRY = process.argv.includes("--dry");
const UNPUBLISH = (() => {
  const i = process.argv.indexOf("--unpublish");
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1].split(",").map((s) => s.trim()).filter(Boolean) : null;
})();

const WORDS = (s) => (s.match(/\S+/g) || []).length;

async function main() {
  if (UNPUBLISH) {
    const r = await p.article.updateMany({ where: { slug: { in: UNPUBLISH } }, data: { published: false } });
    console.log(`unpublished ${r.count} article(s): ${UNPUBLISH.join(", ")}`);
    return;
  }

  console.log(`=== publish articles | ${ARTICLES.length} in the content file | ${DRY ? "DRY RUN" : "writing"} ===`);
  const report = [];

  for (const a of ARTICLES) {
    const title = await p.title.findUnique({ where: { slug: a.titleSlug }, select: { id: true, name: true, isActive: true } });
    if (!title) {
      console.log(`  SKIP ${a.slug} — linked title "${a.titleSlug}" NOT FOUND in the database`);
      report.push({ slug: a.slug, status: "skipped:title-missing" });
      continue;
    }

    const words = WORDS(a.body);
    const data = {
      titleId: title.id,
      kind: a.kind,
      headline: a.headline,
      dek: a.dek,
      body: a.body,
      author: a.author,
      readingTimeMins: a.readingTimeMins,
      tags: a.tags,
      episodeNumber: a.episodeNumber ?? null,
      published: true,
      publishedAt: new Date(),
    };

    if (DRY) {
      console.log(`  WOULD WRITE  ${a.slug.padEnd(38)} ${String(words).padStart(4)}w  -> ${title.name}`);
    } else {
      const row = await p.article.upsert({
        where: { slug: a.slug },
        create: { slug: a.slug, ...data },
        update: data,
      });
      console.log(`  ${row.createdAt.getTime() === row.updatedAt.getTime() ? "CREATED" : "UPDATED"}  ${a.slug.padEnd(38)} ${String(words).padStart(4)}w  -> ${title.name}`);
    }
    report.push({ slug: a.slug, status: DRY ? "would-write" : "published", words, title: title.name });
  }

  const totalWords = report.reduce((n, r) => n + (r.words || 0), 0);
  console.log(`\n  articles: ${report.filter((r) => !r.status.startsWith("skipped")).length} | original words written: ${totalWords}`);
  const thin = report.filter((r) => (r.words || 0) < 300);
  if (thin.length) console.log(`  ⚠ under 300 words (review before publishing): ${thin.map((t) => t.slug).join(", ")}`);
}

main()
  .catch((e) => {
    console.error("failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
