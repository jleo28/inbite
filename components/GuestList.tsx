import type { EventGuest } from "@/lib/events/queries"
import GuestActions from "./GuestActions"

interface GuestListProps {
  guests: EventGuest[]
  eventSlug: string
  isHost: boolean
}

const rsvpLabels: Record<EventGuest["rsvp"], string> = {
  accepted: "Accepted",
  declined: "Declined",
  pending: "Pending",
}

const rsvpStyles: Record<EventGuest["rsvp"], string> = {
  accepted: "bg-sage/20 text-sage",
  declined: "bg-stone/60 text-muted",
  pending: "bg-terracotta/15 text-terracotta",
}

export default function GuestList({ guests, eventSlug, isHost }: GuestListProps) {
  if (guests.length === 0) {
    return (
      <p className="rounded-2xl border border-stone bg-cream px-6 py-5 font-sans text-sm text-muted">
        No guests invited yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-stone overflow-hidden rounded-2xl border border-stone bg-cream">
      {guests.map((guest) => (
        <li
          key={guest.id}
          className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-sm font-medium text-espresso">{guest.name}</p>
            {guest.allergies.map((allergy) => (
              <span
                key={allergy}
                className="rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 font-sans text-xs capitalize text-terracotta"
              >
                {allergy}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:ml-4">
            <span
              className={`self-start rounded-full px-3 py-1 font-sans text-xs font-medium sm:self-auto ${rsvpStyles[guest.rsvp]}`}
            >
              {rsvpLabels[guest.rsvp]}
            </span>
            {isHost ? (
              <GuestActions guestId={guest.id} eventSlug={eventSlug} />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
