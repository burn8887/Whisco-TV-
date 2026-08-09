import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TitleForm from "@/components/admin/TitleForm";
import { addSeasonAction, addEpisodeAction, deleteEpisodeAction } from "@/lib/actions/admin";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditTitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const title = await prisma.title.findUnique({
    where: { id },
    include: { seasons: { include: { episodes: { orderBy: { number: "asc" } } }, orderBy: { number: "asc" } } },
  });
  if (!title) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-6">Edit {title.type === "MOVIE" ? "Movie" : title.type === "DOCUMENTARY" ? "Documentary" : "Series"}</h1>
      <TitleForm title={title} />

      {title.type === "SERIES" && (
        <div className="mt-12 pt-10 border-t border-white/10">
          <h2 className="text-xl font-bold mb-4">Seasons & Episodes</h2>

          {title.seasons.map((season) => (
            <div key={season.id} className="mb-8 p-5 rounded-xl bg-zinc-900/60 ring-1 ring-white/5">
              <h3 className="font-semibold mb-3">Season {season.number}</h3>
              <div className="space-y-2 mb-4">
                {season.episodes.map((ep) => (
                  <div key={ep.id} className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 text-sm">
                    <span>
                      E{ep.number}. {ep.name} <span className="text-zinc-500">({ep.durationMins} min)</span>
                    </span>
                    <form action={deleteEpisodeAction}>
                      <input type="hidden" name="id" value={ep.id} />
                      <input type="hidden" name="titleId" value={title.id} />
                      <button className="p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                ))}
                {season.episodes.length === 0 && <p className="text-xs text-zinc-500">No episodes yet.</p>}
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-orange-400 font-medium">+ Add Episode</summary>
                <form action={addEpisodeAction} className="mt-3 space-y-2 max-w-md">
                  <input type="hidden" name="seasonId" value={season.id} />
                  <input type="hidden" name="titleId" value={title.id} />
                  <input name="number" type="number" placeholder="Episode #" defaultValue={season.episodes.length + 1} required className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm" />
                  <input name="name" placeholder="Episode title" required className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm" />
                  <textarea name="synopsis" placeholder="Synopsis" rows={2} className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm" />
                  <input name="durationMins" type="number" placeholder="Duration (min)" defaultValue={45} className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm" />
                  <input name="streamUrl" placeholder="Stream URL" defaultValue="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm font-mono text-xs" />
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-sm font-semibold">Add Episode</button>
                </form>
              </details>
            </div>
          ))}

          <form action={addSeasonAction} className="flex items-center gap-2">
            <input type="hidden" name="titleId" value={title.id} />
            <input name="number" type="number" defaultValue={title.seasons.length + 1} className="w-24 px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm" />
            <button className="px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-sm font-semibold">+ Add Season</button>
          </form>
        </div>
      )}
    </div>
  );
}
