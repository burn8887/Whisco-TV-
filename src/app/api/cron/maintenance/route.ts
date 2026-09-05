import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { pingIndexNow } from "@/lib/indexnow";

// Weekly janitor — keeps the catalog fresh-feeling and tidy without human
// intervention:
//  1. Ages out stale "NEW" badges (isNew > 14 days since createdAt).
//  2. Prunes channels dead for a long stretch (inactive + 8+ consecutive
//     failures) so the DB doesn't accumulate corpses — they were already
//     hidden from viewers; this is just hygiene. VOD titles are never
//     deleted automatically (geo-hidden ones may come back).
//  3. Rotates "Trending": always the most recently-added active titles from
//     high-interest collections, so the homepage changes weekly.
//  4. Emits a full stats report (the workflow log doubles as a weekly
//     operations report).

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);

  // 1. Age out NEW badges
  const agedNew = await prisma.title.updateMany({
    where: { isNew: true, createdAt: { lt: twoWeeksAgo } },
    data: { isNew: false },
  });

  // 2. Prune long-dead channels (hidden + failing for 8+ consecutive checks)
  const pruned = await prisma.channel.deleteMany({
    where: { isActive: false, failCount: { gte: 8 } },
  });

  // 3. Rotate trending: newest active titles from spotlight collections
  await prisma.title.updateMany({ where: { isTrending: true }, data: { isTrending: false } });
  // Diversity guarantee: round-robin newest titles ACROSS spotlight
  // collections (raw newest-16 once produced an all-Arabic trending row).
  const SPOTLIGHT = ["Turkish Dizi", "Hindi Cinema", "Pakistani Dramas", "Arabic Series & Shows", "Filipino Shows", "Game Shows", "Documentaries", "Malayalam Cinema"];
  const perCollection = await Promise.all(
    SPOTLIGHT.map((c) =>
      prisma.title.findMany({
        where: { isActive: true, collection: c },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { id: true },
      })
    )
  );
  const spotlight = perCollection.flat().slice(0, 16);
  if (spotlight.length) {
    await prisma.title.updateMany({ where: { id: { in: spotlight.map((t) => t.id) } }, data: { isTrending: true } });
  }

  // 4. Stats report
  const [channelsTotal, channelsActive, titlesTotal, titlesActive, titlesGeo, byCollection] = await Promise.all([
    prisma.channel.count(),
    prisma.channel.count({ where: { isActive: true } }),
    prisma.title.count(),
    prisma.title.count({ where: { isActive: true } }),
    prisma.title.count({ where: { lastStatus: "geo" } }),
    prisma.title.groupBy({ by: ["collection"], where: { isActive: true }, _count: { _all: true }, orderBy: { _count: { collection: "desc" } } }),
  ]);

  revalidatePath("/browse");
  revalidatePath("/vod");
  revalidatePath("/");

  // Weekly IndexNow refresh of evergreen pages (guides + hubs) so engines
  // re-crawl them promptly after content updates.
  await pingIndexNow(["/", "/live", "/vod", "/new", "/guides",
    "/guides/turkish-series-guide", "/guides/free-tv-for-expats-gulf",
    "/guides/pakistani-dramas-guide", "/guides/bollywood-classics-free",
    "/guides/malayalam-movies-gulf", "/guides/arabic-series-guide"]);

  return NextResponse.json({
    newBadgesAged: agedNew.count,
    deadChannelsPruned: pruned.count,
    trendingRotated: spotlight.length,
    stats: {
      channels: { total: channelsTotal, active: channelsActive },
      titles: { total: titlesTotal, active: titlesActive, geoHidden: titlesGeo },
      topCollections: byCollection.slice(0, 10).map((c) => ({ collection: c.collection, count: c._count._all })),
    },
    timestamp: new Date().toISOString(),
  });
}
