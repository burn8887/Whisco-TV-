import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisco TV — Live TV & On-Demand, Everywhere",
  description:
    "Whisco TV streams 350+ live TV channels from around the globe plus a massive on-demand library of movies, series, and documentaries. One subscription, every screen.",
  icons: {
    icon: "/logo-mark.png",
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0f] text-zinc-100">{children}</body>
    </html>
  );
}
