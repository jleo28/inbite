"use client"

import { useState } from "react"
import Link from "next/link"
import { logout } from "@/lib/auth/actions"

const links = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/meals", label: "Meals" },
  { href: "/events", label: "Events" },
]

type NavUser = {
  name: string
  initials: string
} | null

export default function Nav({ user }: { user: NavUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-stone bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-display text-2xl text-espresso" onClick={() => setIsMenuOpen(false)}>
          InBite
        </Link>

        <ul className="hidden items-center gap-8 font-sans text-sm text-espresso md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-terracotta"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta font-sans text-sm font-medium text-cream"
                title={user.name}
              >
                {user.initials}
              </div>
              <form action={logout} className="hidden md:block">
                <button
                  type="submit"
                  className="font-sans text-sm text-muted transition-colors hover:text-terracotta"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-stone px-4 py-2 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta md:block"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-stone transition-colors hover:border-terracotta md:hidden"
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-espresso transition-transform duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-espresso transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-espresso transition-transform duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <ul className="flex flex-col gap-1 border-t border-stone px-6 py-4 font-sans text-sm text-espresso md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-stone/40 hover:text-terracotta"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {user ? (
              <form action={logout}>
                <button
                  type="submit"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-stone/40 hover:text-terracotta"
                >
                  Log out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-stone/40 hover:text-terracotta"
              >
                Sign in
              </Link>
            )}
          </li>
        </ul>
      ) : null}
    </header>
  )
}
