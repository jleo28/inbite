import "server-only"

import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/database.types"

export interface Recipe {
  id: string
  dbId: string
  name: string
  description: string
  tags: string[]
  servings: number
  ingredients: { amount: string; item: string }[]
  steps: string[]
  imageGradient: string
  ownerId: string | null
}

function toRecipe(row: Tables<"recipes">): Recipe {
  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    description: row.description,
    tags: row.tags,
    servings: row.servings,
    ingredients: row.ingredients as Recipe["ingredients"],
    steps: row.steps,
    imageGradient: row.image_gradient,
    ownerId: row.created_by,
  }
}

export async function listRecipes(): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data ?? []).map(toRecipe)
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("recipes").select("*").eq("slug", slug).maybeSingle()

  if (error) throw error
  return data ? toRecipe(data) : null
}
