import Link from "next/link"
import FadeIn from "@/components/FadeIn"
import RecipeBrowser from "@/components/recipes/RecipeBrowser"
import { createClient } from "@/lib/supabase/server"
import { listRecipes } from "@/lib/recipes/queries"

export default async function RecipesPage() {
  const supabase = await createClient()
  const [
    {
      data: { user },
    },
    recipes,
  ] = await Promise.all([supabase.auth.getUser(), listRecipes()])

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
              The collection
            </p>
            <h1 className="mt-3 font-display text-4xl text-espresso">Recipes</h1>
            <p className="mt-3 max-w-xl font-sans text-base text-muted">
              A growing collection of dishes worth making again, from weeknight staples to
              slow Sunday projects.
            </p>
          </div>
          {user ? (
            <Link
              href="/recipes/new"
              className="self-start rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 sm:self-auto"
            >
              New recipe
            </Link>
          ) : null}
        </div>
      </FadeIn>

      <RecipeBrowser recipes={recipes} />
    </main>
  )
}
