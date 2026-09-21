"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import { Star } from "lucide-react";
import PosterImage from "./PosterImage";

/**
 * Poster card — Design System v1.0 §3.1.
 *
 * The image well is a 16:9 letterbox parked on canvas inside a 3:4 frame,
 * object-fit: contain. Most of our art is an official YouTube thumbnail; forcing
 * it into a portrait crop slices faces off and is the loudest "cheap IPTV skin"
 * signal available to us. The pillars are canvas, never a blur-upscale.
 *
 * View Transitions (same-origin catalog → title only): the name is attached to
 * the ONE card being clicked, immediately before navigation. Attaching
 * `view-transition-name: poster` to every card would be a duplicate-name error —
 * the name must be unique in the document.
 *
 * Reduced motion: we do not call startViewTransition at all, and we never block
 * navigation on the API. No support, no permission, no session → instant push.
 */
export default function TitleCard({
  title,
  variant = "row",
}: {
  title: {
    slug: string;
    name: string;
    posterUrl: string;
    imdbRating: number;
    releaseYear: number;
    type: string;
    isNew?: boolean;
  };
  variant?: "row" | "grid";
}) {
  const router = useRouter();
  const hitRef = useRef<HTMLAnchorElement>(null);
  const href = `/title/${title.slug}`;

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle anything that isn't a plain left click:
    // middle click, ctrl/cmd-click new tab, shift-click new window.
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    if (typeof doc.startViewTransition !== "function") return; // degrade: normal push
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const well = hitRef.current?.querySelector<HTMLElement>(".w-card-well");
    if (!well) return;

    e.preventDefault();
    well.style.viewTransitionName = "poster";
    doc.startViewTransition(() => {
      router.push(href);
    });
    // The name must be released, or the next navigation has two of them.
    window.setTimeout(() => {
      well.style.viewTransitionName = "";
    }, 1200);
  }

  return (
    <article className={`w-card ${variant === "row" ? "shrink-0" : "w-full"}`}>
      <Link
        ref={hitRef}
        href={href}
        onClick={onClick}
        className="w-card-hit"
        aria-label={`${title.name} — ${title.releaseYear}`}
      >
        <div className="w-card-well">
          <PosterImage
            src={title.posterUrl}
            alt={title.name}
            className="w-card-art"
          />
          <span className="w-card-scrim" aria-hidden="true" />

          {title.isNew && (
            <span
              className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5"
              style={{
                borderRadius: "var(--w-radius-sm)",
                background: "var(--w-ember)",
                color: "var(--w-canvas)",
              }}
            >
              NEW
            </span>
          )}

          <div className="w-card-body">
            <h3 className="w-card-title">{title.name}</h3>
            <p className="w-card-meta flex items-center gap-2">
              <span className="flex items-center gap-0.5" style={{ color: "var(--w-warn)" }}>
                <Star size={10} fill="currentColor" aria-hidden="true" />
                {title.imdbRating.toFixed(1)}
              </span>
              <span>{title.releaseYear}</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
