import Link from "next/link"
import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import { createClient } from "@/lib/supabase/server"
import { getMealBySlug } from "@/lib/meals/queries"
import { deleteMeal, removeRecipeFromMeal } from "@/lib/meals/actions"

interface MealDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MealDetailPage({ params }: MealDetailPageProps) {
  const { id } = await params
  const meal = await getMealBySlug(id)

  if (!meal) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = Boolean(user && meal.ownerId === user.id)

  const shoppingList = new Map<string, string[]>()
  for (const recipe of meal.recipes) {
    for (const ingredient of recipe.ingredients) {
      const amounts = shoppingList.get(ingredient.item) ?? []
      amounts.push(ingredient.amount)
      shoppingList.set(ingredient.item, amounts)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
              Meal
            </p>
            <h1 className="mt-3 font-display text-4xl text-espresso">{meal.name}</h1>
            <p className="mt-2 font-sans text-sm text-muted">Serves {meal.totalServings} in total</p>
          </div>
          {isOwner ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/meals/${meal.id}/edit`}
                className="font-sans text-sm text-terracotta hover:underline"
              >
                Edit
              </Link>
              <form action={deleteMeal}>
                <input type="hidden" name="mealId" value={meal.dbId} />
                <button
                  type="submit"
                  className="font-sans text-sm text-muted transition-colors hover:text-terracotta"
                >
                  Delete
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <h2 className="mt-12 font-display text-2xl text-espresso">Recipes</h2>
        {meal.recipes.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-3">
            {meal.recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-stone bg-cream p-5"
              >
                <Link href={`/recipes/${recipe.id}`} className="flex items-center gap-3 group">
                  <span className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${recipe.imageGradient}`} />
                  <span className="font-sans text-sm text-espresso group-hover:text-terracotta">
                    {recipe.name}
                  </span>
                </Link>
                {isOwner ? (
                  <form action={removeRecipeFromMeal}>
                    <input type="hidden" name="mealId" value={meal.dbId} />
                    <input type="hidden" name="recipeId" value={recipe.dbId} />
                    <input type="hidden" name="mealSlug" value={meal.id} />
                    <button
                      type="submit"
                      className="font-sans text-sm text-muted transition-colors hover:text-terracotta"
                    >
                      Remove
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 font-sans text-sm text-muted">
            No recipes yet. Add some from the collection to build out this meal.
          </p>
        )}
      </FadeIn>

      {shoppingList.size > 0 ? (
        <FadeIn delay={150}>
          <div className="mt-12 rounded-2xl border border-stone bg-cream p-6 sm:p-8">
            <h2 className="font-display text-xl text-espresso">Shopping list</h2>
            <p className="mt-1 font-sans text-sm text-muted">Combined ingredients for {meal.name}</p>
            <ul className="mt-5 grid gap-2.5 font-sans text-sm text-espresso sm:grid-cols-2">
              {Array.from(shoppingList.entries()).map(([item, amounts]) => (
                <li key={item} className="flex gap-2">
                  <span className="font-medium text-terracotta">{amounts.join(" + ")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      ) : null}
    </main>
  )
}
