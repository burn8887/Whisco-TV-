import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Clock, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.whisco.tv";

/**
 * SHOW HUB — the front door for a series.
 *
 * Why this page exists: a catalogue page says "here is a video". A show hub says
 * "here is a show worth your evening" — in-house writing, in order, with a way in
 * for somebody who has never heard of it. That is the difference between being a
 * link list and being a platform, and it is the same body of work that answers
 * AdSense's "low value content" finding.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = await prisma.title.findUnique({ where: { slug }, select: { name: true, releaseYear: true, synopsis: true, type: true } });
  if (!title) return { title: "Not found — Whisco TV" };
  return {
    title: `${title.name} — guides, characters and episode articles | Whisco TV`,
    description: `Original writing on ${title.name} (${title.releaseYear}): where to start, who's who, season arcs and episode guides. Watch ${title.name} free on Whisco TV.`.slice(0, 300),
    alternates: { canonical: `${SITE_URL}/shows/${slug}` },
    openGraph: { title: `${title.name} — Whisco TV Show Hub`, description: title.synopsis.slice(0, 200), url: `${SITE_URL}/shows/${slug}` },
  };
}

const KIND_LABEL: Record<string, string> = {
  SERIES_GUIDE: "Where to start",
  CHARACTER: "Character guide",
  SEASON: "Season guide",
  EPISODE: "Episode article",
  ESSAY: "Essay",
};

export default async function ShowHub({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const title = await prisma.title.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, name: true, type: true, synopsis: true, releaseYear: true, country: true,
      language: true, genres: true, rating: true, imdbRating: true, posterUrl: true, backdropUrl: true, isActive: true,
      seasons: { select: { _count: { select: { episodes: true } } } },
      articles: { where: { published: true }, orderBy: { publishedAt: "desc" }, select: { slug: true, headline: true, dek: true, kind: true, readingTimeMins: true, episodeNumber: true, author: true } },
    },
  });

  if (!title || !title.isActive) notFound();

  const episodes = title.seasons.reduce((a, s) => a + s._count.episodes, 0);
  const words = title.articles.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": title.type === "SERIES" ? "TVSeries" : "Movie",
    name: title.name,
    ...(title.releaseYear ? { datePublished: String(title.releaseYear) } : {}),
    ...(title.genres?.length ? { genre: title.genres } : {}),
    ...(title.country ? { countryOfOrigin: title.country } : {}),
    description: title.synopsis,
    url: `${SITE_URL}/shows/${slug}`,
    ...(episodes ? { numberOfEpisodes: episodes } : {}),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* hero */}
      <div className="relative">
        {title.backdropUrl && (
          <div className="absolute inset-0 h-64 overflow-hidden opacity-25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={title.backdropUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-orange-400">Show hub</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-400">
            {title.releaseYear ? <span>{title.releaseYear}</span> : null}
            {title.country ? <span>{title.country}</span> : null}
            {episodes > 0 ? <span>{episodes} episodes</span> : null}
            {title.rating ? <span className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs">{title.rating}</span> : null}
            {title.imdbRating ? <span>★ {title.imdbRating}</span> : null}
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-300">{title.synopsis}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/title/${title.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              <Play size={16} /> Watch {title.name}
            </Link>
            <Link href="/vod" className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-200 transition hover:border-neutral-500">
              Browse the catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* articles */}
      <div className="mx-auto max-w-5xl px-5 pb-20">
        <div className="mb-6 flex items-baseline justify-between border-t border-neutral-800 pt-8">
          <h2 className="text-xl font-semibold">Written about {title.name}</h2>
          <span className="text-xs text-neutral-500">{words} piece{words === 1 ? "" : "s"} · written in-house</span>
        </div>

        {title.articles.length === 0 ? (
          <p className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
            Our writers are working on this one. Guides, character maps and episode articles are added show by show — the flagship series are being covered first.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {title.articles.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="group flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-orange-500/60 hover:bg-neutral-900/70">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-orange-400">
                  <BookOpen size={13} />
                  {KIND_LABEL[a.kind] ?? "Article"}
                  {a.episodeNumber ? <span className="text-neutral-500">· Episode {a.episodeNumber}</span> : null}
                </div>
                <h3 className="text-[17px] font-semibold leading-snug group-hover:text-orange-200">{a.headline}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-400">{a.dek}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {a.readingTimeMins} min</span>
                  <span>· {a.author}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-10 text-sm text-neutral-500">
          An article for every episode is the work in progress: 10,000+ episodes in the catalogue, flagship series first, then outward.
          The writing is ours — {title.name} and 60+ Turkish series stream free on Whisco TV, no signup.
        </p>
      </div>
    </div>
  );
}
