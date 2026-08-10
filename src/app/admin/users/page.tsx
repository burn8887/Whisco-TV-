import { prisma } from "@/lib/prisma";
import { deleteUserAction } from "@/lib/actions/admin";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { profiles: true } } },
    take: 200,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-1">Users</h1>
      <p className="text-zinc-500 text-sm mb-6">{users.length} registered accounts (accounts are optional — used only for profiles, watchlist &amp; resume-watching)</p>

      <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Profiles</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-orange-500/20 text-orange-300" : "bg-white/10"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{u._count.profiles}</td>
                <td className="px-4 py-3 text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={u.id} />
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
