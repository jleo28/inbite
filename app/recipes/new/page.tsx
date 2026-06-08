import { redirect } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import RecipeForm from "@/components/recipes/RecipeForm"
import { createClient } from "@/lib/supabase/server"
import { createRecipe } from "@/lib/recipes/actions"

export default async function NewRecipePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Share a dish
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">New recipe</h1>
        <p className="mt-3 max-w-xl font-sans text-base text-muted">
          Add a recipe to the collection so you can build it into meals and share it with
          your guests.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <RecipeForm action={createRecipe} submitLabel="Save recipe" pendingLabel="Saving…" />
      </FadeIn>
    </main>
  )
}
