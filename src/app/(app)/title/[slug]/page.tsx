import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getFullUser, getActiveProfile, isSubActive, userVodTier, hasTierAccess } from "@/lib/access";
import Link from "next/link";
import TitleCard from "@/components/TitleCard";
import WatchlistButton from "@/components/WatchlistButton";
import { Play, Star, Lock, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = await prisma.title.findUnique({
    where: { slug },
    include: { seasons: { include: { episodes: { orderBy: { number: "asc" } } }, orderBy: { number: "asc" } } },
  });
  if (!title) notFound();

  const user = await getFullUser();
  const profile = await getActiveProfile();
  const active = isSubActive(user?.subscription as any);
  const vodTier = userVodTier(user?.subscription as any);
  const unlocked = active && hasTierAccess(vodTier, title.tier);

  const inWatchlist = profile
    ? !!(await prisma.watchlist.findUnique({ where: { profileId_titleId: { profileId: profile.id, titleId: title.id } } }))
    : false;

  const similar = await prisma.title.findMany({
    where: { type: title.type, id: { not: title.id }, genres: { contains: title.genres.split(",")[0].trim() } },
    take: 12,
  });

  const genreList = title.genres.split(",").map((g) => g.trim()).filter(Boolean);

  return (
    <div className="pb-16">
      <section className="relative h-[50vh] min-h-[360px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={title.backdropUrl} alt={title.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={title.posterUrl} alt={title.name} className="w-40 sm:w-56 rounded-xl ring-1 ring-white/10 shrink-0 shadow-2xl" />

          <div className="flex-1 pt-4 md:pt-24">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">{title.type}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{title.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-zinc-400">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star size={14} fill="currentColor" /> {title.imdbRating.toFixed(1)}
              </span>
              <span>{title.releaseYear}</span>
              <span className="px-1.5 py-0.5 rounded border border-zinc-600 text-xs">{title.rating}</span>
              {title.durationMins && (
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {title.durationMins} min
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold">{title.tier}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {genreList.map((g) => (
                <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                  {g}
                </span>
              ))}
            </div>

            <p className="mt-5 text-zinc-300 max-w-2xl leading-relaxed">{title.synopsis}</p>

            <div className="mt-3 text-sm text-zinc-500 space-y-1">
              {title.cast && (
                <p>
                  <span className="text-zinc-400 font-medium">Cast: </span>
                  {title.cast}
                </p>
              )}
              {title.director && (
                <p>
                  <span className="text-zinc-400 font-medium">Director: </span>
                  {title.director}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {title.streamUrl ? (
                unlocked ? (
                  <Link
                    href={`/watch/movie/${title.id}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition"
                  >
                    <Play size={18} fill="currentColor" /> Play
                  </Link>
                ) : (
                  <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white/10 ring-1 ring-white/20">
                    <Lock size={18} /> Unlock with {title.tier}
                  </Link>
                )
              ) : title.seasons[0]?.episodes[0] ? (
                unlocked ? (
                  <Link
                    href={`/watch/episode/${title.seasons[0].episodes[0].id}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition"
                  >
                    <Play size={18} fill="currentColor" /> Play S1E1
                  </Link>
                ) : (
                  <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white/10 ring-1 ring-white/20">
                    <Lock size={18} /> Unlock with {title.tier}
                  </Link>
                )
              ) : null}

              {profile && <WatchlistButton profileId={profile.id} titleId={title.id} initial={inWatchlist} />}
            </div>
          </div>
        </div>

        {title.type !== "MOVIE" && title.seasons.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold mb-4">Episodes</h2>
            {title.seasons.map((season) => (
              <div key={season.id} className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Season {season.number}</h3>
                <div className="space-y-2">
                  {season.episodes.map((ep) => (
                    <Link
                      key={ep.id}
                      href={unlocked ? `/watch/episode/${ep.id}` : "/pricing"}
                      className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/60 ring-1 ring-white/5 hover:ring-orange-500/40 transition"
                    >
                      <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ep.stillUrl} alt={ep.name} className="w-full h-full object-cover" />
                        {!unlocked && (
                          <div className="absolute inset-0 bg-black/60 grid place-items-center">
                            <Lock size={16} />
                          </div>
                        )}
                        {unlocked && (
                          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 grid place-items-center transition">
                            <Play size={20} fill="white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {ep.number}. {ep.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{ep.synopsis}</p>
                        <p className="text-xs text-zinc-600 mt-1">{ep.durationMins} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold mb-4">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((t) => (
                <TitleCard key={t.id} title={t as any} variant="grid" locked={active ? !hasTierAccess(vodTier, t.tier) : true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
