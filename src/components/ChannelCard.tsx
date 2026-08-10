import Link from "next/link";
import { Radio } from "lucide-react";

export default function ChannelCard({
  channel,
}: {
  channel: { id: string; name: string; logoUrl: string; category: string; country: string; isHD: boolean };
}) {
  return (
    <Link
      href={`/live/${channel.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-900/70 ring-1 ring-white/5 hover:ring-orange-500/50 hover:bg-zinc-900 transition-all"
    >
      <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={channel.logoUrl} alt={channel.name} className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{channel.name}</p>
        <p className="text-xs text-zinc-500 truncate">
          {channel.country} · {channel.category} {channel.isHD && "· HD"}
        </p>
      </div>
      <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 shrink-0">
        <Radio size={10} className="animate-pulse" /> LIVE
      </span>
    </Link>
  );
}
