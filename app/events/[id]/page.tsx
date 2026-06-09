import Link from "next/link"
import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import GuestList from "@/components/GuestList"
import ShoppingListPreview from "@/components/ShoppingListPreview"
import AddGuestForm from "@/components/events/AddGuestForm"
import { createClient } from "@/lib/supabase/server"
import { getEventBySlug } from "@/lib/events/queries"
import { deleteEvent } from "@/lib/events/actions"
import RsvpButtons from "./RsvpButtons"

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

const statusLabels = {
  upcoming: "Upcoming",
  "pending-rsvp": "Pending RSVPs",
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = await getEventBySlug(id)

  if (!event) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userId = user?.id ?? ""
  const isHost = event.hostId === userId
  const myGuest = event.guests.find((g) => g.userId === userId) ?? null

  const allergyTotals = new Map<string, number>()
  for (const guest of event.guests) {
    for (const allergy of guest.allergies) {
      allergyTotals.set(allergy, (allergyTotals.get(allergy) ?? 0) + 1)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
              {statusLabels[event.status]}
            </p>
            <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">{event.name}</h1>
            <p className="mt-3 font-sans text-base text-muted">
              {formatDate(event.eventDate)} &middot; Hosted by {event.hostName}
            </p>
          </div>
          {isHost ? (
            <div className="flex items-center gap-4">
              <Link
                href={`/events/${event.id}/edit`}
                className="font-sans text-sm text-terracotta hover:underline"
              >
                Edit
              </Link>
              <form action={deleteEvent}>
                <input type="hidden" name="dbId" value={event.dbId} />
                <button
                  type="submit"
                  className="font-sans text-sm text-muted transition-colors hover:text-terracotta"
                >
                  Delete
                </button>
              </form>
            </div>
          ) : null}
        </div>

        {myGuest && !isHost ? (
          <div className="mt-6">
            <RsvpButtons
              guestId={myGuest.id}
              currentRsvp={myGuest.rsvp}
              eventSlug={event.id}
            />
          </div>
        ) : null}
      </FadeIn>

      <FadeIn delay={100}>
        <h2 className="mt-14 font-display text-2xl text-espresso">Guests</h2>
        <div className="mt-5">
          <GuestList guests={event.guests} eventSlug={event.id} isHost={isHost} />
        </div>

        {isHost ? (
          <div className="mt-6">
            <h3 className="mb-3 font-sans text-sm font-medium text-espresso">Invite someone</h3>
            <AddGuestForm eventId={event.dbId} eventSlug={event.id} />
          </div>
        ) : null}

        {allergyTotals.size > 0 ? (
          <div className="mt-8 rounded-2xl border border-stone bg-cream p-5">
            <h3 className="font-sans text-sm font-medium text-espresso">Dietary needs</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(allergyTotals.entries()).map(([allergy, count]) => (
                <span
                  key={allergy}
                  className="rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 font-sans text-xs capitalize text-terracotta"
                >
                  {allergy} &middot; {count}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </FadeIn>

      {event.mealId && event.mealRecipes.length > 0 ? (
        <FadeIn delay={200}>
          <div className="mt-14">
            <ShoppingListPreview
              mealName={event.mealName!}
              mealRecipes={event.mealRecipes}
            />
          </div>
        </FadeIn>
      ) : null}
    </main>
  )
}
