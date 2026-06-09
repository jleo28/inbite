import Link from "next/link"

interface RecipeCardProps {
  recipe: {
    id: string
    name: string
    tags: string[]
    servings: number
    imageGradient: string
  }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone bg-cream transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10"
    >
      <div className="h-44 w-full" style={{ backgroundImage: recipe.imageGradient }} />
      <div className="flex flex-col gap-3 p-6">
        <h3 className="font-display text-xl text-espresso">{recipe.name}</h3>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone/60 px-3 py-1 font-sans text-xs text-espresso"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="font-sans text-sm text-muted">Serves {recipe.servings}</p>
      </div>
    </Link>
  )
}
