"use client"

import Link from "next/link"
import { useActionState } from "react"
import FadeIn from "@/components/FadeIn"
import { signup } from "@/lib/auth/actions"

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, undefined)

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border border-stone bg-stone/30 p-10">
        <FadeIn>
          <h1 className="font-display text-3xl text-espresso">Join InBite</h1>
          <p className="mt-2 font-sans text-sm text-muted">
            Create an account to start planning meals and gathering your people.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <form action={formAction} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2 font-sans text-sm text-espresso">
              Name
              <input
                type="text"
                name="name"
                required
                placeholder="Joe L."
                className="rounded-lg border border-stone bg-cream px-4 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 font-sans text-sm text-espresso">
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="rounded-lg border border-stone bg-cream px-4 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 font-sans text-sm text-espresso">
              Password
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="rounded-lg border border-stone bg-cream px-4 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"
              />
            </label>

            {state && "error" in state ? (
              <p className="font-sans text-sm text-terracotta">{state.error}</p>
            ) : null}
            {state && "message" in state ? (
              <p className="font-sans text-sm text-sage">{state.message}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </FadeIn>

        <FadeIn delay={150}>
          <p className="mt-6 text-center font-sans text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-terracotta hover:underline">
              Sign in
            </Link>
          </p>
        </FadeIn>
      </div>
    </main>
  )
}
