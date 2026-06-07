import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import { recipes } from "@/lib/data"
import AddToMealButton from "./AddToMealButton"

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params
  const recipe = recipes.find((item) => item.id === id)

  if (!recipe) {
    notFound()
  }

  return (
    <main className="flex-1">
      <div className={`grain-overlay h-72 w-full bg-gradient-to-br ${recipe.imageGradient} sm:h-96`} />

      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <FadeIn>
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
          <h1 className="mt-4 font-display text-4xl text-espresso sm:text-5xl">{recipe.name}</h1>
          <p className="mt-4 max-w-xl font-sans text-base text-muted">{recipe.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <p className="font-sans text-sm text-muted">Serves {recipe.servings}</p>
            <AddToMealButton recipeName={recipe.name} />
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h2 className="mt-14 font-display text-2xl text-espresso">Ingredients</h2>
          <ul className="mt-5 grid gap-3 font-sans text-sm text-espresso sm:grid-cols-2">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.item} className="flex gap-2">
                <span className="font-medium text-terracotta">{ingredient.amount}</span>
                <span>{ingredient.item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={150}>
          <h2 className="mt-14 font-display text-2xl text-espresso">Steps</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-4 font-sans text-sm text-espresso">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/15 font-sans text-sm font-medium text-terracotta">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </main>
  )
}
