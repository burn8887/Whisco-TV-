import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getFullUser, getActiveProfile, isSubActive, userVodTier, hasTierAccess } from "@/lib/access";
import WatchClient from "@/components/WatchClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const title = await prisma.title.findUnique({ where: { id } });
  if (!title || !title.streamUrl) notFound();

  const user = await getFullUser();
  const profile = await getActiveProfile();
  const active = isSubActive(user?.subscription as any);
  const vodTier = userVodTier(user?.subscription as any);
  if (!active || !hasTierAccess(vodTier, title.tier)) redirect(`/title/${title.slug}`);

  const progress = profile
    ? await prisma.watchProgress.findFirst({
        where: { profileId: profile.id, titleId: title.id, episodeId: null },
      })
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Link href={`/title/${title.slug}`} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4 w-fit">
        <ChevronLeft size={16} /> Back to {title.name}
      </Link>
      <WatchClient
        src={title.streamUrl}
        poster={title.backdropUrl}
        title={title.name}
        profileId={profile?.id}
        titleId={title.id}
        startAt={progress && progress.totalSecs - progress.positionSecs > 30 ? progress.positionSecs : 0}
      />
      <h1 className="text-2xl font-extrabold mt-6">{title.name}</h1>
      <p className="text-zinc-400 mt-2 max-w-2xl">{title.synopsis}</p>
    </div>
  );
}
