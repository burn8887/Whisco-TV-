import Link from "next/link";
import { Radio } from "lucide-react";

/**
 * Live-channel card — Design System v1.0 §3.1 LIVE variant.
 *
 * 16:9 with object-fit: cover. Unlike a VOD poster, a channel logo IS the 16:9
 * asset, so covering is correct here. A shelf must never mix the two ratios,
 * which is why this is a separate component rather than a prop on TitleCard.
 */
export default function ChannelCard({
  channel,
}: {
  channel: {
    id: string;
    name: string;
    logoUrl: string;
    category: string;
    country: string;
    isHD: boolean;
  };
}) {
  return (
    <Link
      href={`/live/${channel.id}`}
      className="w-card w-card-live block"
      aria-label={`${channel.name} — watch live`}
    >
      <div className="w-card-hit">
        <div className="w-card-well">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={channel.logoUrl}
            alt=""
            className="w-card-art"
            loading="lazy"
            decoding="async"
          />
          <span className="w-card-scrim" aria-hidden="true" />
          <span
            className="absolute top-2 right-2 z-10 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5"
            style={{
              borderRadius: "var(--w-radius-sm)",
              background: "color-mix(in oklch, var(--w-canvas) 78%, transparent)",
              color: "var(--w-live)",
            }}
          >
            <Radio size={10} aria-hidden="true" />
            LIVE
          </span>
        </div>

        <div className="w-card-body">
          <span className="w-card-title">{channel.name}</span>
          <span className="w-card-meta">
            {channel.country} · {channel.category}
            {channel.isHD ? " · HD" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
