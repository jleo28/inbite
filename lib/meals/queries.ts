import "server-only"

import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/database.types"

export interface MealRecipe {
  id: string
  dbId: string
  name: string
  description: string
  servings: number
  imageGradient: string
  ingredients: { amount: string; item: string }[]
}

export interface Meal {
  id: string
  dbId: string
  name: string
  totalServings: number
  ownerId: string | null
  recipes: MealRecipe[]
}

export interface MealOption {
  id: string
  slug: string
  name: string
}

interface MealRow {
  id: string
  slug: string
  name: string
  total_servings: number
  created_by: string | null
  meal_recipes: { position: number; recipes: Tables<"recipes"> | null }[]
}

const MEAL_SELECT = "id, slug, name, total_servings, created_by, meal_recipes(position, recipes(*))"

function toMeal(row: MealRow): Meal {
  const recipes = [...row.meal_recipes]
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.recipes)
    .filter((recipe): recipe is Tables<"recipes"> => Boolean(recipe))
    .map((recipe) => ({
      id: recipe.slug,
      dbId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      servings: recipe.servings,
      imageGradient: recipe.image_gradient,
      ingredients: recipe.ingredients as MealRecipe["ingredients"],
    }))

  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    totalServings: row.total_servings,
    ownerId: row.created_by,
    recipes,
  }
}

export async function listMeals(): Promise<Meal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("meals")
    .select(MEAL_SELECT)
    .order("created_at", { ascending: true })

  if (error) throw error
  return ((data ?? []) as unknown as MealRow[]).map(toMeal)
}

export async function getMealBySlug(slug: string): Promise<Meal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("meals")
    .select(MEAL_SELECT)
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  return data ? toMeal(data as unknown as MealRow) : null
}

export async function listMealsOwnedBy(userId: string): Promise<MealOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("meals")
    .select("id, slug, name")
    .eq("created_by", userId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data ?? []
}
