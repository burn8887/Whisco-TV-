"use client";

import { useActionState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { signupAction, type FormState } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signupAction, undefined);

  return (
    <div className="min-h-screen grid place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-zinc-900/70 ring-1 ring-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">Start your free trial</h1>
          <p className="text-sm text-zinc-500 mb-6">7 days free. No commitment, cancel anytime.</p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Full name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
            <button
              disabled={pending}
              className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:opacity-90 disabled:opacity-50 transition"
            >
              {pending ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
