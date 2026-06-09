"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { RECIPE_GRADIENTS } from "./constants"

export type RecipeFormState = { error: string } | undefined

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return base || "recipe"
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeRecipeId?: string
) {
  let candidate = base
  let suffix = 2

  while (true) {
    let query = supabase.from("recipes").select("id").eq("slug", candidate)
    if (excludeRecipeId) query = query.neq("id", excludeRecipeId)

    const { data } = await query.maybeSingle()
    if (!data) return candidate

    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

function parseTags(formData: FormData) {
  return (formData.get("tags")?.toString() ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseIngredients(formData: FormData) {
  const amounts = formData.getAll("ingredientAmount").map((value) => value.toString().trim())
  const items = formData.getAll("ingredientItem").map((value) => value.toString().trim())

  const ingredients: { amount: string; item: string }[] = []
  for (let i = 0; i < Math.max(amounts.length, items.length); i++) {
    const amount = amounts[i] ?? ""
    const item = items[i] ?? ""
    if (amount || item) ingredients.push({ amount, item })
  }
  return ingredients
}

function parseSteps(formData: FormData) {
  return formData
    .getAll("step")
    .map((value) => value.toString().trim())
    .filter(Boolean)
}

interface ParsedRecipeForm {
  name: string
  description: string
  servings: number
  imageGradient: string
  tags: string[]
  ingredients: { amount: string; item: string }[]
  steps: string[]
}

function parseRecipeForm(formData: FormData): ParsedRecipeForm | { error: string } {
  const name = formData.get("name")?.toString().trim() ?? ""
  const description = formData.get("description")?.toString().trim() ?? ""
  const servings = Number(formData.get("servings"))
  const imageGradient = formData.get("imageGradient")?.toString() ?? ""
  const tags = parseTags(formData)
  const ingredients = parseIngredients(formData)
  const steps = parseSteps(formData)

  if (!name) return { error: "Give your recipe a name." }
  if (!description) return { error: "Add a short description." }
  if (!Number.isFinite(servings) || servings < 1) return { error: "Servings must be at least 1." }
  if (!RECIPE_GRADIENTS.includes(imageGradient as (typeof RECIPE_GRADIENTS)[number])) {
    return { error: "Pick a cover style for your recipe." }
  }
  if (tags.length === 0) return { error: "Add at least one tag." }
  if (ingredients.length === 0) return { error: "Add at least one ingredient." }
  if (steps.length === 0) return { error: "Add at least one step." }

  return { name, description, servings, imageGradient, tags, ingredients, steps }
}

export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sign in to add a recipe." }

  const parsed = parseRecipeForm(formData)
  if ("error" in parsed) return parsed

  const slug = await uniqueSlug(supabase, slugify(parsed.name))

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      slug,
      name: parsed.name,
      description: parsed.description,
      servings: parsed.servings,
      image_gradient: parsed.imageGradient,
      tags: parsed.tags,
      ingredients: parsed.ingredients,
      steps: parsed.steps,
      created_by: user.id,
    })
    .select("id, slug")
    .single()

  if (error || !data) return { error: "Something went wrong saving your recipe. Try again." }

  const photo = formData.get("photo") as File | null
  if (photo && photo.size > 0) {
    const adminClient = createAdminClient()
    const buffer = Buffer.from(await photo.arrayBuffer())
    const { error: uploadError } = await adminClient.storage
      .from("recipe-photos")
      .upload(data.id, buffer, { contentType: photo.type, upsert: true })
    if (!uploadError) {
      const { data: { publicUrl } } = adminClient.storage
        .from("recipe-photos")
        .getPublicUrl(data.id)
      await supabase.from("recipes").update({ photo_url: publicUrl }).eq("id", data.id)
    }
  }

  revalidatePath("/recipes")
  redirect(`/recipes/${data.slug}`)
}

export async function updateRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const recipeId = formData.get("recipeId")?.toString() ?? ""
  const currentSlug = formData.get("currentSlug")?.toString() ?? ""
  if (!recipeId || !currentSlug) return { error: "Missing recipe reference." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sign in to edit this recipe." }

  const parsed = parseRecipeForm(formData)
  if ("error" in parsed) return parsed

  const slugBase = slugify(parsed.name)
  const slug = slugBase === currentSlug ? currentSlug : await uniqueSlug(supabase, slugBase, recipeId)

  const photo = formData.get("photo") as File | null
  let photoUrl: string | undefined = undefined
  if (photo && photo.size > 0) {
    const adminClient = createAdminClient()
    const buffer = Buffer.from(await photo.arrayBuffer())
    const { error: uploadError } = await adminClient.storage
      .from("recipe-photos")
      .upload(recipeId, buffer, { contentType: photo.type, upsert: true })
    if (!uploadError) {
      const { data: { publicUrl } } = adminClient.storage
        .from("recipe-photos")
        .getPublicUrl(recipeId)
      photoUrl = publicUrl
    }
  }

  const { data, error } = await supabase
    .from("recipes")
    .update({
      slug,
      name: parsed.name,
      description: parsed.description,
      servings: parsed.servings,
      image_gradient: parsed.imageGradient,
      tags: parsed.tags,
      ingredients: parsed.ingredients,
      steps: parsed.steps,
      ...(photoUrl !== undefined ? { photo_url: photoUrl } : {}),
    })
    .eq("id", recipeId)
    .eq("created_by", user.id)
    .select("slug")
    .single()

  if (error || !data) return { error: "We couldn't save your changes. Try again." }

  revalidatePath("/recipes")
  revalidatePath(`/recipes/${currentSlug}`)
  if (data.slug !== currentSlug) revalidatePath(`/recipes/${data.slug}`)
  redirect(`/recipes/${data.slug}`)
}

export async function deleteRecipe(formData: FormData) {
  const recipeId = formData.get("recipeId")?.toString() ?? ""
  if (!recipeId) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from("recipes").delete().eq("id", recipeId).eq("created_by", user.id)

  const adminClient = createAdminClient()
  await adminClient.storage.from("recipe-photos").remove([recipeId])

  revalidatePath("/recipes")
  redirect("/recipes")
}
