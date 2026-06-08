import "server-only"
import { createClient } from "@/lib/supabase/server"

export interface EventGuest {
  id: string
  userId: string | null
  name: string
  rsvp: "accepted" | "declined" | "pending"
  allergies: string[]
}

export interface EventMealRecipe {
  position: number
  recipe: {
    name: string
    ingredients: Array<{ amount: string; item: string }>
  }
}

export interface Event {
  id: string
  dbId: string
  name: string
  eventDate: string
  hostId: string
  hostName: string
  status: "upcoming" | "pending-rsvp"
  mealDbId: string | null
  mealId: string | null
  mealName: string | null
  mealRecipes: EventMealRecipe[]
  guests: EventGuest[]
}

const EVENT_SELECT = [
  "id, slug, name, event_date, host_id, status, meal_id",
  "profiles!events_host_id_fkey(name)",
  "meals(id, slug, name, meal_recipes(position, recipes(name, ingredients)))",
  "guests(id, user_id, name, rsvp, allergies)",
].join(", ")

type GuestRow = { id: string; user_id: string | null; name: string; rsvp: string; allergies: string[] }
type MealRecipeRow = { position: number; recipes: { name: string; ingredients: Array<{ amount: string; item: string }> } }
type MealRow = { id: string; slug: string; name: string; meal_recipes: MealRecipeRow[] }
type EventRow = Record<string, unknown> & {
  profiles: { name: string } | null
  meals: MealRow | null
  guests: GuestRow[]
}

function toEvent(row: EventRow): Event {
  const meal = row.meals
  const mealRecipes: EventMealRecipe[] = meal?.meal_recipes
    ? [...meal.meal_recipes]
        .sort((a, b) => a.position - b.position)
        .map((mr) => ({ position: mr.position, recipe: mr.recipes }))
    : []

  return {
    id: row.slug as string,
    dbId: row.id as string,
    name: row.name as string,
    eventDate: row.event_date as string,
    hostId: row.host_id as string,
    hostName: row.profiles?.name ?? "Unknown",
    status: row.status as "upcoming" | "pending-rsvp",
    mealDbId: row.meal_id as string | null,
    mealId: meal?.slug ?? null,
    mealName: meal?.name ?? null,
    mealRecipes,
    guests: (row.guests ?? []).map((g) => ({
      id: g.id,
      userId: g.user_id,
      name: g.name,
      rsvp: g.rsvp as "accepted" | "declined" | "pending",
      allergies: g.allergies ?? [],
    })),
  }
}

export async function listEvents(): Promise<Event[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .order("event_date", { ascending: true })
  if (error) throw new Error(error.message)
  return (data as unknown as EventRow[]).map(toEvent)
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("slug", slug)
    .single()
  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(error.message)
  }
  return toEvent(data as unknown as EventRow)
}
