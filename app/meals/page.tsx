import Link from "next/link"
import FadeIn from "@/components/FadeIn"
import MealCard from "@/components/MealCard"
import { listMeals } from "@/lib/meals/queries"

export default async function MealsPage() {
  const meals = await listMeals()

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
              Build a spread
            </p>
            <h1 className="mt-3 font-display text-4xl text-espresso">Meals</h1>
            <p className="mt-3 max-w-xl font-sans text-base text-muted">
              Group recipes together into meals you can plan around and share with
              the people coming over.
            </p>
          </div>
          <Link
            href="/meals/new"
            className="self-start rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 sm:self-auto"
          >
            Create Meal
          </Link>
        </div>
      </FadeIn>

      {meals.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {meals.map((meal, index) => (
            <FadeIn key={meal.id} delay={index * 100}>
              <MealCard meal={meal} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center font-sans text-sm text-muted">
          No meals yet. Create one and start adding recipes to it.
        </p>
      )}
    </main>
  )
}
