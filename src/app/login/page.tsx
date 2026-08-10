"use client";

import { useActionState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { loginAction, type FormState } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, undefined);

  return (
    <div className="min-h-screen grid place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-zinc-900/70 ring-1 ring-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500 mb-6">Sign in to keep watching.</p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue="demo@whiscotv.demo"
                className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <input
                name="password"
                type="password"
                required
                defaultValue="Demo123!"
                className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
            <button
              disabled={pending}
              className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 disabled:opacity-50 transition"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-zinc-500 mt-4 text-center">
            Demo credentials prefilled. Admin login: <span className="text-zinc-300">admin@whiscotv.demo / Admin123!</span>
          </p>
        </div>
        <p className="text-center text-sm text-zinc-500 mt-6">
          New to Whisco TV?{" "}
          <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
            Create a free account
          </Link>
        </p>
        <p className="text-center text-xs text-zinc-600 mt-3">
          Just want to watch?{" "}
          <Link href="/browse" className="text-zinc-400 hover:text-zinc-300 underline">
            Skip this — no account needed
          </Link>
        </p>
      </div>
    </div>
  );
}
