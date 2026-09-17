import type { Metadata, Viewport } from "next";
import PwaSetup from "@/components/PwaSetup";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7207533964778777";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.whisco.tv"),
  title: {
    default: "Whisco TV — Free Live TV & On-Demand Streaming, No Subscription",
    template: "%s | Whisco TV",
  },
  description:
    "Free, ad-supported streaming for Gulf households — live news from official broadcaster channels, and public-domain films from the Internet Archive. We host no video files of our own. No subscription, ever.",
  keywords: [
    "free live tv",
    "free streaming",
    "watch tv online free",
    "free live news",
    "free news channels online",
    "public domain films",
    "expat tv channels",
    "arabic tv channels",
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
    url: "https://www.whisco.tv",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description:
      "Free, ad-supported streaming for Gulf households — live news from official broadcaster channels, and public-domain films. We host no video files. No subscription, ever.",
    images: [{ url: "/og-share-card.png", width: 1200, height: 630, alt: "Whisco TV — live news and public-domain film" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whisco TV — Free Live TV & On-Demand Streaming",
    description: "Live news from official broadcaster channels, and public-domain films. Free and ad-supported. No subscription, ever.",
    images: ["/og-share-card.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: ["VD42EUbn3t-BDsscWb_TsyimEDNa4USWdTlojXY-rZ8", "D_4kmSfSxEYd_AAKNKNoq4S8aUxqTT6NZ8LSZk4dlYQ", "nIJp4qlcSvdJU30XNCoMXugjno-YahaxaU2-BpsjAH4"],
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
      <body className="antialiased bg-[#0a0a0f] text-zinc-100">{children}<PwaSetup /><Analytics /></body>
    </html>
  );
}
