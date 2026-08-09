import { prisma } from "@/lib/prisma";
import { getFullUser, getActiveProfile, userVodTier, hasTierAccess, isSubActive } from "@/lib/access";
import Row from "@/components/Row";
import TitleCard from "@/components/TitleCard";
import ChannelCard from "@/components/ChannelCard";
import Link from "next/link";
import { Play, Info, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const user = await getFullUser();
  const profile = await getActiveProfile();
  const vodTier = userVodTier(user?.subscription as any);
  const active = isSubActive(user?.subscription as any);

  const [featured, trending, newReleases, movies, series, docs, channels, progress] = await Promise.all([
    prisma.title.findMany({ where: { isFeatured: true }, take: 5 }),
    prisma.title.findMany({ where: { isTrending: true }, take: 16 }),
    prisma.title.findMany({ orderBy: { createdAt: "desc" }, take: 16 }),
    prisma.title.findMany({ where: { type: "MOVIE" }, take: 16 }),
    prisma.title.findMany({ where: { type: "SERIES" }, take: 16 }),
    prisma.title.findMany({ where: { type: "DOCUMENTARY" }, take: 16 }),
    prisma.channel.findMany({ where: { isFeatured: true }, take: 8 }),
    profile
      ? prisma.watchProgress.findMany({
          where: { profileId: profile.id },
          include: { title: true },
          orderBy: { updatedAt: "desc" },
          take: 12,
        })
      : Promise.resolve([]),
  ]);

  const hero = featured[0];

  return (
    <div className="pb-16">
      {!active && (
        <div className="bg-orange-500/10 border-b border-orange-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 text-sm text-orange-200">
            <AlertTriangle size={16} className="shrink-0" />
            Your subscription isn't active.{" "}
            <Link href="/pricing" className="underline font-semibold">
              Choose a plan
            </Link>{" "}
            to unlock all live channels and on-demand titles.
          </div>
        </div>
      )}

      {hero && (
        <section className="relative h-[60vh] min-h-[420px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.backdropUrl} alt={hero.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-transparent to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-14">
            <span className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-wide">
              Featured {hero.type === "SERIES" ? "Series" : hero.type === "DOCUMENTARY" ? "Documentary" : "Movie"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold max-w-2xl leading-tight">{hero.name}</h1>
            <p className="mt-4 max-w-xl text-zinc-300 text-sm sm:text-base line-clamp-3">{hero.synopsis}</p>
            <div className="mt-6 flex gap-3">
              <Link
                href={`/title/${hero.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition"
              >
                <Play size={18} fill="currentColor" /> Play
              </Link>
              <Link
                href={`/title/${hero.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
              >
                <Info size={18} /> More Info
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {progress.length > 0 && (
          <Row title="Continue Watching">
            {progress.map((p) => (
              <TitleCard key={p.id} title={p.title as any} />
            ))}
          </Row>
        )}

        {channels.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg sm:text-xl font-bold">Popular Live Channels</h2>
              <Link href="/live" className="text-sm text-orange-400 hover:text-orange-300">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {channels.map((c) => (
                <ChannelCard key={c.id} channel={c} locked={!hasTierAccess(user ? "PREMIUM" : "BASIC", c.tier)} />
              ))}
            </div>
          </section>
        )}

        <Row title="Trending Now">
          {trending.map((t) => (
            <TitleCard key={t.id} title={t as any} locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
          ))}
        </Row>

        <Row title="New Releases">
          {newReleases.map((t) => (
            <TitleCard key={t.id} title={t as any} locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
          ))}
        </Row>

        <Row title="Movies">
          {movies.map((t) => (
            <TitleCard key={t.id} title={t as any} locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
          ))}
        </Row>

        <Row title="Series">
          {series.map((t) => (
            <TitleCard key={t.id} title={t as any} locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
          ))}
        </Row>

        <Row title="Documentaries">
          {docs.map((t) => (
            <TitleCard key={t.id} title={t as any} locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
          ))}
        </Row>
      </div>
    </div>
  );
}
