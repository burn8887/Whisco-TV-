"use client";

import { useEffect, useState } from "react";

type ClockProps = {
  city: string;
  timeZone: string;
  country: string;
};

function formatHm(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function HomeClock({ city, timeZone, country }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now ? formatHm(now, timeZone) : "––:––";

  return (
    <p
      className="mt-2 flex items-baseline gap-1.5 font-mono text-[11px] tabular-nums text-zinc-400"
      title={`${city}, ${country} (${timeZone})`}
    >
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/80" />
      <span className="truncate text-zinc-500">{city}</span>
      <span className="text-zinc-200">{time}</span>
    </p>
  );
}

type PosterProps = {
  src: string | null;
  alt: string;
  communityLabel: string;
};

export function TonightPoster({ src, alt, communityLabel }: PosterProps) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        className="flex aspect-[2/3] w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-[#0a0a0f] to-orange-950/40 px-3 text-center"
        aria-hidden="true"
      >
        <span className="text-gradient text-lg font-extrabold tracking-tight">
          Whisco
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {communityLabel}
        </span>
      </div>
    );
  }

  return (
    // Matching the existing homepage Featured row: raw <img>, not next/image.
    // Remote patterns for i.ytimg.com / archive.org are not assumed to be in next.config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={190}
      height={285}
      loading="lazy"
      decoding="async"
      className="aspect-[2/3] w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}