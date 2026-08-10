import { getFullUser } from "@/lib/access";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getFullUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Account</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Whisco TV is completely free — there's no plan, no billing, and nothing to manage here beyond your profile.
      </p>

      <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 mb-6">
        <h2 className="font-bold mb-3">Profile</h2>
        <p className="text-sm text-zinc-400">Name</p>
        <p className="font-medium mb-2">{user.name}</p>
        <p className="text-sm text-zinc-400">Email</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-600/10 ring-1 ring-orange-500/20 flex items-start gap-3">
        <Sparkles className="text-orange-400 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-zinc-300">
          Whisco TV is 100% free, ad-supported live TV and on-demand — no subscriptions, no trials, no credit card,
          ever. Your account just saves your profiles, watchlist, and resume-watching progress.
        </p>
      </div>
    </div>
  );
}
