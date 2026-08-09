"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWatchlistAction(profileId: string, titleId: string) {
  const existing = await prisma.watchlist.findUnique({
    where: { profileId_titleId: { profileId, titleId } },
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.watchlist.create({ data: { profileId, titleId } });
  }

  revalidatePath("/", "layout");
}

export async function updateProgressAction(params: {
  profileId: string;
  titleId: string;
  episodeId?: string | null;
  positionSecs: number;
  totalSecs: number;
}) {
  const { profileId, titleId, episodeId, positionSecs, totalSecs } = params;
  const epId = episodeId ?? null;

  const existing = await prisma.watchProgress.findFirst({
    where: { profileId, titleId, episodeId: epId },
  });

  if (existing) {
    await prisma.watchProgress.update({
      where: { id: existing.id },
      data: { positionSecs, totalSecs },
    });
  } else {
    await prisma.watchProgress.create({
      data: { profileId, titleId, episodeId: epId, positionSecs, totalSecs },
    });
  }
  revalidatePath("/browse");
}

export async function switchProfileAction(profileId: string) {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  c.set("activeProfile", profileId, { path: "/", maxAge: 60 * 60 * 24 * 90 });
  const { redirect } = await import("next/navigation");
  redirect("/browse");
}

export async function createProfileAction(formData: FormData) {
  const userId = String(formData.get("userId"));
  const name = String(formData.get("name") || "New Profile");
  const isKids = formData.get("isKids") === "on";
  const avatar = isKids ? "🧒" : String(formData.get("avatar") || "👤");

  await prisma.profile.create({ data: { userId, name, isKids, avatar } });
  revalidatePath("/profiles");
}
