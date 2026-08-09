"use client";

import { useState } from "react";
import { upsertTitleAction } from "@/lib/actions/admin";

const TIERS = ["BASIC", "STANDARD", "PREMIUM"];
const RATINGS_MOVIE = ["G", "PG", "PG-13", "R", "NC-17"];
const RATINGS_TV = ["TV-Y", "TV-PG", "TV-14", "TV-MA"];

export default function TitleForm({ title }: { title?: any }) {
  const [type, setType] = useState(title?.type || "MOVIE");

  return (
    <form action={upsertTitleAction} className="max-w-2xl space-y-5">
      {title && <input type="hidden" name="id" value={title.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Title</label>
          <input name="name" required defaultValue={title?.name} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Type</label>
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} disabled={!!title} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm disabled:opacity-60">
            <option value="MOVIE">Movie</option>
            <option value="SERIES">Series</option>
            <option value="DOCUMENTARY">Documentary</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-400">Synopsis</label>
        <textarea name="synopsis" required rows={3} defaultValue={title?.synopsis} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Release Year</label>
          <input name="releaseYear" type="number" required defaultValue={title?.releaseYear || 2024} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Rating</label>
          <select name="rating" defaultValue={title?.rating || "PG-13"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm">
            {[...RATINGS_MOVIE, ...RATINGS_TV].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">IMDb Rating</label>
          <input name="imdbRating" type="number" step="0.1" min="0" max="10" defaultValue={title?.imdbRating || 7.0} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      </div>

      {type === "MOVIE" && (
        <div>
          <label className="text-xs font-medium text-zinc-400">Duration (minutes)</label>
          <input name="durationMins" type="number" defaultValue={title?.durationMins || 100} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Genres (comma separated)</label>
          <input name="genres" required defaultValue={title?.genres} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Subscription Tier</label>
          <select name="tier" defaultValue={title?.tier || "BASIC"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm">
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Cast (comma separated)</label>
          <input name="cast" defaultValue={title?.cast} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Director</label>
          <input name="director" defaultValue={title?.director} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      </div>

      {type === "MOVIE" && (
        <div>
          <label className="text-xs font-medium text-zinc-400">Stream URL (movie file)</label>
          <input
            name="streamUrl"
            defaultValue={title?.streamUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm font-mono text-xs"
          />
        </div>
      )}

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="isFeatured" defaultChecked={title?.isFeatured} className="accent-orange-500" /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="isNew" defaultChecked={title?.isNew} className="accent-orange-500" /> New
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="isTrending" defaultChecked={title?.isTrending} className="accent-orange-500" /> Trending
        </label>
      </div>

      <button className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600">
        {title ? "Save Changes" : "Create Title"}
      </button>
    </form>
  );
}
