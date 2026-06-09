"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return base || "event"
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeEventId?: string
) {
  let candidate = base
  let suffix = 2

  while (true) {
    let query = supabase.from("events").select("id").eq("slug", candidate)
    if (excludeEventId) query = query.neq("id", excludeEventId)
    const { data } = await query.maybeSingle()
    if (!data) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export async function createEvent(prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string).trim()
  const eventDate = formData.get("eventDate") as string
  const status = (formData.get("status") as string) || "pending-rsvp"
  const mealId = (formData.get("mealId") as string) || null

  if (!name) return { error: "Event name is required." }
  if (!eventDate) return { error: "Event date is required." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "You must be signed in." }

  const slug = await uniqueSlug(supabase, slugify(name))

  const { error } = await supabase.from("events").insert({
    slug,
    name,
    event_date: eventDate,
    host_id: user.id,
    status,
    meal_id: mealId || null,
  })

  if (error) return { error: error.message }

  redirect(`/events/${slug}`)
}

export async function updateEvent(prevState: unknown, formData: FormData) {
  const dbId = formData.get("dbId") as string
  const name = (formData.get("name") as string).trim()
  const eventDate = formData.get("eventDate") as string
  const status = formData.get("status") as string
  const mealId = (formData.get("mealId") as string) || null

  if (!name) return { error: "Event name is required." }
  if (!eventDate) return { error: "Event date is required." }

  const supabase = await createClient()
  const slug = await uniqueSlug(supabase, slugify(name), dbId)

  const { error } = await supabase
    .from("events")
    .update({ slug, name, event_date: eventDate, status, meal_id: mealId || null })
    .eq("id", dbId)

  if (error) return { error: error.message }

  revalidatePath("/events")
  redirect(`/events/${slug}`)
}

export async function deleteEvent(formData: FormData) {
  const dbId = formData.get("dbId") as string
  const supabase = await createClient()
  await supabase.from("events").delete().eq("id", dbId)
  redirect("/events")
}

export async function addGuest(prevState: unknown, formData: FormData) {
  const eventId = formData.get("eventId") as string
  const eventSlug = formData.get("eventSlug") as string
  const name = (formData.get("guestName") as string).trim()
  const email = ((formData.get("guestEmail") as string) || "").trim().toLowerCase()
  const allergies = formData.getAll("allergies") as string[]

  if (!name) return { error: "Guest name is required." }

  const supabase = await createClient()

  let userId: string | null = null
  if (email) {
    const { data } = await supabase.rpc("lookup_user_id_by_email", { p_email: email })
    userId = (data as string | null) ?? null
  }
  const { error } = await supabase.from("guests").insert({
    event_id: eventId,
    name,
    user_id: userId,
    rsvp: "pending",
    allergies,
  })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventSlug}`)
  return { message: `${name} invited.` }
}

export async function removeGuest(prevState: unknown, formData: FormData) {
  const guestId = formData.get("guestId") as string

  const supabase = await createClient()
  const { error } = await supabase.from("guests").delete().eq("id", guestId)

  if (error) return { error: error.message }

  return { message: "Guest removed." }
}

export async function respondToInvite(prevState: unknown, formData: FormData) {
  const guestId = formData.get("guestId") as string
  const rsvp = formData.get("rsvp") as string
  const eventSlug = formData.get("eventSlug") as string

  const supabase = await createClient()
  const { error } = await supabase.rpc("respond_to_invite", {
    p_guest_id: guestId,
    p_rsvp: rsvp,
  })

  if (error) return { error: error.message }

  revalidatePath(`/events/${eventSlug}`)
  revalidatePath("/events")
  revalidatePath("/")

  const message =
    rsvp === "accepted"
      ? "You're in! See you there."
      : "Got it, we'll let the host know you can't make it."
  return { message }
}
