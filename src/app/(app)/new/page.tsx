import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNewThisWeek } from "@/lib/cached";

export const metadata: Metadata = {
  title: "New This Week — Fresh Free Movies, Series & Episodes",
  description:
    "Everything added to Whisco TV in the last 7 days: new free movies, series and episodes across Hindi, Malayalam, Tamil, Telugu, Urdu, Bangla, Arabic, Turkish, Filipino and more. Updated automatically, always free.",
  alternates: { canonical: "https://whisco.tv/new" },
};

export const revalidate = 3600;

export default async function NewThisWeekPage() {
  const data = await getNewThisWeek();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          New This Week
          <span className="ml-3 align-middle text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-pink-600 rounded-full px-3 py-1">
            {data.totalNew} added
          </span>
        </h1>
        <p className="text-zinc-400 mt-2">
          Everything that landed on Whisco TV in the last 7 days — checked, verified and 100% free.
          Updated automatically as our systems add content around the clock.
        </p>
      </div>

      {data.updatedSeries.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Ongoing series with new episodes</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {data.updatedSeries.map((t) => (
              <Link key={t.slug} href={`/title/${t.slug}`} className="group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-orange-500/50 transition">
                  <Image src={t.posterUrl} alt={t.name} fill sizes="200px" className="object-cover" />
                </div>
                <p className="mt-2 text-sm font-medium line-clamp-2">{t.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.groups.length === 0 && data.updatedSeries.length === 0 && (
        <p className="text-zinc-400">
          A quiet week — our discovery systems add new content every Monday and Thursday. Check back soon, or{" "}
          <Link href="/vod" className="text-orange-400 hover:underline">browse the full catalog</Link>.
        </p>
      )}

      {data.groups.map((g) => (
        <section key={g.collection} className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {g.collection} <span className="text-zinc-500 text-sm font-normal">({g.titles.length} new)</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {g.titles.slice(0, 12).map((t) => (
              <Link key={t.slug} href={`/title/${t.slug}`} className="group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-orange-500/50 transition">
                  <Image src={t.posterUrl} alt={t.name} fill sizes="200px" className="object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-orange-500 text-white rounded px-1.5 py-0.5">
                    New
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium line-clamp-2">{t.name}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-6 rounded-2xl bg-zinc-900/70 ring-1 ring-white/5 p-5 text-sm text-zinc-400">
        Want this as a feed? Subscribe to{" "}
        <a href="/feed.xml" className="text-orange-400 hover:underline">our RSS feed</a>{" "}
        — new content, straight to your reader.
      </div>
    </div>
  );
}
