import { getNewThisWeek } from "@/lib/cached";

// RSS 2.0 feed of newly added content. Lets readers, aggregators, and
// community tools pick up Whisco TV additions automatically.
export const revalidate = 3600;

const SITE = "https://whisco.tv";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const data = await getNewThisWeek();
  const items = data.groups
    .flatMap((g) => g.titles.map((t) => ({ ...t, collection: g.collection })))
    .slice(0, 50)
    .map(
      (t) => `    <item>
      <title>${esc(t.name)} — free on Whisco TV</title>
      <link>${SITE}/title/${t.slug}</link>
      <guid isPermaLink="true">${SITE}/title/${t.slug}</guid>
      <category>${esc(t.collection)}</category>
      <pubDate>${new Date(t.createdAt).toUTCString()}</pubDate>
      <description>${esc(
        (t.synopsis || `${t.name} — now streaming free on Whisco TV.`).slice(0, 300)
      )}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Whisco TV — New This Week</title>
    <link>${SITE}/new</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>New free movies, series and episodes added to Whisco TV — live TV and on-demand for Gulf expat communities, 100% free.</description>
    <language>en</language>
    <lastBuildDate>${new Date(data.generatedAt).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
