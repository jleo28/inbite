"use client"

import { useActionState, useEffect } from "react"
import { respondToInvite } from "@/lib/events/actions"
import { useToast } from "@/components/Toast"

interface RsvpButtonsProps {
  guestId: string
  currentRsvp: "accepted" | "declined" | "pending"
  eventSlug: string
}

export default function RsvpButtons({ guestId, currentRsvp, eventSlug }: RsvpButtonsProps) {
  const { showToast } = useToast()
  const [state, formAction, pending] = useActionState(respondToInvite, undefined)

  useEffect(() => {
    if (state && "message" in state) showToast(state.message as string)
  }, [state, showToast])

  return (
    <div className="flex flex-col gap-3">
      {currentRsvp !== "pending" ? (
        <p className="font-sans text-sm text-muted">
          You {currentRsvp === "accepted" ? "accepted" : "declined"} this invitation.
        </p>
      ) : null}
      <form action={formAction} className="flex flex-wrap gap-3">
        <input type="hidden" name="guestId" value={guestId} />
        <input type="hidden" name="eventSlug" value={eventSlug} />
        {currentRsvp !== "accepted" ? (
          <button
            name="rsvp"
            value="accepted"
            type="submit"
            disabled={pending}
            className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:opacity-60"
          >
            Accept
          </button>
        ) : null}
        {currentRsvp !== "declined" ? (
          <button
            name="rsvp"
            value="declined"
            type="submit"
            disabled={pending}
            className="rounded-full border border-stone bg-cream px-6 py-3 font-sans text-sm font-medium text-espresso transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-60"
          >
            {currentRsvp === "accepted" ? "Can&rsquo;t make it" : "Decline"}
          </button>
        ) : null}
      </form>
      {state && "error" in state ? (
        <p className="font-sans text-sm text-terracotta">{state.error as string}</p>
      ) : null}
    </div>
  )
}
