"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { logoutAction } from "@/lib/actions/auth";
import {
  Tv2,
  Film,
  Search,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  LogIn,
  Sparkles,
  MoreHorizontal,
  Compass,
  Languages,
  Info,
  Scale,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Primary chrome per the design system (§7 A3) and the 21 Sep work order:
// Mark · Live · On Demand · New · Search stay in the bar; Guides, Languages,
// About and Legal move to the overflow. Sign in is retired from primary chrome
// — the watch surfaces must not lead with an account.
const PRIMARY = [
  { href: "/live", label: "Live", icon: Tv2 },
  { href: "/vod", label: "On Demand", icon: Film },
  { href: "/new", label: "New", icon: Sparkles },
  // No standalone /search route exists; /vod is the real search surface
  // (?q= is handled server-side). Search links there and activates only
  // when a query is present, so it never doubles with "On Demand".
  { href: "/vod?q=", label: "Search", icon: Search },
];

const OVERFLOW = [
  { href: "/guides", label: "Guides", icon: Compass },
  { href: "/browse", label: "Languages", icon: Languages },
  { href: "/about", label: "About", icon: Info },
  { href: "/terms", label: "Legal", icon: Scale },
];

export default function AppNav({
  userName,
  avatarColor,
  profileName,
  profileAvatar,
  isAdmin,
  isLoggedIn,
}: {
  userName?: string;
  avatarColor?: string;
  profileName?: string;
  profileAvatar?: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close the overflow on outside click or Escape.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (href.includes("?q=")) return false; // Search activates on query only
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <header
      className="sticky top-0 border-b"
      style={{
        zIndex: "var(--w-z-nav)",
        background: "var(--w-scrim)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--w-chip-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          {/* Mark */}
          <Logo />
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {PRIMARY.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="w-focusable flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition"
                  style={{
                    color: active ? "var(--w-fg)" : "var(--w-fg-muted)",
                    background: active ? "var(--w-chip)" : "transparent",
                  }}
                >
                  <l.icon size={15} /> {l.label}
                </Link>
              );
            })}

            {/* Overflow — Guides · Languages · About · Legal, plus the account
                block that used to sit in primary chrome. */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className="w-focusable flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition"
                style={{ color: "var(--w-fg-muted)" }}
              >
                <MoreHorizontal size={15} /> More
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  className="absolute left-0 mt-1 w-52 p-1.5 rounded-xl border shadow-xl"
                  style={{
                    background: "var(--w-bg-elev-2)",
                    borderColor: "var(--w-chip-border)",
                  }}
                >
                  {OVERFLOW.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="w-focusable flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ color: "var(--w-fg-muted)" }}
                    >
                      <l.icon size={15} /> {l.label}
                    </Link>
                  ))}
                  <div
                    className="my-1.5 h-px"
                    style={{ background: "var(--w-chip-border)" }}
                  />
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/watchlist"
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className="w-focusable flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                        style={{ color: "var(--w-fg-muted)" }}
                      >
                        <Bookmark size={15} /> My List
                      </Link>
                      <Link
                        href="/account"
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                        className="w-focusable flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                        style={{ color: "var(--w-fg-muted)" }}
                      >
                        <User size={15} /> {profileName || userName || "Account"}
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          className="w-focusable flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                          style={{ color: "var(--w-ember)" }}
                        >
                          <Shield size={15} /> Admin
                        </Link>
                      )}
                      <form action={logoutAction}>
                        <button
                          role="menuitem"
                          className="w-focusable flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm"
                          style={{ color: "var(--w-fg-muted)" }}
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="w-focusable flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ color: "var(--w-fg-muted)" }}
                    >
                      <LogIn size={15} /> Sign in
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/watchlist" className="hidden sm:flex" aria-label="My List">
            <Bookmark size={18} style={{ color: "var(--w-fg-muted)" }} />
          </Link>
          <button
            className="md:hidden p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: "var(--w-chip-border)" }}
        >
          {[...PRIMARY, ...OVERFLOW].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--w-fg-muted)" }}
            >
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
          <div className="my-1.5 h-px" style={{ background: "var(--w-chip-border)" }} />
          {isLoggedIn ? (
            <>
              <Link
                href="/watchlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ color: "var(--w-fg-muted)" }}
              >
                <Bookmark size={16} /> My List
              </Link>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ color: "var(--w-fg-muted)" }}
              >
                <User size={16} /> Account
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{ color: "var(--w-ember)" }}
                >
                  <Shield size={16} /> Admin
                </Link>
              )}
              <form action={logoutAction}>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{ color: "var(--w-fg-muted)" }}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--w-fg-muted)" }}
            >
              <LogIn size={16} /> Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
