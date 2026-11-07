import { prisma } from "@/lib/prisma";
import { getTitlePageData } from "@/lib/cached";
import { notFound } from "next/navigation";
import { getActiveProfile } from "@/lib/access";
import Link from "next/link";
import TitleCard from "@/components/TitleCard";
import AdSlot from "@/components/AdSlot";
import WatchlistButton from "@/components/WatchlistButton";
import ShareButton from "@/components/ShareButton";
import CopyMessageButton from "@/components/CopyMessageButton";
import { Play, Clock } from "lucide-react";
import {
  describeKind,
  isHarvestedSynopsis,
  looksLikeEpisode,
  officialChannelName,
  playbackSource,
  sourceSentence,
} from "@/lib/catalog-quality";
import { SERIES_NOTES } from "@/lib/series-notes";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.whisco.tv";

// ---------------------------------------------------------------------------
// SEO metadata: factual, per title. No "watch ... online free / full movie"
// phrasing (the vocabulary of pirate sites; it cost us two AdSense reviews in
// Aug and Nov 2026), no meta keywords, and no claim the page can't back up.
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { title } = await getTitlePageData(slug);
  if (!title) return { title: "Not found — Whisco TV" };

  const episodeCount = title.seasons.reduce((a, s) => a + s.episodes.length, 0);
  const note = SERIES_NOTES[slug];
  const harvested = isHarvestedSynopsis(title.synopsis);
  const source = playbackSource(title);
  const pageTitle = `${title.name}${title.releaseYear ? ` (${title.releaseYear})` : ""} — ${describeKind(title, episodeCount)}`;
  const lead = note ? note.paragraphs[0] : harvested ? "" : title.synopsis;
  const description = [lead, sourceSentence(title, source, episodeCount)].filter(Boolean).join(" ").slice(0, 300);

  const url = `${SITE_URL}/title/${slug}`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "Whisco TV",
      type: title.type === "SERIES" ? "video.tv_show" : "video.movie",
      images: [{ url: `${SITE_URL}/api/og/title/${slug}`, width: 1200, height: 630, alt: title.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [`${SITE_URL}/api/og/title/${slug}`],
    },
    // Auto-imported single uploads (boilerplate synopsis) stay noindexed:
    // viewers still get the page; Google is not asked to rank it.
    robots: { index: !harvested, follow: true },
  };
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, similar } = await getTitlePageData(slug);
  if (!title) notFound();

  const profile = await getActiveProfile();

  const inWatchlist = profile
    ? !!(await prisma.watchlist.findUnique({ where: { profileId_titleId: { profileId: profile.id, titleId: title.id } } }))
    : false;

  const genreList = title.genres.split(",").map((g) => g.trim()).filter(Boolean);
  const note = SERIES_NOTES[slug];
  const harvested = isHarvestedSynopsis(title.synopsis);
  const source = playbackSource(title);
  const channel = officialChannelName(title, source);
  const kindLabel = title.type !== "SERIES" && looksLikeEpisode(title.name) ? "EPISODE" : title.type;

  // JSON-LD structured data: lets Google show this as a rich TV-series /
  // movie result ("Watch free · Whisco TV") instead of a plain blue link.
  const episodeCount = title.seasons.reduce((a, s) => a + s.episodes.length, 0);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": title.type === "SERIES" ? "TVSeries" : "Movie",
    name: title.name,
    url: `https://www.whisco.tv/title/${title.slug}`,
    image: title.posterUrl,
    description: note ? note.paragraphs[0] : title.synopsis,
    datePublished: `${title.releaseYear}`,
    genre: genreList,
    inLanguage: title.language,
    // No aggregateRating: we hold no real review counts, and invented rating
    // markup breaks Google's structured-data rules (removed Nov 2026).
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
      target: `https://www.whisco.tv/title/${title.slug}`,
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
        {/* Two columns on desktop. The poster takes column 1; title, meta and
            actions take column 2 — and so does everything below, via the
            .w-title-rest band (design system §4.1). Previously that block sat
            outside the two-column row and ran the full container width, so it
            started back under the poster and broke the alignment. */}
        <div className="w-title-layout">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={title.posterUrl} alt={title.name} className="w-title-poster w-40 sm:w-56 rounded-xl ring-1 ring-white/10 shrink-0 shadow-2xl" />

          <div className="w-title-details pt-4 md:pt-24">
            <span className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wide">
              {kindLabel}
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/30 normal-case">Free</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{title.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-zinc-400">
              <span>{title.releaseYear}</span>
              {!harvested && title.rating && (
                <span className="px-1.5 py-0.5 rounded border border-zinc-600 text-xs">{title.rating}</span>
              )}
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

            {!harvested && <p className="mt-5 text-zinc-300 max-w-2xl leading-relaxed">{title.synopsis}</p>}

            <div className="mt-3 text-sm text-zinc-500 space-y-1">
              {title.cast && (
                <p>
                  <span className="text-zinc-400 font-medium">Cast: </span>
                  {title.cast}
                </p>
              )}
              {title.director && (
                <p>
                  <span className="text-zinc-400 font-medium">{source === "youtube" ? "Official channel: " : "Director: "}</span>
                  {source === "youtube" ? channel : title.director}
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
              <ShareButton title={title.name} path={`/title/${slug}`} />
              <CopyMessageButton
                name={title.name}
                language={title.language}
                meta={title.type === "SERIES" ? `${title.language} · series` : `${title.language}${title.durationMins ? ` · ${Math.floor(title.durationMins / 60)}h ${title.durationMins % 60}m` : ""}`}
                path={`/title/${slug}`}
              />
            </div>
          </div>

          {/* Everything below shares the content column with the title.
              The band spans both tracks and re-exposes them as a subgrid. */}
          <div className="w-title-rest">

        {note && (
          <article className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold mb-2">{note.headline}</h2>
            <p className="text-xs text-zinc-500 mb-4">
              By {note.author}
              {note.reviewedOn ? `, reviewed ${note.reviewedOn}` : ""}
            </p>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              {note.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {note.sources.length > 0 && (
              <p className="mt-4 text-xs text-zinc-500">
                Sources:{" "}
                {note.sources.map((src, i) => (
                  <span key={src.url}>
                    {i > 0 && ", "}
                    <a href={src.url} className="underline" target="_blank" rel="noopener noreferrer">
                      {src.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </article>
        )}

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

        {/* Ad slot only where Whisco's own writing carries the page: YouTube API
            Developer Policies III.G.1.d bars ads on pages whose value is the embed. */}
        {note && <AdSlot format="horizontal" />}

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

        {/* Provenance: where the picture actually comes from. Replaces the old
            "How to watch X online free" boilerplate (Nov 2026 AdSense recovery). */}
        <section className="mt-16 border-t border-white/5 pt-8 text-sm text-zinc-500 leading-relaxed space-y-3 max-w-3xl">
          <h2 className="text-base font-bold text-zinc-300">Where this plays from</h2>
          <p>{sourceSentence(title, source, episodeCount)}</p>
          {title.language === "Turkish" && source === "youtube" && (
            <p>Episodes play in Turkish. YouTube&apos;s caption menu shows subtitles where the broadcaster has added them.</p>
          )}
          <p>
            Whisco TV hosts no video files. Rights holders can ask for a listing to be changed or removed at{" "}
            <a href="mailto:legal@whisco.tv" className="underline">
              legal@whisco.tv
            </a>
            .
          </p>
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}
