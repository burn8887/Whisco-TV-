import { getVodShelves, getVodGrid } from "@/lib/cached";
import TitleCard from "@/components/TitleCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import MaghribPhase from "@/components/MaghribPhase";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 60;

// Curated shelf order — most broadly appealing first.
const COLLECTION_ORDER = [
  "Turkish Dizi",
  "Hindi Cinema",
  "Hindi Serials & Shows",
  "Pakistani Dramas",
  "Free Movies & TV",
  "Game Shows",
  "Malayalam Cinema",
  "Bangla Natok & Cinema",
  "Tamil Cinema & Serials",
  "Telugu Cinema",
  "Filipino Shows",
  "Arabic Series & Shows",
  "Indonesian Shows",
  "Nepali Cinema",
  "Punjabi Cinema",
  "Sinhala Teledramas",
  "Cartoons & Kids",
  "Comedy Classics",
  "Classic Movies",
  "Sci-Fi & Horror",
  "Crime & Mystery",
  "Westerns",
  "Drama & Romance",
  "Action & Adventure",
  "Classic TV",
  "Documentaries",
  "Science & Space",
  "History & War",
];

const COLLECTION_EMOJI: Record<string, string> = {
  "Turkish Dizi": "🇹🇷",
  "Hindi Cinema": "🇮🇳",
  "Hindi Serials & Shows": "📺",
  "Pakistani Dramas": "🇵🇰",
  "Free Movies & TV": "🎥",
  "Game Shows": "🎯",
  "Malayalam Cinema": "🥥",
  "Bangla Natok & Cinema": "🇧🇩",
  "Tamil Cinema & Serials": "🛕",
  "Telugu Cinema": "🎬",
  "Filipino Shows": "🇵🇭",
  "Arabic Series & Shows": "🌙",
  "Indonesian Shows": "🇮🇩",
  "Nepali Cinema": "🇳🇵",
  "Punjabi Cinema": "🪯",
  "Sinhala Teledramas": "🇱🇰",
  "Cartoons & Kids": "🎈",
  "Comedy Classics": "🎩",
  "Classic Movies": "🎬",
  "Sci-Fi & Horror": "👽",
  "Crime & Mystery": "🕵️",
  Westerns: "🤠",
  "Drama & Romance": "🌹",
  "Action & Adventure": "⚔️",
  "Classic TV": "📺",
  Documentaries: "🎞️",
  "Science & Space": "🚀",
  "History & War": "🪖",
};

// URL-safe shelf aliases.
//
// Three collection names contain an ampersand. Passing them as a ?collection=
// value means the ampersand has to survive URL encoding, and Next's dev server
// and Vercel's edge disagree about how many decode passes happen — the same
// destination emitted a literal %26 in one and %2526 in the other, and only one
// of those resolves. A slug avoids the question entirely: no special
// characters, identical behaviour everywhere, and a cleaner URL to share.
const SHELF_ALIASES: Record<string, string> = {
  turkish: "Turkish Dizi",
  hindi: "Hindi Cinema",
  "hindi-serials": "Hindi Serials & Shows",
  telugu: "Telugu Cinema",
  tamil: "Tamil Cinema & Serials",
  malayalam: "Malayalam Cinema",
  indonesian: "Indonesian Shows",
  arabic: "Arabic Series & Shows",
  bengali: "Bangla Natok & Cinema",
  punjabi: "Punjabi Cinema",
  sinhala: "Sinhala Teledramas",
  pakistani: "Pakistani Dramas",
  nepali: "Nepali Cinema",
  filipino: "Filipino Shows",
  cartoons: "Cartoons & Kids",
};

