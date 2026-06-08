"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type MealFormState = { error: string } | undefined
export type AddToMealState = { error: string } | { message: string } | undefined

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return base || "meal"
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeMealId?: string
) {
  let candidate = base
  let suffix = 2

  while (true) {
    let query = supabase.from("meals").select("id").eq("slug", candidate)
    if (excludeMealId) query = query.neq("id", excludeMealId)

    const { data } = await query.maybeSingle()
    if (!data) return candidate

    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

function parseMealForm(formData: FormData): { name: string; totalServings: number } | { error: string } {
  const name = formData.get("name")?.toString().trim() ?? ""
  const totalServings = Number(formData.get("totalServings"))

  if (!name) return { error: "Give your meal a name." }
  if (!Number.isFinite(totalServings) || totalServings < 1) {
    return { error: "Total servings must be at least 1." }
  }

  return { name, totalServings }
}

export async function createMeal(
  _prevState: MealFormState,
  formData: FormData
): Promise<MealFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sign in to create a meal." }

  const parsed = parseMealForm(formData)
  if ("error" in parsed) return parsed

  const slug = await uniqueSlug(supabase, slugify(parsed.name))

  const { data, error } = await supabase
    .from("meals")
    .insert({ slug, name: parsed.name, total_servings: parsed.totalServings, created_by: user.id })
    .select("slug")
    .single()

  if (error || !data) return { error: "Something went wrong creating your meal. Try again." }

  revalidatePath("/meals")
  redirect(`/meals/${data.slug}`)
}

export async function updateMeal(
  _prevState: MealFormState,
  formData: FormData
): Promise<MealFormState> {
  const mealId = formData.get("mealId")?.toString() ?? ""
  const currentSlug = formData.get("currentSlug")?.toString() ?? ""
  if (!mealId || !currentSlug) return { error: "Missing meal reference." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sign in to edit this meal." }

  const parsed = parseMealForm(formData)
  if ("error" in parsed) return parsed

  const slugBase = slugify(parsed.name)
  const slug = slugBase === currentSlug ? currentSlug : await uniqueSlug(supabase, slugBase, mealId)

  const { data, error } = await supabase
    .from("meals")
    .update({ slug, name: parsed.name, total_servings: parsed.totalServings })
    .eq("id", mealId)
    .eq("created_by", user.id)
    .select("slug")
    .single()

  if (error || !data) return { error: "We couldn't save your changes. Try again." }

  revalidatePath("/meals")
  revalidatePath(`/meals/${currentSlug}`)
  if (data.slug !== currentSlug) revalidatePath(`/meals/${data.slug}`)
  redirect(`/meals/${data.slug}`)
}

export async function deleteMeal(formData: FormData) {
  const mealId = formData.get("mealId")?.toString() ?? ""
  if (!mealId) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from("meals").delete().eq("id", mealId).eq("created_by", user.id)

  revalidatePath("/meals")
  redirect("/meals")
}

export async function addRecipeToMeal(
  _prevState: AddToMealState,
  formData: FormData
): Promise<AddToMealState> {
  const recipeId = formData.get("recipeId")?.toString() ?? ""
  const recipeName = formData.get("recipeName")?.toString() ?? "this recipe"
  const recipeSlug = formData.get("recipeSlug")?.toString() ?? ""
  const mode = formData.get("mode")?.toString() ?? "existing"
  if (!recipeId || !recipeSlug) return { error: "Missing recipe reference." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sign in to add this recipe to a meal." }

  let mealId: string
  let mealName: string

  if (mode === "new") {
    const name = formData.get("mealName")?.toString().trim() ?? ""
    const totalServings = Number(formData.get("mealServings"))

    if (!name) return { error: "Give your meal a name." }
    if (!Number.isFinite(totalServings) || totalServings < 1) {
      return { error: "Total servings must be at least 1." }
    }

    const slug = await uniqueSlug(supabase, slugify(name))
    const { data, error } = await supabase
      .from("meals")
      .insert({ slug, name, total_servings: totalServings, created_by: user.id })
      .select("id, name")
      .single()

    if (error || !data) return { error: "Something went wrong creating your meal. Try again." }
    mealId = data.id
    mealName = data.name
  } else {
    mealId = formData.get("mealId")?.toString() ?? ""
    if (!mealId) return { error: "Pick a meal to add this recipe to." }

    const { data: meal } = await supabase
      .from("meals")
      .select("name")
      .eq("id", mealId)
      .eq("created_by", user.id)
      .maybeSingle()

    if (!meal) return { error: "We couldn't find that meal." }
    mealName = meal.name
  }

  const { data: existing } = await supabase
    .from("meal_recipes")
    .select("position")
    .eq("meal_id", mealId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextPosition = existing ? existing.position + 1 : 0

  const { error: insertError } = await supabase
    .from("meal_recipes")
    .insert({ meal_id: mealId, recipe_id: recipeId, position: nextPosition })

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: `${recipeName} is already in ${mealName}.` }
    }
    return { error: "Something went wrong adding that recipe. Try again." }
  }

  revalidatePath("/meals")
  revalidatePath(`/recipes/${recipeSlug}`)
  return { message: `Added ${recipeName} to ${mealName}.` }
}

export async function removeRecipeFromMeal(formData: FormData) {
  const mealId = formData.get("mealId")?.toString() ?? ""
  const recipeId = formData.get("recipeId")?.toString() ?? ""
  const mealSlug = formData.get("mealSlug")?.toString() ?? ""
  if (!mealId || !recipeId) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from("meal_recipes").delete().eq("meal_id", mealId).eq("recipe_id", recipeId)

  revalidatePath("/meals")
  if (mealSlug) revalidatePath(`/meals/${mealSlug}`)
}
