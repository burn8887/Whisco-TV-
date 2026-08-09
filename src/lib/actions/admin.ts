"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { placeholder } from "@/lib/placeholder";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------- CHANNELS ----------------
export async function upsertChannelAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const data = {
    name,
    streamUrl: String(formData.get("streamUrl") || ""),
    country: String(formData.get("country") || ""),
    countryCode: String(formData.get("countryCode") || "").toUpperCase().slice(0, 2),
    language: String(formData.get("language") || "English"),
    category: String(formData.get("category") || "Entertainment"),
    tier: String(formData.get("tier") || "BASIC"),
    isHD: formData.get("isHD") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    number: Number(formData.get("number") || 0),
    logoUrl: placeholder(name, { w: 200, h: 200, kind: "logo" }),
  };

  if (id) {
    await prisma.channel.update({ where: { id }, data });
  } else {
    await prisma.channel.create({ data });
  }
  revalidatePath("/admin/channels");
  revalidatePath("/live");
  redirect("/admin/channels");
}

export async function deleteChannelAction(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.channel.delete({ where: { id } });
  revalidatePath("/admin/channels");
  revalidatePath("/live");
}

// ---------------- TITLES (VOD) ----------------
export async function upsertTitleAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const type = String(formData.get("type") || "MOVIE");

  const base = {
    name,
    type,
    synopsis: String(formData.get("synopsis") || ""),
    releaseYear: Number(formData.get("releaseYear") || 2024),
    rating: String(formData.get("rating") || "PG-13"),
    imdbRating: Number(formData.get("imdbRating") || 7),
    durationMins: formData.get("durationMins") ? Number(formData.get("durationMins")) : null,
    genres: String(formData.get("genres") || ""),
    cast: String(formData.get("cast") || ""),
    director: String(formData.get("director") || ""),
    country: String(formData.get("country") || "USA"),
    language: String(formData.get("language") || "English"),
    tier: String(formData.get("tier") || "BASIC"),
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    isTrending: formData.get("isTrending") === "on",
    streamUrl: String(formData.get("streamUrl") || "") || null,
  };

  if (id) {
    await prisma.title.update({ where: { id }, data: base });
  } else {
    await prisma.title.create({
      data: {
        ...base,
        slug: slugify(name) + "-" + Date.now().toString(36),
        posterUrl: placeholder(name, { w: 400, h: 600, kind: "poster" }),
        backdropUrl: placeholder(name, { w: 1280, h: 720, kind: "backdrop" }),
      },
    });
  }
  revalidatePath("/admin/titles");
  revalidatePath("/vod");
  redirect("/admin/titles");
}

export async function deleteTitleAction(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.title.delete({ where: { id } });
  revalidatePath("/admin/titles");
  revalidatePath("/vod");
}

export async function addSeasonAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  const number = Number(formData.get("number") || 1);
  await prisma.season.create({ data: { titleId, number } });
  revalidatePath(`/admin/titles/${titleId}`);
}

export async function addEpisodeAction(formData: FormData) {
  const seasonId = String(formData.get("seasonId"));
  const titleId = String(formData.get("titleId"));
  const name = String(formData.get("name") || "New Episode");
  const number = Number(formData.get("number") || 1);
  await prisma.episode.create({
    data: {
      seasonId,
      number,
      name,
      synopsis: String(formData.get("synopsis") || ""),
      durationMins: Number(formData.get("durationMins") || 45),
      stillUrl: placeholder(name, { w: 640, h: 360, kind: "still" }),
      streamUrl: String(formData.get("streamUrl") || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"),
    },
  });
  revalidatePath(`/admin/titles/${titleId}`);
}

export async function deleteEpisodeAction(formData: FormData) {
  const id = String(formData.get("id"));
  const titleId = String(formData.get("titleId"));
  await prisma.episode.delete({ where: { id } });
  revalidatePath(`/admin/titles/${titleId}`);
}

// ---------------- PLANS ----------------
export async function upsertPlanAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const data = {
    name: String(formData.get("name") || ""),
    slug: slugify(String(formData.get("name") || "")),
    priceMonthly: Number(formData.get("priceMonthly") || 0),
    priceYearly: Number(formData.get("priceYearly") || 0),
    maxScreens: Number(formData.get("maxScreens") || 1),
    maxProfiles: Number(formData.get("maxProfiles") || 1),
    hdQuality: String(formData.get("hdQuality") || "HD"),
    channelAccess: String(formData.get("channelAccess") || "BASIC"),
    vodAccess: formData.get("vodAccess") === "on",
    description: String(formData.get("description") || ""),
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };

  if (id) {
    await prisma.plan.update({ where: { id }, data });
  } else {
    await prisma.plan.create({ data });
  }
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  redirect("/admin/plans");
}

export async function deletePlanAction(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/admin/plans");
}

// ---------------- USERS ----------------
export async function updateUserSubStatusAction(formData: FormData) {
  const userId = String(formData.get("userId"));
  const status = String(formData.get("status"));
  await prisma.subscription.update({ where: { userId }, data: { status } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
