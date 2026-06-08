import Link from "next/link"

interface MealCardProps {
  meal: {
    id: string
    name: string
    totalServings: number
    recipes: { id: string; name: string; imageGradient: string }[]
  }
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <Link
      href={`/meals/${meal.id}`}
      className="block rounded-2xl border border-stone bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10"
    >
      <h3 className="font-display text-xl text-espresso">{meal.name}</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {meal.recipes.map((recipe) => (
          <li key={recipe.id} className="flex items-center gap-2 font-sans text-sm text-espresso">
            <span className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${recipe.imageGradient}`} />
            {recipe.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-sans text-sm text-muted">Serves {meal.totalServings} in total</p>
    </Link>
  )
}
