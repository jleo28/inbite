import Link from "next/link"
import type { Event } from "@/lib/data"

interface EventCardProps {
  event: Event
}

const statusLabels: Record<Event["status"], string> = {
  upcoming: "Upcoming",
  "pending-rsvp": "Pending RSVPs",
}

const statusStyles: Record<Event["status"], string> = {
  upcoming: "bg-sage/20 text-sage",
  "pending-rsvp": "bg-terracotta/15 text-terracotta",
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-stone bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso/10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 className="font-display text-xl text-espresso">{event.name}</h3>
        <p className="mt-1 font-sans text-sm text-muted">
          {event.date} &middot; Hosted by {event.host}
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
