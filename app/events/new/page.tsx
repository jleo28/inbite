import FadeIn from "@/components/FadeIn"
import EventForm from "@/components/events/EventForm"
import { createClient } from "@/lib/supabase/server"
import { listMealsOwnedBy } from "@/lib/meals/queries"
import { createEvent } from "@/lib/events/actions"

export default async function NewEventPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userMeals = user ? await listMealsOwnedBy(user.id) : []

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          New event
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">Create an event</h1>
        <p className="mt-3 font-sans text-base text-muted">
          Set the date, link a meal, and start inviting people.
        </p>
        <div className="mt-10">
          <EventForm mode="create" action={createEvent} userMeals={userMeals} />
        </div>
      </FadeIn>
    </main>
  )
}
