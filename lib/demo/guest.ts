import { createAdminClient } from "@/lib/supabase/admin"

// ─── Guest demo world ────────────────────────────────────────────────────────
// A shared guest account with a planned meal, a hosted event with guests, and
// an invite from a demo friend waiting for an RSVP. No password exists: sign-in
// goes through a server-generated magic-link token (see signInAsGuest). The
// daily cron calls resetDemoWorld() to wipe whatever visitors changed.

export const GUEST_EMAIL = "guest@demo.jleo.me"
const FRIEND_EMAIL = "maya@demo.jleo.me"

const PEOPLE = [
  { email: GUEST_EMAIL, name: "Guest Cook", initials: "GC" },
  { email: FRIEND_EMAIL, name: "Maya Chen", initials: "MC" },
] as const

type Admin = ReturnType<typeof createAdminClient>

async function findUserId(admin: Admin, email: string): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email === email)
    if (hit) return hit.id
    if (data.users.length < 200) return null
  }
  return null
}

async function ensureUser(admin: Admin, p: (typeof PEOPLE)[number]): Promise<string> {
  let id = await findUserId(admin, p.email)
  if (!id) {
    const { data, error } = await admin.auth.admin.createUser({
      email: p.email,
      email_confirm: true,
      user_metadata: { name: p.name, initials: p.initials, demo: true },
    })
    if (error) throw error
    id = data.user.id
  }
  const { error } = await admin.from("profiles").upsert({ id, name: p.name, initials: p.initials })
  if (error) throw error
  return id
}

function inDays(n: number) {
  return new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)
}

/** Rebuilds the demo world from scratch. Safe to call repeatedly. */
export async function resetDemoWorld(): Promise<void> {
  const admin = createAdminClient()
  const guestId = await ensureUser(admin, PEOPLE[0])
  const friendId = await ensureUser(admin, PEOPLE[1])
  const ids = [guestId, friendId]

  // Wipe demo-owned content. meal_recipes and guests cascade with their parents.
  const { data: ownRecipes } = await admin.from("recipes").select("id").in("created_by", ids)
  if (ownRecipes?.length) {
    await admin.storage.from("recipe-photos").remove(ownRecipes.map((r) => r.id))
  }
  await admin.from("guests").delete().eq("user_id", guestId)
  await admin.from("events").delete().in("host_id", ids)
  await admin.from("meals").delete().in("created_by", ids)
  await admin.from("recipes").delete().in("created_by", ids)

  // Hang the demo on recipes that already exist on the site.
  const { data: recipes } = await admin
    .from("recipes").select("id, created_by").order("created_at").limit(20)
  const recipeIds = (recipes ?? []).filter((r) => !ids.includes(r.created_by ?? "")).map((r) => r.id)

  const { data: meal, error: mErr } = await admin
    .from("meals")
    .insert({ name: "Friday Dinner Party", slug: `friday-dinner-party-${guestId.slice(0, 6)}`, total_servings: 8, created_by: guestId })
    .select("id").single()
  if (mErr) throw mErr

  if (recipeIds.length) {
    await admin.from("meal_recipes").insert(
      recipeIds.slice(0, 3).map((recipe_id, position) => ({ meal_id: meal.id, recipe_id, position }))
    )
  }

  // An event the guest hosts, with a mix of RSVPs and allergies.
  const { data: hosted, error: eErr } = await admin
    .from("events")
    .insert({
      name: "Friday Dinner Party",
      slug: `guest-friday-dinner-${guestId.slice(0, 6)}`,
      event_date: inDays(4),
      status: "upcoming",
      meal_id: meal.id,
      host_id: guestId,
    })
    .select("id").single()
  if (eErr) throw eErr

  await admin.from("guests").insert([
    { event_id: hosted.id, name: "Maya Chen", user_id: friendId, rsvp: "accepted", allergies: ["nuts"] },
    { event_id: hosted.id, name: "Diego Ramírez", rsvp: "accepted", allergies: [] },
    { event_id: hosted.id, name: "Priya Nair", rsvp: "pending", allergies: ["dairy"] },
  ])

  // An invite from a friend, so the guest can try RSVPing.
  const { data: invited, error: iErr } = await admin
    .from("events")
    .insert({
      name: "Sunday Potluck at Maya's",
      slug: `maya-sunday-potluck-${guestId.slice(0, 6)}`,
      event_date: inDays(6),
      status: "pending-rsvp",
      host_id: friendId,
    })
    .select("id").single()
  if (iErr) throw iErr

  await admin.from("guests").insert({ event_id: invited.id, name: "Guest Cook", user_id: guestId, rsvp: "pending", allergies: [] })
}

/** Ensures the guest exists without wiping visitor activity. */
export async function ensureGuest(): Promise<void> {
  const admin = createAdminClient()
  const guestId = await findUserId(admin, GUEST_EMAIL)
  if (!guestId) return resetDemoWorld()
  const { count } = await admin.from("events").select("id", { count: "exact", head: true }).eq("host_id", guestId)
  if (!count) await resetDemoWorld()
}

/** Returns a one-time token the server exchanges for a guest session. */
export async function createGuestToken(): Promise<string> {
  await ensureGuest()
  const { data, error } = await createAdminClient().auth.admin.generateLink({ type: "magiclink", email: GUEST_EMAIL })
  if (error) throw error
  return data.properties.hashed_token
}

export function isGuestEmail(email: string | null | undefined) {
  return email === GUEST_EMAIL
}
