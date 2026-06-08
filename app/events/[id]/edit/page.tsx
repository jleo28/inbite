import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import EventForm from "@/components/events/EventForm"
import { createClient } from "@/lib/supabase/server"
import { getEventBySlug } from "@/lib/events/queries"
import { listMealsOwnedBy } from "@/lib/meals/queries"
import { updateEvent } from "@/lib/events/actions"

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const event = await getEventBySlug(id)

  if (!event) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || event.hostId !== user.id) notFound()

  const userMeals = await listMealsOwnedBy(user.id)

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Edit event
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">{event.name}</h1>
        <div className="mt-10">
          <EventForm
            mode="edit"
            action={updateEvent}
            defaults={{
              dbId: event.dbId,
              slug: event.id,
              name: event.name,
              eventDate: event.eventDate,
              status: event.status,
              mealDbId: event.mealDbId,
            }}
            userMeals={userMeals}
          />
        </div>
      </FadeIn>
    </main>
  )
}
