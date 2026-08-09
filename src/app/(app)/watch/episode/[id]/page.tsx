import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getFullUser, getActiveProfile, isSubActive, userVodTier, hasTierAccess } from "@/lib/access";
import WatchClient from "@/components/WatchClient";
import Link from "next/link";
import { ChevronLeft, Play, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WatchEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = await prisma.episode.findUnique({
    where: { id },
    include: { season: { include: { title: { include: { seasons: { include: { episodes: { orderBy: { number: "asc" } } }, orderBy: { number: "asc" } } } } } } },
  });
  if (!episode) notFound();

  const title = episode.season.title;
  const user = await getFullUser();
  const profile = await getActiveProfile();
  const active = isSubActive(user?.subscription as any);
  const vodTier = userVodTier(user?.subscription as any);
  if (!active || !hasTierAccess(vodTier, title.tier)) redirect(`/title/${title.slug}`);

  const progress = profile
    ? await prisma.watchProgress.findUnique({
        where: { profileId_titleId_episodeId: { profileId: profile.id, titleId: title.id, episodeId: episode.id } },
      })
    : null;

  const allEpisodes = title.seasons.flatMap((s) => s.episodes.map((e) => ({ ...e, seasonNumber: s.number })));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Link href={`/title/${title.slug}`} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4 w-fit">
        <ChevronLeft size={16} /> Back to {title.name}
      </Link>
      <WatchClient
        src={episode.streamUrl}
        poster={episode.stillUrl}
        title={`${title.name} — ${episode.name}`}
        profileId={profile?.id}
        titleId={title.id}
        episodeId={episode.id}
        startAt={progress && progress.totalSecs - progress.positionSecs > 30 ? progress.positionSecs : 0}
      />
      <h1 className="text-2xl font-extrabold mt-6">{title.name}</h1>
      <p className="text-zinc-400 text-sm mt-1">
        Season {episode.season.number}, Episode {episode.number} — {episode.name}
      </p>
      <p className="text-zinc-400 mt-3 max-w-2xl">{episode.synopsis}</p>

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-3">All Episodes</h2>
        <div className="space-y-2">
          {allEpisodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/episode/${ep.id}`}
              className={`flex items-center gap-4 p-3 rounded-xl ring-1 transition ${
                ep.id === episode.id ? "bg-orange-500/10 ring-orange-500/40" : "bg-zinc-900/60 ring-white/5 hover:ring-orange-500/40"
              }`}
            >
              <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ep.stillUrl} alt={ep.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  S{ep.seasonNumber}E{ep.number}. {ep.name}
                </p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{ep.synopsis}</p>
              </div>
              {ep.id === episode.id && <Play size={16} className="text-orange-400 shrink-0" fill="currentColor" />}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
