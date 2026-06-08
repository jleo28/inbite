import { redirect } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import MealForm from "@/components/meals/MealForm"
import { createClient } from "@/lib/supabase/server"
import { createMeal } from "@/lib/meals/actions"

export default async function NewMealPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Build a spread
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">New meal</h1>
        <p className="mt-3 max-w-xl font-sans text-base text-muted">
          Give your meal a name and a serving size, then add recipes to it from the
          collection.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <MealForm action={createMeal} submitLabel="Create meal" pendingLabel="Creating…" />
      </FadeIn>
    </main>
  )
}
