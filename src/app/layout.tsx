import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://whisco-tv.vercel.app"),
  title: {
    default: "Whisco TV — Free Live TV & On-Demand Streaming, No Subscription",
    template: "%s | Whisco TV",
  },
  description:
    "Watch 500+ free live TV channels from around the world plus 1,700+ free movies, series, and documentaries — including popular Turkish series with full episodes. 100% free and ad-supported. No subscription, ever.",
  keywords: [
    "free live tv",
    "free streaming",
    "watch tv online free",
    "turkish series free",
    "turkish dizi english subtitles",
    "free movies online",
    "expat tv channels",
    "arabic tv channels free",
    "hindi tv channels free",
  ],
  icons: {
    icon: "/logo-mark.png",
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  openGraph: {
    siteName: "Whisco TV",
    type: "website",
    url: "https://whisco-tv.vercel.app",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description:
      "500+ free live TV channels and 1,700+ free on-demand titles including popular Turkish series. 100% free, ad-supported — no subscription, ever.",
    images: [{ url: "/logo-mark.png", width: 512, height: 512, alt: "Whisco TV" }],
  },
  twitter: {
    card: "summary",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description: "500+ free live channels, 1,700+ free titles, popular Turkish series. No subscription, ever.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: ["D_4kmSfSxEYd_AAKNKNoq4S8aUxqTT6NZ8LSZk4dlYQ", "nIJp4qlcSvdJU30XNCoMXugjno-YahaxaU2-BpsjAH4"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0f] text-zinc-100">{children}</body>
    </html>
  );
}
