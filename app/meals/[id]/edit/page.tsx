import { notFound, redirect } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import MealForm from "@/components/meals/MealForm"
import { createClient } from "@/lib/supabase/server"
import { getMealBySlug } from "@/lib/meals/queries"
import { updateMeal } from "@/lib/meals/actions"

interface EditMealPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMealPage({ params }: EditMealPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const meal = await getMealBySlug(id)
  if (!meal) notFound()
  if (meal.ownerId !== user.id) redirect(`/meals/${meal.id}`)

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Edit meal
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">{meal.name}</h1>
      </FadeIn>

      <FadeIn delay={100}>
        <MealForm
          action={updateMeal}
          submitLabel="Save changes"
          pendingLabel="Saving…"
          hiddenFields={[
            { name: "mealId", value: meal.dbId },
            { name: "currentSlug", value: meal.id },
          ]}
          initialValues={{ name: meal.name, totalServings: meal.totalServings }}
        />
      </FadeIn>
    </main>
  )
}
