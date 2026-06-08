"use client"

import { useActionState, useEffect } from "react"
import { respondToInvite } from "@/lib/events/actions"
import { useToast } from "@/components/Toast"
import type { Event, EventGuest } from "@/lib/events/queries"

interface InvitationCardProps {
  invite: Event
  myGuest: EventGuest
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export default function InvitationCard({ invite, myGuest }: InvitationCardProps) {
  const { showToast } = useToast()
  const [state, formAction, pending] = useActionState(respondToInvite, undefined)

  useEffect(() => {
    if (state && "message" in state) showToast(state.message as string)
  }, [state, showToast])

  return (
    <div className="rounded-2xl border border-stone bg-cream p-8 sm:p-10">
      <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">Invitation</p>
      <h2 className="mt-3 font-display text-3xl text-espresso">
        You&rsquo;re invited to {invite.name}
      </h2>
      <p className="mt-2 font-sans text-sm text-muted">
        Hosted by {invite.hostName} on {formatDate(invite.eventDate)}
      </p>

      {myGuest.rsvp !== "pending" ? (
        <p className="mt-4 font-sans text-sm text-muted">
          You {myGuest.rsvp === "accepted" ? "accepted" : "declined"} this invitation.
        </p>
      ) : null}

      <form action={formAction} className="mt-6 flex flex-wrap gap-3">
        <input type="hidden" name="guestId" value={myGuest.id} />
        <input type="hidden" name="eventSlug" value={invite.id} />
        {myGuest.rsvp !== "accepted" ? (
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
        {myGuest.rsvp !== "declined" ? (
          <button
            name="rsvp"
            value="declined"
            type="submit"
            disabled={pending}
            className="rounded-full border border-stone bg-cream px-6 py-3 font-sans text-sm font-medium text-espresso transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-60"
          >
            {myGuest.rsvp === "accepted" ? "Can’t make it" : "Decline"}
          </button>
        ) : null}
      </form>
    </div>
  )
}
