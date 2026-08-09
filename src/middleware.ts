import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/browse", "/live", "/vod", "/title", "/watch", "/watchlist", "/account", "/profiles", "/admin"];

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
  matcher: ["/browse/:path*", "/live/:path*", "/vod/:path*", "/title/:path*", "/watch/:path*", "/watchlist/:path*", "/account/:path*", "/profiles/:path*", "/admin/:path*"],
};
