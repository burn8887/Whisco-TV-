import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteChannelAction } from "@/lib/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChannelsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const channels = await prisma.channel.findMany({
    where: sp.q ? { name: { contains: sp.q } } : {},
    orderBy: [{ country: "asc" }, { number: "asc" }],
    take: 200,
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Channels</h1>
          <p className="text-zinc-500 text-sm">{channels.length} shown</p>
        </div>
        <Link href="/admin/channels/new" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">
          <Plus size={16} /> Add Channel
        </Link>
      </div>

      <form className="mb-4" action="/admin/channels">
        <input name="q" defaultValue={sp.q} placeholder="Search channels…" className="px-3 py-2 rounded-lg bg-zinc-900 ring-1 ring-white/10 text-sm w-72" />
      </form>

      <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Country</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">HD</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {channels.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.country}</td>
                <td className="px-4 py-3 text-zinc-400">{c.category}</td>
                <td className="px-4 py-3 text-zinc-400">{c.isHD ? "Yes" : "No"}</td>
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
