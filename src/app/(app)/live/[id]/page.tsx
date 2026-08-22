import { getChannelPageData } from "@/lib/cached";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Radio, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { channel, related } = await getChannelPageData(id);
  if (!channel) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
        <Link href="/live" className="hover:text-white">
          Live TV
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{channel.category}</span>
      </div>

      {channel.isActive ? (
        <VideoPlayer src={channel.streamUrl} title={channel.name} />
      ) : (
        <div className="w-full aspect-video rounded-xl bg-zinc-900 ring-1 ring-white/10 grid place-items-center text-center p-8">
          <div>
            <AlertTriangle className="mx-auto mb-4 text-amber-400" size={36} />
            <h2 className="text-xl font-bold mb-2">This channel is temporarily unavailable</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              {channel.name}'s broadcast feed isn't responding right now. Our daily automated check will
              restore it as soon as it's back online — try one of the related channels below in the meantime.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={channel.logoUrl} alt={channel.name} className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold">{channel.name}</h1>
            {channel.isActive ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                <Radio size={10} className="animate-pulse" /> LIVE
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">OFFLINE</span>
            )}
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/30">
              FREE
            </span>
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            {channel.country} · {channel.category} · {channel.language} {channel.isHD && "· HD"}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-3">More in {channel.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((c) => (
              <Link key={c.id} href={`/live/${c.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/70 ring-1 ring-white/5 hover:ring-orange-500/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logoUrl} alt={c.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{c.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
