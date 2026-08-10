import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteChannelAction } from "@/lib/actions/admin";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChannelsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const where: any = sp.q ? { name: { contains: sp.q } } : {};
  if (sp.status === "inactive") where.isActive = false;
  if (sp.status === "active") where.isActive = true;

  const [channels, total, inactiveCount] = await Promise.all([
    prisma.channel.findMany({
      where,
      orderBy: [{ isActive: "asc" }, { country: "asc" }, { number: "asc" }],
      take: 400,
    }),
    prisma.channel.count(),
    prisma.channel.count({ where: { isActive: false } }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Channels</h1>
          <p className="text-zinc-500 text-sm">
            {total} total · {inactiveCount > 0 ? <span className="text-amber-400">{inactiveCount} flagged offline by daily health check</span> : "all healthy"}
          </p>
        </div>
        <Link href="/admin/channels/new" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">
          <Plus size={16} /> Add Channel
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-4" action="/admin/channels">
        <input name="q" defaultValue={sp.q} placeholder="Search channels…" className="px-3 py-2 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm w-64" />
        <select name="status" defaultValue={sp.status || ""} className="px-3 py-2 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Offline only</option>
        </select>
        <button className="px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-sm font-semibold">Filter</button>
      </form>

      <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Country</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Last checked</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {channels.map((c) => (
              <tr key={c.id} className={`hover:bg-white/[0.02] ${!c.isActive ? "bg-red-500/[0.03]" : ""}`}>
                <td className="px-4 py-3">
                  {c.isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={13} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                      <XCircle size={13} /> Offline ({c.failCount}x)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.country}</td>
                <td className="px-4 py-3 text-zinc-400">{c.category}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {c.lastCheckedAt ? (
                    new Date(c.lastCheckedAt).toLocaleString()
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> not yet checked
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/channels/${c.id}`} className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white">
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteChannelAction}>
                      <input type="hidden" name="id" value={c.id} />
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
    </div>
  );
}
