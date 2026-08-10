import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteTitleAction } from "@/lib/actions/admin";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 100;

export default async function AdminTitlesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const where = sp.q ? { name: { contains: sp.q } } : {};

  const [titles, filteredCount, total] = await Promise.all([
    prisma.title.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { _count: { select: { seasons: true } } },
    }),
    prisma.title.count({ where }),
    prisma.title.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">VOD Titles</h1>
          <p className="text-zinc-500 text-sm">
            {total} total · showing {titles.length} (page {page} of {totalPages})
          </p>
        </div>
        <Link href="/admin/titles/new" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">
          <Plus size={16} /> Add Title
        </Link>
      </div>

      <form className="mb-4" action="/admin/titles">
        <input name="q" defaultValue={sp.q} placeholder="Search titles…" className="px-3 py-2 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm w-72" />
      </form>

      <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Year</th>
              <th className="text-left px-4 py-3">Seasons</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {titles.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-zinc-400">{t.type}</td>
                <td className="px-4 py-3 text-zinc-400">{t.releaseYear}</td>
                <td className="px-4 py-3 text-zinc-400">{t.type === "MOVIE" ? "—" : t._count.seasons}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/titles/${t.id}`} className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white">
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteTitleAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            href={{ pathname: "/admin/titles", query: { ...(sp.q ? { q: sp.q } : {}), page: String(Math.max(1, page - 1)) } }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${page <= 1 ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"}`}
          >
            <ChevronLeft size={16} /> Previous
          </Link>
          <span className="text-sm text-zinc-400">Page {page} / {totalPages}</span>
          <Link
            href={{ pathname: "/admin/titles", query: { ...(sp.q ? { q: sp.q } : {}), page: String(Math.min(totalPages, page + 1)) } }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ring-1 ring-white/10 ${page >= totalPages ? "pointer-events-none opacity-40 bg-white/5" : "bg-white/5 hover:bg-white/10"}`}
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
