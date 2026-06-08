"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0] ?? "")
  return (letters.join("") || name.slice(0, 2)).toUpperCase()
}

export async function updateProfile(prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string).trim()
  if (!name) return { error: "Name is required." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const initials = initialsFromName(name)

  const { error } = await supabase
    .from("profiles")
    .update({ name, initials })
    .eq("id", user.id)

  if (error) return { error: error.message }

  await supabase.auth.updateUser({ data: { name, initials } })

  revalidatePath("/", "layout")
  return { message: "Profile updated." }
}

export async function changePassword(prevState: unknown, formData: FormData) {
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!newPassword || newPassword.length < 6)
    return { error: "Password must be at least 6 characters." }
  if (newPassword !== confirmPassword) return { error: "Passwords don't match." }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) return { error: error.message }
  return { message: "Password updated." }
}
