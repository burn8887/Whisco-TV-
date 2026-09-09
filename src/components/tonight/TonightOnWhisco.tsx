import Link from "next/link";
import { HomeClock, TonightPoster } from "./tonight-islands";
import {
  buildTonightPicks,
  type HomePayload,
  type TonightPick,
} from "./tonight-picks";

type Props = {
  /** Pass the homepage's existing /home payload when the page already fetched it. */
  initialHome?: HomePayload | null;
};

function typeLabel(type: string): string {
  if (type === "SERIES") return "Series";
  if (type === "DOCUMENTARY") return "Documentary";
  if (type === "MOVIE") return "Film";
  return "Title";
}

function PickCard({ pick }: { pick: TonightPick }) {
  const year =
    typeof pick.title.releaseYear === "number" && pick.title.releaseYear > 0
      ? String(pick.title.releaseYear)
      : null;

  return (
    <Link
      href={pick.href}
      className="group flex w-[168px] shrink-0 flex-col overflow-hidden rounded-2xl bg-zinc-900/80 ring-1 ring-white/5 transition hover:ring-orange-500/40 sm:w-[190px] lg:w-auto"
    >
      <div className="relative overflow-hidden">
        <TonightPoster
          src={pick.posterUrl}
          alt={pick.displayName}
          communityLabel={pick.community.languageChip}
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-200 ring-1 ring-orange-400/30 backdrop-blur-sm">
          {pick.community.languageChip}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">
          {pick.displayName}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          {typeLabel(pick.title.type)}
          {year ? ` · ${year}` : ""}
        </p>
        <HomeClock
          city={pick.community.originCity}
          timeZone={pick.community.originTz}
          country={pick.community.originCountry}
        />
      </div>
    </Link>
  );
}

export async function TonightOnWhisco({ initialHome }: Props = {}) {
  let picks: TonightPick[] = [];
  try {
    picks = await buildTonightPicks(initialHome);
  } catch {
    return null;
  }

  if (picks.length === 0) return null;

  return (
    <section
      id="tonight"
      aria-labelledby="tonight-heading"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-400">
            Tonight on Whisco
          </p>
          <h2
            id="tonight-heading"
            className="text-2xl font-extrabold sm:text-3xl"
          >
            One pick per living room
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            الليلة على وسکو · from the legal shelf, not a popularity rank.
          </p>
        </div>
        <Link
          href="/vod"
          className="text-sm font-medium text-orange-400 hover:text-orange-300"
        >
          Browse the full library →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible">
        {picks.map((pick) => (
          <PickCard key={pick.community.id} pick={pick} />
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Clocks are origin time for that shelf (Istanbul, Mumbai, Kochi, Karachi,
        Manila, Cairo) — the Home-Time idea, without a second app. Titles are
        whatever the catalog can play tonight. We do not invent a “trending in
        the Gulf” number. Live cricket is not on this shelf; pay the rights
        holder for that.
      </p>
    </section>
  );
}

export default TonightOnWhisco;