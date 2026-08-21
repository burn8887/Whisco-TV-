import type { Metadata, Viewport } from "next";
import PwaSetup from "@/components/PwaSetup";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7207533964778777";

export const metadata: Metadata = {
  metadataBase: new URL("https://whisco.tv"),
  title: {
    default: "Whisco TV — Free Live TV & On-Demand Streaming, No Subscription",
    template: "%s | Whisco TV",
  },
  description:
    "Watch 500+ free live TV channels from around the world plus 16,000+ free movies, series, and documentaries — including popular Turkish series with full episodes. 100% free and ad-supported. No subscription, ever.",
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
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Whisco TV",
  },
  openGraph: {
    siteName: "Whisco TV",
    type: "website",
    url: "https://whisco.tv",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description:
      "500+ free live TV channels and 1,700+ free on-demand titles including popular Turkish series. 100% free, ad-supported — no subscription, ever.",
    images: [{ url: "/og-share-card.png", width: 1200, height: 630, alt: "Whisco TV — free live TV and movies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description: "500+ free live channels, 16,000+ free titles, popular Turkish series. No subscription, ever.",
    images: ["/og-share-card.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: ["D_4kmSfSxEYd_AAKNKNoq4S8aUxqTT6NZ8LSZk4dlYQ", "nIJp4qlcSvdJU30XNCoMXugjno-YahaxaU2-BpsjAH4"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {ADSENSE_CLIENT && (
          // Plain script tag (not next/script): AdSense's site verification
          // crawler looks for this exact tag in the raw HTML source.
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased bg-[#0a0a0f] text-zinc-100">{children}<PwaSetup /></body>
    </html>
  );
}
