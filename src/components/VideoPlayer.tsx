"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  onProgress,
  startAt = 0,
  title,
}: {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onProgress?: (pos: number, total: number) => void;
  startAt?: number;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    setError(null);
    setLoading(true);
    let hls: Hls | null = null;

    const isHls = src.includes(".m3u8");

    function onLoaded() {
      setLoading(false);
      if (startAt > 0 && video) video.currentTime = startAt;
    }
    function onErr() {
      setLoading(false);
      setError("Unable to load this stream right now. Please try again shortly.");
    }

    if (isHls && Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 30 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) onErr();
      });
      video.addEventListener("loadedmetadata", onLoaded);
    } else {
      video.src = src;
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onErr);
    }

    const timer = setInterval(() => {
      if (video && video.duration && onProgress) {
        onProgress(video.currentTime, video.duration);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      if (hls) hls.destroy();
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onErr);
    };
  }, [src]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden ring-1 ring-white/10">
      <video
        ref={videoRef}
        poster={poster}
        controls
        autoPlay={autoPlay}
        playsInline
        className="w-full h-full"
      />
      {loading && !error && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm text-zinc-300">{title ? `Loading ${title}…` : "Loading stream…"}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center">
          <div>
            <p className="text-zinc-200 font-medium mb-1">Playback unavailable in this preview</p>
            <p className="text-sm text-zinc-400 max-w-sm">
              {error} This demo uses sample streams for illustration — connect your licensed
              Xtream Codes/M3U feed or CDN in production for real playback.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
