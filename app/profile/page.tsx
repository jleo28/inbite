import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import ProfileForm from "./ProfileForm"
import PasswordForm from "./PasswordForm"

export const metadata: Metadata = { title: "Profile — InBite" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, initials")
    .eq("id", user.id)
    .single()

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-espresso">Profile</h1>
      <p className="mt-2 font-sans text-sm text-muted">{user.email}</p>

      <div className="mt-10 flex flex-col gap-8">
        <section className="rounded-2xl border border-stone bg-cream p-8">
          <h2 className="font-display text-xl text-espresso">Display name</h2>
          <p className="mt-1 font-sans text-sm text-muted">
            Shown to hosts when you&apos;re invited to events.
          </p>
          <div className="mt-6">
            <ProfileForm defaultName={profile?.name ?? ""} />
          </div>
        </section>

        <section className="rounded-2xl border border-stone bg-cream p-8">
          <h2 className="font-display text-xl text-espresso">Change password</h2>
          <p className="mt-1 font-sans text-sm text-muted">Must be at least 6 characters.</p>
          <div className="mt-6">
            <PasswordForm />
          </div>
        </section>
      </div>
    </main>
  )
}
