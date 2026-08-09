"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { logoutAction } from "@/lib/actions/auth";
import { Tv2, Film, Home, Bookmark, User, Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/browse", label: "Home", icon: Home },
  { href: "/live", label: "Live TV", icon: Tv2 },
  { href: "/vod", label: "On Demand", icon: Film },
  { href: "/watchlist", label: "My List", icon: Bookmark },
];

export default function AppNav({
  userName,
  avatarColor,
  profileName,
  profileAvatar,
  isAdmin,
  subStatus,
}: {
  userName: string;
  avatarColor: string;
  profileName?: string;
  profileAvatar?: string;
  isAdmin: boolean;
  subStatus?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <l.icon size={15} /> {l.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith("/admin") ? "bg-orange-500/20 text-orange-300" : "text-orange-400 hover:bg-white/5"
                }`}
              >
                <Shield size={15} /> Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {subStatus === "TRIALING" && (
            <Link href="/account" className="hidden sm:block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30">
              Free Trial
            </Link>
          )}
          <Link href="/profiles" className="hidden sm:flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
            <span className="w-7 h-7 rounded-md grid place-items-center text-sm" style={{ background: avatarColor }}>
              {profileAvatar || "👤"}
            </span>
            {profileName || userName}
          </Link>
          <Link href="/account" className="hidden sm:flex p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5">
            <User size={18} />
          </Link>
          <form action={logoutAction}>
            <button className="hidden sm:flex p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5" title="Sign out">
              <LogOut size={18} />
            </button>
          </form>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-white/5">
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-orange-400 hover:bg-white/5">
              <Shield size={16} /> Admin
            </Link>
          )}
          <Link href="/profiles" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-white/5">
            <User size={16} /> Profiles
          </Link>
          <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-white/5">
            <User size={16} /> Account
          </Link>
          <form action={logoutAction}>
            <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-white/5 w-full">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
