"use client";

import { useState } from "react";

// Mascot video with graceful fallback: autoplays muted in a loop (standard
// for landing-page ambience; muted autoplay is allowed by all browsers). If
// the video fails to load for any reason, we fall back to the static mascot
// image so the page never looks broken.
//
// ROLLBACK: set SHOW_MASCOT_VIDEOS = false in src/config/features.ts and the
// site instantly reverts to the original static mascot everywhere.

export default function MascotVideo({
  src,
  poster,
  fallbackImg,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  fallbackImg: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackImg} alt={alt} className={className} />;
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setFailed(true)}
      aria-label={alt}
      className={className}
    />
  );
}
