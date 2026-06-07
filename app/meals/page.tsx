"use client"

import FadeIn from "@/components/FadeIn"
import MealCard from "@/components/MealCard"
import { useToast } from "@/components/Toast"
import { meals } from "@/lib/data"

export default function MealsPage() {
  const { showToast } = useToast()

  function handleCreateMeal() {
    showToast("Coming soon, check back soon!")
  }

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
          <button
            type="button"
            onClick={handleCreateMeal}
            className="self-start rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 sm:self-auto"
          >
            Create Meal
          </button>
        </div>
      </FadeIn>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {meals.map((meal, index) => (
          <FadeIn key={meal.id} delay={index * 100}>
            <MealCard meal={meal} />
          </FadeIn>
        ))}
      </div>
    </main>
  )
}
