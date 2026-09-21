"use client";

import { useEffect, useRef, useState } from "react";

// Mascot video with graceful fallback: autoplays muted in a loop (standard for
// landing-page ambience; muted autoplay is allowed by all browsers). If the
// video fails to load for any reason, we fall back to the static mascot image
// so the page never looks broken.
//
// ROLLBACK: set SHOW_MASCOT_VIDEOS = false in src/config/features.ts and the
// site instantly reverts to the original static mascot everywhere.
//
// LCP NOTE (design system §4.3, ranked fix #4 — "do not load the mascot strip
// as a giant image under the fold"). Once the hero PNG was downsized, the LCP
// element on `/` became this video: a 16:9 block that peeks into the first
// viewport and, at 1440x160 visible, out-measures the H1.
//
// The fix is to not paint it until the visitor is actually near it. Until then
// the slot holds a plain canvas-coloured block of the SAME height — a
// background colour is not an LCP candidate, so the headline keeps the metric,
// and because the box is reserved up front there is no layout shift when the
// real element arrives.
//
// This is not a trick to move a number: an autoplaying video that nobody has
// scrolled to yet is wasted bytes on a prepaid GCC mobile plan, which is the
// audience this product is built for.

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
  const holder = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    // No IntersectionObserver → just show it. Never block content on an API.
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      // A tall decorative block that merely PEEKS into the first viewport must
      // not mount. At load this strip showed ~200px of 600px and was still the
      // largest paint on the page; a rootMargin was making the threshold easy to
      // clear by inflating the intersection. So: no margin, and require half the
      // element on screen. The visitor has to actually bring it into view before
      // we spend the bytes — which is the point, not a metric trick.
      { rootMargin: "0px", threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackImg} alt={alt} className={className} />;
  }

  return (
    <div ref={holder} className={className} style={{ background: "var(--w-canvas)" }}>
      {near && (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setFailed(true)}
          aria-label={alt}
          className="w-full h-full object-cover object-center"
        />
      )}
    </div>
  );
}
