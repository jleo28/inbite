import type { Recipe } from "@/lib/data"
import { meals, recipes } from "@/lib/data"

interface ShoppingListPreviewProps {
  mealId: string
}

export default function ShoppingListPreview({ mealId }: ShoppingListPreviewProps) {
  const meal = meals.find((item) => item.id === mealId)

  const mealRecipes = (meal?.recipeIds ?? [])
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))

  const aggregated = new Map<string, string[]>()
  for (const recipe of mealRecipes) {
    for (const ingredient of recipe.ingredients) {
      const amounts = aggregated.get(ingredient.item) ?? []
      amounts.push(ingredient.amount)
      aggregated.set(ingredient.item, amounts)
    }
  }

  return (
    <div className="rounded-2xl border border-stone bg-cream p-6 sm:p-8">
      <h3 className="font-display text-xl text-espresso">Shopping list</h3>
      <p className="mt-1 font-sans text-sm text-muted">
        Combined ingredients for {meal?.name ?? "this meal"}
      </p>
      <ul className="mt-5 grid gap-2.5 font-sans text-sm text-espresso sm:grid-cols-2">
        {Array.from(aggregated.entries()).map(([item, amounts]) => (
          <li key={item} className="flex gap-2">
            <span className="font-medium text-terracotta">{amounts.join(" + ")}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
