import Link from "next/link"
import { currentUser } from "@/lib/data"

const links = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/meals", label: "Meals" },
  { href: "/events", label: "Events" },
]

export default function Nav() {
  return (
    <header className="border-b border-stone bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-display text-2xl text-espresso">
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

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta font-sans text-sm font-medium text-cream"
          title={currentUser.name}
        >
          {currentUser.initials}
        </div>
      </nav>
    </header>
  )
}
