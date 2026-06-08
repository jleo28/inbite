interface Ingredient {
  amount: string
  item: string
}

interface MealRecipe {
  recipe: { ingredients: Ingredient[] }
}

interface ShoppingListPreviewProps {
  mealName: string
  mealRecipes: MealRecipe[]
}

export default function ShoppingListPreview({ mealName, mealRecipes }: ShoppingListPreviewProps) {
  const aggregated = new Map<string, string[]>()
  for (const { recipe } of mealRecipes) {
    for (const ingredient of recipe.ingredients) {
      const amounts = aggregated.get(ingredient.item) ?? []
      amounts.push(ingredient.amount)
      aggregated.set(ingredient.item, amounts)
    }
  }

  return (
    <div className="rounded-2xl border border-stone bg-cream p-6 sm:p-8">
      <h3 className="font-display text-xl text-espresso">Shopping list</h3>
      <p className="mt-1 font-sans text-sm text-muted">Combined ingredients for {mealName}</p>
      {aggregated.size > 0 ? (
        <ul className="mt-5 grid gap-2.5 font-sans text-sm text-espresso sm:grid-cols-2">
          {Array.from(aggregated.entries()).map(([item, amounts]) => (
            <li key={item} className="flex gap-2">
              <span className="font-medium text-terracotta">{amounts.join(" + ")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-sans text-sm text-muted">No ingredients added yet.</p>
      )}
    </div>
  )
}
