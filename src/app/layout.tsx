import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisco TV — Free Live TV & On-Demand, Ad-Supported",
  description:
    "Whisco TV is a free, ad-supported streaming service with 350+ live TV channels from around the globe plus a growing on-demand library of movies, series, and documentaries. No subscription, ever.",
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
