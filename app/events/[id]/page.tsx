import { notFound } from "next/navigation"
import FadeIn from "@/components/FadeIn"
import GuestList from "@/components/GuestList"
import ShoppingListPreview from "@/components/ShoppingListPreview"
import { events } from "@/lib/data"
import RsvpButtons from "./RsvpButtons"

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

const statusLabels = {
  upcoming: "Upcoming",
  "pending-rsvp": "Pending RSVPs",
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = events.find((item) => item.id === id)

  if (!event) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          {statusLabels[event.status]}
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">{event.name}</h1>
        <p className="mt-3 font-sans text-base text-muted">
          {event.date} &middot; Hosted by {event.host}
        </p>
        <div className="mt-6">
          <RsvpButtons eventName={event.name} />
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <h2 className="mt-14 font-display text-2xl text-espresso">Guests</h2>
        <div className="mt-5">
          <GuestList guests={event.guests} />
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="mt-14">
          <ShoppingListPreview mealId={event.mealId} />
        </div>
      </FadeIn>
    </main>
  )
}
