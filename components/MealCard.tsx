import type { Meal, Recipe } from "@/lib/data"
import { recipes } from "@/lib/data"

interface MealCardProps {
  meal: Meal
}

export default function MealCard({ meal }: MealCardProps) {
  const mealRecipes = meal.recipeIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))

  return (
    <div className="rounded-2xl border border-stone bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10">
      <h3 className="font-display text-xl text-espresso">{meal.name}</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {mealRecipes.map((recipe) => (
          <li key={recipe.id} className="flex items-center gap-2 font-sans text-sm text-espresso">
            <span className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${recipe.imageGradient}`} />
            {recipe.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-sans text-sm text-muted">Serves {meal.totalServings} in total</p>
    </div>
  )
}
