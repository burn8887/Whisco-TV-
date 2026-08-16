"use client";

import { useState } from "react";

// Poster with graceful fallback: if the artwork fails to load (dead CDN,
// missing thumbnail), render a clean branded placeholder with the title
// name so the grid never shows a broken-image icon.
export default function PosterImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-3`}>
        <span className="text-center text-[11px] font-semibold leading-snug text-zinc-400 line-clamp-4">{alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
  );
}
