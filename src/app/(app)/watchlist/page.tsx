import { prisma } from "@/lib/prisma";
import { getActiveProfile } from "@/lib/access";
import TitleCard from "@/components/TitleCard";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const profile = await getActiveProfile();
  const items = profile
    ? await prisma.watchlist.findMany({ where: { profileId: profile.id }, include: { title: true }, orderBy: { addedAt: "desc" } })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark size={22} className="text-orange-400" />
        <h1 className="text-2xl sm:text-3xl font-extrabold">My List</h1>
      </div>

      {items.length === 0 ? (
        <div className="w-empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whisco-mascot-280.webp" alt="" width={120} height={120} />
          <p className="font-medium">Your list lives on this device. Add something from On Demand.</p>
          <a
            href="/vod"
            className="w-focusable px-5 py-2.5 text-sm font-semibold"
            style={{
              background: "var(--w-bg-elev-2)",
              border: "1px solid var(--w-chip-border)",
              borderRadius: "var(--w-radius-pill)",
              color: "var(--w-fg)",
            }}
          >
            Browse On Demand
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((i) => (
            <TitleCard key={i.id} title={i.title as any} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
