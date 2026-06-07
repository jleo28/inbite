import type { Guest } from "@/lib/data"

interface GuestListProps {
  guests: Guest[]
}

const rsvpLabels: Record<Guest["rsvp"], string> = {
  accepted: "Accepted",
  declined: "Declined",
  pending: "Pending",
}

const rsvpStyles: Record<Guest["rsvp"], string> = {
  accepted: "bg-sage/20 text-sage",
  declined: "bg-stone/60 text-muted",
  pending: "bg-terracotta/15 text-terracotta",
}

export default function GuestList({ guests }: GuestListProps) {
  return (
    <ul className="flex flex-col divide-y divide-stone overflow-hidden rounded-2xl border border-stone bg-cream">
      {guests.map((guest) => (
        <li
          key={guest.name}
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
          <span
            className={`self-start rounded-full px-3 py-1 font-sans text-xs font-medium sm:self-auto ${rsvpStyles[guest.rsvp]}`}
          >
            {rsvpLabels[guest.rsvp]}
          </span>
        </li>
      ))}
    </ul>
  )
}
