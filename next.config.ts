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
// NOTE on %2526: three collection names contain an ampersand. Next writes the
// destination into the Location header after one decode pass, so a literal %26
// arrives at the browser as a raw "&" and the query splits — the collection
// filter then matches nothing and the page renders zero titles. Double-encoding
// (%2526) survives that pass and lands as a real %26. Do not "simplify" these
// three back to %26; verify by following the redirect and counting titles.
const HUB_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/turkish", destination: "/vod?collection=Turkish+Dizi" },
  { source: "/hindi", destination: "/vod?collection=Hindi+Cinema" },
  { source: "/telugu", destination: "/vod?collection=Telugu+Cinema" },
  { source: "/indonesian", destination: "/vod?collection=Indonesian+Shows" },
  { source: "/arabic", destination: "/vod?collection=Arabic+Series+%2526+Shows" },
  { source: "/malayalam", destination: "/vod?collection=Malayalam+Cinema" },
  { source: "/tamil", destination: "/vod?collection=Tamil+Cinema+%2526+Serials" },
  { source: "/bengali", destination: "/vod?collection=Bangla+Natok+%2526+Cinema" },
  { source: "/punjabi", destination: "/vod?collection=Punjabi+Cinema" },
  { source: "/sinhala", destination: "/vod?collection=Sinhala+Teledramas" },
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