export default async function VodPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; shelf?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  // Resolve a shelf alias into a real collection name before anything reads it.
  const shelfCollection = sp.shelf ? SHELF_ALIASES[sp.shelf] ?? "" : "";
  const activeCollection = sp.collection || shelfCollection;
  const browsing = !activeCollection && !sp.q;

  // ------------------------------------------------------------------
  // BROWSE MODE (default): one horizontal shelf per collection.
  // ------------------------------------------------------------------
  if (browsing) {
    const { shelves, shelfTitles, counts: countsObj, total } = await getVodShelves(COLLECTION_ORDER);
    const counts = new Map(Object.entries(countsObj));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold">On Demand</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {total}+ movies, series, and documentaries — <span className="text-emerald-400 font-semibold">100% free, ad-supported</span>.
          </p>
        </div>

        {/* Search + collection pills */}
        <form className="relative mb-6" action="/vod">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            name="q"
            placeholder="Search titles…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
          />
        </form>

        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max sm:flex-wrap sm:w-auto">
            {shelves.map((c) => (
              <Link
                key={c}
                href={{ pathname: "/vod", query: { collection: c } }}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 ring-1 ring-white/10 text-zinc-300 hover:ring-orange-500/50 transition-colors"
              >
                {COLLECTION_EMOJI[c]} {c} <span className="text-zinc-500">{counts.get(c)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Shelves */}
        <div className="space-y-10">
          {shelves.map((c, i) => (
            <section key={c}>
              {i === 3 && <AdSlot format="horizontal" />}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                  {COLLECTION_EMOJI[c]} {c}
                </h2>
                <Link
                  href={{ pathname: "/vod", query: { collection: c } }}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  See all {counts.get(c)} <ArrowRight size={13} />
                </Link>
              </div>
              <div className="w-shelf-track w-shelf-track--inset no-scrollbar -mx-4 sm:-mx-6">
                {shelfTitles[i].map((t) => (
                  <TitleCard key={t.id} title={t as any} variant="row" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // FILTER MODE: grid of one collection and/or search results.
  // ------------------------------------------------------------------
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const { titles, filteredCount } = await getVodGrid(activeCollection, sp.q || "", page, PAGE_SIZE);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const baseQuery: Record<string, string> = {};
  if (activeCollection) baseQuery.collection = activeCollection;
  if (sp.q) baseQuery.q = sp.q;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="w-hero-motif" id="hub-hero">
          <MaghribPhase selector="#hub-hero" />
          <h1 className="w-display text-2xl sm:text-3xl font-extrabold">
            {activeCollection ? `${COLLECTION_EMOJI[activeCollection] ?? ""} ${activeCollection}` : "Search results"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredCount} title{filteredCount !== 1 ? "s" : ""}
            {sp.q ? ` matching “${sp.q}”` : ""} · page {page} of {totalPages}
          </p>
        </div>
        <Link href="/vod" className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
          ← All collections
        </Link>
      </div>

      <form className="relative mb-6" action="/vod">
        {activeCollection && <input type="hidden" name="collection" value={activeCollection} />}
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          name="q"
          defaultValue={sp.q}
          placeholder={activeCollection ? `Search in ${activeCollection}…` : "Search titles…"}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-900 ring-1 ring-white/10 focus:ring-orange-500 outline-none text-sm"
        />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t as any} variant="grid" />
        ))}
      </div>

      {titles.length === 0 && (
        <div className="w-empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whisco-mascot-280.webp" alt="" width={120} height={120} />
          <p className="font-medium">Nothing matches. Try a title, a language, or a channel name.</p>
          <Link
            href="/vod"
            className="w-focusable px-5 py-2.5 text-sm font-semibold"
            style={{
              background: "var(--w-bg-elev-2)",
              border: "1px solid var(--w-chip-border)",
              borderRadius: "var(--w-radius-pill)",
              color: "var(--w-fg)",
            }}
          >
            All collections
          </Link>
        </div>
      )}

      {titles.length > 0 && <AdSlot format="horizontal" />}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href={{ pathname: "/vod", query: { ...baseQuery, page: String(Math.max(1, page - 1)) } }}
            aria-disabled={page <= 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${
              page <= 1 ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <ChevronLeft size={16} /> Previous
          </Link>
          <span className="text-sm text-zinc-400">
            Page {page} / {totalPages}
          </span>
          <Link
            href={{ pathname: "/vod", query: { ...baseQuery, page: String(Math.min(totalPages, page + 1)) } }}
            aria-disabled={page >= totalPages}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${
              page >= totalPages ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
