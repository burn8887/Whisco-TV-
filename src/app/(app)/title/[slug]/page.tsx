import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getActiveProfile } from "@/lib/access";
import Link from "next/link";
import TitleCard from "@/components/TitleCard";
import WatchlistButton from "@/components/WatchlistButton";
import { Play, Star, Clock } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = "https://whisco-tv.vercel.app";

// ---------------------------------------------------------------------------
// SEO: rich per-title metadata. People search "watch <show> episode N online
// free" in huge volumes (especially for Turkish dizi across the Gulf) — these
// tags plus the JSON-LD below are what let Google index each show as a
// first-class TV series / movie page with rich results.
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = await prisma.title.findUnique({
    where: { slug },
    select: {
      name: true,
      synopsis: true,
      type: true,
      releaseYear: true,
      posterUrl: true,
      backdropUrl: true,
      genres: true,
      cast: true,
      language: true,
      isActive: true,
      seasons: { select: { _count: { select: { episodes: true } } } },
    },
  });
  if (!title || !title.isActive) return { title: "Not found — Whisco TV" };

  const episodeCount = title.seasons.reduce((a, s) => a + s._count.episodes, 0);
  const kind = title.type === "SERIES" ? "Series" : title.type === "DOCUMENTARY" ? "Documentary" : "Movie";
  const epPart = title.type === "SERIES" && episodeCount > 0 ? ` All ${episodeCount} episodes` : "";
  const pageTitle = `Watch ${title.name} (${title.releaseYear}) Online Free — Full ${kind}`;
  const description =
    `Stream ${title.name} free on Whisco TV.${epPart ? epPart + " available —" : ""} ` +
    `no subscription, no signup, 100% free and ad-supported. ${title.synopsis}`.slice(0, 300);

  const url = `${SITE_URL}/title/${slug}`;
  return {
    title: pageTitle,
    description,
    keywords: [
      `watch ${title.name} online free`,
      `${title.name} full episodes`,
      `${title.name} ${title.releaseYear}`,
      ...(title.language === "Turkish" ? [`${title.name} English subtitles`, "Turkish series free", "Turkish dizi online"] : []),
      ...title.genres.split(",").map((g) => g.trim().toLowerCase()),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "Whisco TV",
      type: title.type === "SERIES" ? "video.tv_show" : "video.movie",
      images: [{ url: title.backdropUrl || title.posterUrl, width: 1280, height: 720, alt: title.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [title.backdropUrl || title.posterUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = await prisma.title.findUnique({
    where: { slug },
    include: { seasons: { include: { episodes: { orderBy: { number: "asc" } } }, orderBy: { number: "asc" } } },
  });
  if (!title || !title.isActive) notFound();

  const profile = await getActiveProfile();

  const inWatchlist = profile
    ? !!(await prisma.watchlist.findUnique({ where: { profileId_titleId: { profileId: profile.id, titleId: title.id } } }))
    : false;

  const similar = await prisma.title.findMany({
    where: { type: title.type, id: { not: title.id }, isActive: true, genres: { contains: title.genres.split(",")[0].trim() } },
    take: 12,
  });

  const genreList = title.genres.split(",").map((g) => g.trim()).filter(Boolean);

  // JSON-LD structured data: lets Google show this as a rich TV-series /
  // movie result ("Watch free · Whisco TV") instead of a plain blue link.
  const episodeCount = title.seasons.reduce((a, s) => a + s.episodes.length, 0);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": title.type === "SERIES" ? "TVSeries" : "Movie",
    name: title.name,
    url: `https://whisco-tv.vercel.app/title/${title.slug}`,
    image: title.posterUrl,
    description: title.synopsis,
    datePublished: `${title.releaseYear}`,
    genre: genreList,
    inLanguage: title.language,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: title.imdbRating,
      bestRating: 10,
      ratingCount: 1000,
    },
    ...(title.cast
      ? { actor: title.cast.split(",").map((c) => ({ "@type": "Person", name: c.trim() })) }
      : {}),
    ...(title.type === "SERIES"
      ? {
          numberOfSeasons: title.seasons.length,
          numberOfEpisodes: episodeCount,
          containsSeason: title.seasons.map((s) => ({
            "@type": "TVSeason",
            seasonNumber: s.number,
            numberOfEpisodes: s.episodes.length,
          })),
        }
      : title.durationMins
        ? { duration: `PT${title.durationMins}M` }
        : {}),
    potentialAction: {
      "@type": "WatchAction",
      target: `https://whisco-tv.vercel.app/title/${title.slug}`,
      expectsAcceptanceOf: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        availabilityStarts: `${title.releaseYear}-01-01`,
      },
    },
  };

  return (
    <div className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <span className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wide">
              {title.type}
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/30 normal-case">Free</span>
            </span>
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
                <Link
                  href={`/watch/movie/${title.id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition"
                >
                  <Play size={18} fill="currentColor" /> Play
                </Link>
              ) : title.seasons[0]?.episodes[0] ? (
                <Link
                  href={`/watch/episode/${title.seasons[0].episodes[0].id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-black hover:bg-zinc-200 transition"
                >
                  <Play size={18} fill="currentColor" /> Play S1E1
                </Link>
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
                      href={`/watch/episode/${ep.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/60 ring-1 ring-white/5 hover:ring-orange-500/40 transition"
                    >
                      <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ep.stillUrl} alt={ep.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 grid place-items-center transition">
                          <Play size={20} fill="white" />
                        </div>
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
                <TitleCard key={t.id} title={t as any} variant="grid" />
              ))}
            </div>
          </div>
        )}

        {/* SEO content block — answers the questions people actually type
            into Google, in natural language. Styled to stay quiet/minimal. */}
        <section className="mt-16 border-t border-white/5 pt-8 text-sm text-zinc-500 leading-relaxed space-y-4 max-w-3xl">
          <h2 className="text-base font-bold text-zinc-300">
            How to watch {title.name} online free
          </h2>
          <p>
            You can stream {title.name} ({title.releaseYear}) free on Whisco TV — no subscription, no credit card, and no
            signup required. Whisco TV is a 100% free, ad-supported streaming service.
            {title.type === "SERIES" && episodeCount > 0 && (
              <> All {episodeCount} episode{episodeCount !== 1 ? "s" : ""} across {title.seasons.length} season{title.seasons.length !== 1 ? "s" : ""} are available on demand — start from Episode 1 or continue where you left off.</>
            )}
            {title.type !== "SERIES" && <> Press play above to start watching instantly in your browser.</>}
          </p>
          {title.language === "Turkish" && (
            <p>
              {title.name} is a Turkish {title.type === "SERIES" ? "series (dizi)" : "production"} streamed from the
              broadcaster&apos;s official channel. Popular with viewers across the Gulf, Middle East, and worldwide —
              episodes play in Turkish{title.director.includes("English") ? " with English subtitles" : ""}, and
              YouTube&apos;s caption settings offer subtitles in many languages.
            </p>
          )}
          <p>
            Whisco TV works on any device with a browser — phone, tablet, laptop, or smart TV. Create a free profile to
            build a watchlist and resume playback across devices.
          </p>
        </section>
      </div>
    </div>
  );
}
