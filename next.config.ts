import type { NextConfig } from "next";

// Language hub redirects.
//
// These ten one-word paths never existed as pages and were returning 404 while
// still being linked from marketing copy and typed directly by visitors. Each
// now 308s to the working collection on /vod, which is the real shelf. Listed
// explicitly rather than generated so the mapping stays readable and auditable.
//
// Targets verified 200 on production, 21 Sep 2026.
//
// These point at ?shelf=<slug> rather than ?collection=<name> on purpose.
// Three collection names contain an ampersand, and a Vercel edge function does
// not perform the same number of URL decode passes as `next dev` — the same
// destination emitted a literal %26 in one environment and %2526 in the other,
// with only one of them resolving to a real collection. A slug sidesteps the
// question entirely. See SHELF_ALIASES in src/app/(app)/vod/page.tsx.
const HUB_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/turkish", destination: "/vod?shelf=turkish" },
  { source: "/hindi", destination: "/vod?shelf=hindi" },
  { source: "/telugu", destination: "/vod?shelf=telugu" },
  { source: "/indonesian", destination: "/vod?shelf=indonesian" },
  { source: "/arabic", destination: "/vod?shelf=arabic" },
  { source: "/malayalam", destination: "/vod?shelf=malayalam" },
  { source: "/tamil", destination: "/vod?shelf=tamil" },
  { source: "/bengali", destination: "/vod?shelf=bengali" },
  { source: "/punjabi", destination: "/vod?shelf=punjabi" },
  { source: "/sinhala", destination: "/vod?shelf=sinhala" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return HUB_REDIRECTS.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true, // 308
    }));
  },

  images: {
    // /new renders YouTube thumbnails through next/image. Without this the
    // optimizer rejects the host and the route 500s under `next dev`.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
