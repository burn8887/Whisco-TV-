import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const TIER_RANK: Record<string, number> = { BASIC: 0, STANDARD: 1, PREMIUM: 2 };

export function tierRank(tier: string) {
  return TIER_RANK[tier] ?? 0;
}

export function hasTierAccess(userTier: string, contentTier: string) {
  return tierRank(userTier) >= tierRank(contentTier);
}

export async function getFullUser() {
  const session = await auth();
  if (!session?.user) return null;
  const id = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profiles: true,
      subscription: { include: { plan: true } },
    },
  });
  return user;
}

export async function getActiveProfile() {
  const user = await getFullUser();
  if (!user) return null;
  const c = await cookies();
  const activeId = c.get("activeProfile")?.value;
  const found = user.profiles.find((p) => p.id === activeId);
  return found || user.profiles[0] || null;
}

export function isSubActive(sub?: { status: string; currentPeriodEnd: Date } | null) {
  if (!sub) return false;
  return (sub.status === "ACTIVE" || sub.status === "TRIALING") && new Date(sub.currentPeriodEnd) > new Date();
}

export function userChannelTier(sub?: { plan: { channelAccess: string } } | null) {
  return sub?.plan.channelAccess ?? "BASIC";
}

export function userVodTier(sub?: { plan: { channelAccess: string } } | null) {
  // VOD content re-uses the same tier scale (BASIC/STANDARD/PREMIUM) as channelAccess
  return sub?.plan.channelAccess ?? "BASIC";
}
