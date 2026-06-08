import Link from "next/link"
import type { Event } from "@/lib/events/queries"

interface EventCardProps {
  event: Event
  isHost: boolean
}

const statusLabels: Record<Event["status"], string> = {
  upcoming: "Upcoming",
  "pending-rsvp": "Pending RSVPs",
}

const statusStyles: Record<Event["status"], string> = {
  upcoming: "bg-sage/20 text-sage",
  "pending-rsvp": "bg-terracotta/15 text-terracotta",
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export default function EventCard({ event, isHost }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-stone bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 className="font-display text-xl text-espresso">{event.name}</h3>
        <p className="mt-1 font-sans text-sm text-muted">
          {formatDate(event.eventDate)} &middot; Hosted by {event.hostName}
          {isHost ? <span className="ml-2 text-terracotta">(you)</span> : null}
        </p>
      </div>
      <span
        className={`self-start rounded-full px-3 py-1 font-sans text-xs font-medium sm:self-auto ${statusStyles[event.status]}`}
      >
        {statusLabels[event.status]}
      </span>
    </Link>
  )
}
