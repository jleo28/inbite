"use client"

import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import RecipeCard from "@/components/RecipeCard"
import FadeIn from "@/components/FadeIn"
import { useToast } from "@/components/Toast"
import { recipes, events } from "@/lib/data"

export default function Home() {
  const { showToast } = useToast()
  const invite = events[0]
  const featured = recipes.slice(0, 3)
  const recentlyAdded = recipes[recipes.length - 1]

  function handleAccept() {
    showToast(`You're in! See you at ${invite.name} on ${invite.date}.`)
  }

  function handleDecline() {
    showToast(`Got it, we will let the host know you can't make it.`)
  }

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection
        eyebrow="Your week, planned"
        headline="Meals worth gathering for"
        subhead="Plan recipes, build out meals, and invite the people who matter, all in one warm and simple place."
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <FadeIn>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl text-espresso">Featured recipes</h2>
            <Link href="/recipes" className="font-sans text-sm text-terracotta hover:underline">
              View all recipes
            </Link>
          </div>
        </FadeIn>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((recipe, index) => (
            <FadeIn key={recipe.id} delay={index * 100}>
              <RecipeCard recipe={recipe} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-stone/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="rounded-2xl border border-stone bg-cream p-8 sm:p-10">
              <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
                Invitation
              </p>
              <h2 className="mt-3 font-display text-3xl text-espresso">
                You&rsquo;re invited to {invite.name}
              </h2>
              <p className="mt-2 font-sans text-sm text-muted">
                Hosted by {invite.host} on {invite.date}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="rounded-full border border-stone bg-cream px-6 py-3 font-sans text-sm font-medium text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Decline
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <FadeIn>
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
            Recently added
          </p>
          <Link
            href={`/recipes/${recentlyAdded.id}`}
            className="group mt-4 flex flex-col gap-4 rounded-2xl border border-stone bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-display text-2xl text-espresso">{recentlyAdded.name}</h3>
              <p className="mt-2 max-w-xl font-sans text-sm text-muted">
                {recentlyAdded.description}
              </p>
            </div>
            <span className="font-sans text-sm text-terracotta transition-transform group-hover:translate-x-1">
              View recipe &rarr;
            </span>
          </Link>
        </FadeIn>
      </section>
    </main>
  )
}
