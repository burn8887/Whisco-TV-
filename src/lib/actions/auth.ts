"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";

export type FormState = { error?: string } | undefined;

// Whisco TV is free and ad-supported — creating an account is optional and
// only unlocks personalization (profiles, watchlist, resume-watching).
// There is no plan, trial, or billing step.

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) return { error: "All fields are required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profiles: { create: [{ name, avatar: "👤" }] },
    },
  });

  await signIn("credentials", { email, password, redirectTo: "/browse" });
  return undefined;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/browse" });
  } catch (err: any) {
    if (err?.type === "CredentialsSignin") {
      return { error: "Invalid email or password." };
    }
    if (err?.message?.includes("NEXT_REDIRECT")) throw err;
    return { error: "Something went wrong. Please try again." };
  }
  return undefined;
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
