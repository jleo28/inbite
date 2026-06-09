import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import { createClient } from "@/lib/supabase/server"
import { getRecipeBySlug } from "@/lib/recipes/queries"
import { listMealsOwnedBy } from "@/lib/meals/queries"
import { deleteRecipe } from "@/lib/recipes/actions"
import AddToMealButton from "./AddToMealButton"

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params
  const recipe = await getRecipeBySlug(id)

  if (!recipe) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ownMeals = user ? await listMealsOwnedBy(user.id) : []
  const isOwner = Boolean(user && recipe.ownerId === user.id)

  return (
    <main className="flex-1">
      {recipe.photoUrl ? (
        <div className="relative h-72 w-full overflow-hidden sm:h-96">
          <Image src={recipe.photoUrl} alt={recipe.name} fill className="object-cover" />
        </div>
      ) : (
        <div className={`grain-overlay h-72 w-full bg-gradient-to-br ${recipe.imageGradient} sm:h-96`} />
      )}

      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <FadeIn>
          <div className="flex flex-wrap items-start justify-between gap-4">
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
            {isOwner ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="font-sans text-sm text-terracotta hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteRecipe}>
                  <input type="hidden" name="recipeId" value={recipe.dbId} />
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
          <h1 className="mt-4 font-display text-4xl text-espresso sm:text-5xl">{recipe.name}</h1>
          <p className="mt-4 max-w-xl font-sans text-base text-muted">{recipe.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <p className="font-sans text-sm text-muted">Serves {recipe.servings}</p>
            <AddToMealButton
              recipeId={recipe.dbId}
              recipeSlug={recipe.id}
              recipeName={recipe.name}
              isSignedIn={Boolean(user)}
              ownMeals={ownMeals}
            />
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
