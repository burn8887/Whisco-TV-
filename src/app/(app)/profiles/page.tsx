import { getFullUser } from "@/lib/access";
import { switchProfileAction, createProfileAction } from "@/lib/actions/watch";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const AVATARS = ["👤", "🧑", "👩", "🧔", "🧑‍🚀", "🦸", "🐱", "🐼"];

export default async function ProfilesPage() {
  const user = await getFullUser();
  if (!user) redirect("/login");

  const canAddMore = user.profiles.length < 6;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center mb-2">Who's watching?</h1>
      <p className="text-zinc-500 text-center mb-10">Switch profiles anytime — up to 6 free profiles per account.</p>

      <div className="flex flex-wrap justify-center gap-6">
        {user.profiles.map((p) => (
          <form key={p.id} action={switchProfileAction.bind(null, p.id)}>
            <button className="flex flex-col items-center gap-3 group">
              <span className="w-28 h-28 rounded-2xl grid place-items-center text-5xl bg-zinc-800 ring-2 ring-transparent group-hover:ring-orange-500 transition">
                {p.avatar}
              </span>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{p.name}</span>
              {p.isKids && <span className="text-[10px] text-emerald-400 font-semibold">KIDS</span>}
            </button>
          </form>
        ))}

        {canAddMore && (
          <details className="group">
            <summary className="list-none flex flex-col items-center gap-3 cursor-pointer">
              <span className="w-28 h-28 rounded-2xl grid place-items-center bg-zinc-900 ring-2 ring-dashed ring-zinc-700 group-hover:ring-orange-500 transition">
                <Plus size={30} className="text-zinc-500" />
              </span>
              <span className="text-sm font-medium text-zinc-400">Add Profile</span>
            </summary>
            <form action={createProfileAction} className="mt-6 max-w-xs mx-auto bg-zinc-900 ring-1 ring-white/10 rounded-xl p-5 space-y-3">
              <input type="hidden" name="userId" value={user.id} />
              <input name="name" placeholder="Profile name" required className="w-full px-3 py-2 rounded-lg bg-black/40 ring-1 ring-white/10 text-sm outline-none focus:ring-orange-500" />
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input type="checkbox" name="isKids" className="accent-orange-500" /> Kids profile
              </label>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 font-semibold text-sm">Create Profile</button>
            </form>
          </details>
        )}
      </div>
    </div>
  );
}
