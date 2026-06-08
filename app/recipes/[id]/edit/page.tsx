import { notFound, redirect } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import RecipeForm from "@/components/recipes/RecipeForm"
import { createClient } from "@/lib/supabase/server"
import { getRecipeBySlug } from "@/lib/recipes/queries"
import { updateRecipe } from "@/lib/recipes/actions"

interface EditRecipePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const recipe = await getRecipeBySlug(id)
  if (!recipe) notFound()
  if (recipe.ownerId !== user.id) redirect(`/recipes/${recipe.id}`)

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Edit recipe
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">{recipe.name}</h1>
      </FadeIn>

      <FadeIn delay={100}>
        <RecipeForm
          action={updateRecipe}
          submitLabel="Save changes"
          pendingLabel="Saving…"
          hiddenFields={[
            { name: "recipeId", value: recipe.dbId },
            { name: "currentSlug", value: recipe.id },
          ]}
          initialValues={{
            name: recipe.name,
            description: recipe.description,
            servings: recipe.servings,
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            imageGradient: recipe.imageGradient,
          }}
        />
      </FadeIn>
    </main>
  )
}
