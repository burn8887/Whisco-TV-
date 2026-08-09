"use client";

import { useTransition, useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { updateProgressAction } from "@/lib/actions/watch";

export default function WatchClient({
  src,
  poster,
  title,
  profileId,
  titleId,
  episodeId,
  startAt,
}: {
  src: string;
  poster: string;
  title: string;
  profileId?: string;
  titleId: string;
  episodeId?: string;
  startAt: number;
}) {
  const [, startTransition] = useTransition();
  const last = useRef(0);

  function handleProgress(pos: number, total: number) {
    if (!profileId) return;
    if (Math.abs(pos - last.current) < 4) return;
    last.current = pos;
    startTransition(() => {
      updateProgressAction({ profileId, titleId, episodeId, positionSecs: Math.floor(pos), totalSecs: Math.floor(total) });
    });
  }

  return <VideoPlayer src={src} poster={poster} title={title} startAt={startAt} onProgress={handleProgress} />;
}
