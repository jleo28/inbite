"use client"

import Link from "next/link"
import { useToast } from "@/components/Toast"

export default function SignupPage() {
  const { showToast } = useToast()

  function handleCreateAccount(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showToast("Coming soon, check back soon!")
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border border-stone bg-stone/30 p-10">
        <h1 className="font-display text-3xl text-espresso">Join InBite</h1>
        <p className="mt-2 font-sans text-sm text-muted">
          Create an account to start planning meals and gathering your people.
        </p>

        <form className="mt-8 flex flex-col gap-5">
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

          <button
            type="button"
            onClick={handleCreateAccount}
            className="mt-2 rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-terracotta hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
