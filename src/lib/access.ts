import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Whisco TV is 100% free and ad-supported. There is no subscription tier
// gating — every account (or no account at all) has full access to every
// live channel and every VOD title. Accounts are optional and only unlock
// personalization features (profiles, watchlist, resume-watching).

export async function getFullUser() {
  const session = await auth();
  if (!session?.user) return null;
  const id = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: true },
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
