import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import RecipeCard from "@/components/RecipeCard"
import FadeIn from "@/components/FadeIn"
import InvitationCard from "@/components/home/InvitationCard"
import { createClient } from "@/lib/supabase/server"
import { listRecipes } from "@/lib/recipes/queries"
import { listEvents } from "@/lib/events/queries"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const recipes = await listRecipes()
  const featured = recipes.slice(0, 3)
  const recentlyAdded = recipes[recipes.length - 1]

  let pendingInvite: { event: Awaited<ReturnType<typeof listEvents>>[number]; myGuest: NonNullable<Awaited<ReturnType<typeof listEvents>>[number]["guests"][number]> } | null =
    null

  if (user) {
    const events = await listEvents()
    for (const event of events) {
      if (event.hostId === user.id) continue
      const guest = event.guests.find((g) => g.userId === user.id && g.rsvp === "pending")
      if (guest) {
        pendingInvite = { event, myGuest: guest }
        break
      }
    }
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
            {pendingInvite ? (
              <InvitationCard invite={pendingInvite.event} myGuest={pendingInvite.myGuest} />
            ) : (
              <div className="rounded-2xl border border-stone bg-cream p-8 sm:p-10">
                <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
                  Gather your people
                </p>
                <h2 className="mt-3 font-display text-3xl text-espresso">
                  Plan an event around your meals
                </h2>
                <p className="mt-2 font-sans text-sm text-muted">
                  Create a get-together, link a meal, and invite your guests — all in one place.
                </p>
                <div className="mt-6">
                  {user ? (
                    <Link
                      href="/events/new"
                      className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
                    >
                      Create an event
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
                    >
                      Sign up free
                    </Link>
                  )}
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {recentlyAdded ? (
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
      ) : null}
    </main>
  )
}
