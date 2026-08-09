"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function subscribeAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const planId = String(formData.get("planId"));
  const billingCycle = String(formData.get("billingCycle") || "monthly");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return;

  const amount = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const periodDays = billingCycle === "yearly" ? 365 : 30;

  const userId = (session.user as any).id as string;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId: plan.id,
      status: "ACTIVE",
      billingCycle,
      currentPeriodEnd: new Date(Date.now() + periodDays * 24 * 3600 * 1000),
      cancelAtPeriodEnd: false,
    },
    create: {
      userId,
      planId: plan.id,
      status: "ACTIVE",
      billingCycle,
      currentPeriodEnd: new Date(Date.now() + periodDays * 24 * 3600 * 1000),
    },
  });

  await prisma.payment.create({
    data: {
      userId,
      amount,
      description: `${plan.name} Plan — ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
    },
  });

  revalidatePath("/account");
  redirect("/account?upgraded=1");
}

export async function cancelSubscriptionAction() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });

  revalidatePath("/account");
}

export async function resumeSubscriptionAction() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: false },
  });

  revalidatePath("/account");
}
