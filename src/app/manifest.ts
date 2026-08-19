import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Whisco TV — Free Live TV & Movies",
    short_name: "Whisco TV",
    description:
      "500+ free live TV channels and 14,000+ free movies, series & documentaries. 100% free, ad-supported — no subscription, ever.",
    id: "/",
    start_url: "/browse",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    categories: ["entertainment", "video", "news"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Live TV", url: "/live", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "On Demand", url: "/vod", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "My List", url: "/watchlist", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
