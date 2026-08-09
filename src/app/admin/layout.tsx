import Link from "next/link";
import Logo from "@/components/Logo";
import { logoutAction } from "@/lib/actions/auth";
import { LayoutDashboard, Tv2, Film, CreditCard, Users, LogOut, ExternalLink } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/channels", label: "Channels", icon: Tv2 },
  { href: "/admin/titles", label: "VOD Titles", icon: Film },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-white/5 bg-zinc-950/60 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Logo />
          <p className="text-[11px] text-orange-400 font-semibold mt-1 tracking-wide">ADMIN CONSOLE</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition">
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/browse" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition">
            <ExternalLink size={16} /> View Site
          </Link>
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
