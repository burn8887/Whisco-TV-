"use client";

import { useState, useTransition } from "react";
import { toggleWatchlistAction } from "@/lib/actions/watch";
import { Plus, Check } from "lucide-react";

export default function WatchlistButton({ profileId, titleId, initial }: { profileId: string; titleId: string; initial: boolean }) {
  const [inList, setInList] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setInList((v) => !v);
          await toggleWatchlistAction(profileId, titleId);
        })
      }
      className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold ring-1 transition ${
        inList ? "bg-zinc-800 ring-white/20 text-white" : "bg-white/5 ring-white/15 text-zinc-200 hover:bg-white/10"
      }`}
    >
      {inList ? <Check size={18} /> : <Plus size={18} />}
      {inList ? "In My List" : "Add to My List"}
    </button>
  );
}
