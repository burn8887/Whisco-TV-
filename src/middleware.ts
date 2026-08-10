import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Whisco TV is free to watch — no account required for live TV or on-demand.
// Only personalization features (watchlist, profiles, account) and the
// admin console require sign-in.
const PROTECTED_PREFIXES = ["/watchlist", "/profiles", "/account", "/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && req.auth && (req.auth.user as any)?.role !== "ADMIN") {
    const url = new URL("/browse", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/watchlist/:path*", "/profiles/:path*", "/account/:path*", "/admin/:path*"],
};
