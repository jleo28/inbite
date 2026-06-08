"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type AuthState = { error: string } | { message: string } | undefined

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0] ?? "")
  return (letters.join("") || name.slice(0, 2)).toUpperCase()
}

export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get("name")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (!name) return { error: "Enter your name." }
  if (!email) return { error: "Enter your email." }
  if (password.length < 6) return { error: "Password must be at least 6 characters." }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, initials: initialsFromName(name) } },
  })

  if (error) return { error: error.message }

  if (!data.session) {
    return { message: "Check your email to confirm your account, then sign in." }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (!email) return { error: "Enter your email." }
  if (!password) return { error: "Enter your password." }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: "Incorrect email or password." }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
