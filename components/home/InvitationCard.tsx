"use client"

import { useToast } from "@/components/Toast"
import type { Event } from "@/lib/data"

export default function InvitationCard({ invite }: { invite: Event }) {
  const { showToast } = useToast()

  function handleAccept() {
    showToast(`You're in! See you at ${invite.name} on ${invite.date}.`)
  }

  function handleDecline() {
    showToast(`Got it, we will let the host know you can't make it.`)
  }

  return (
    <div className="rounded-2xl border border-stone bg-cream p-8 sm:p-10">
      <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">Invitation</p>
      <h2 className="mt-3 font-display text-3xl text-espresso">
        You&rsquo;re invited to {invite.name}
      </h2>
      <p className="mt-2 font-sans text-sm text-muted">
        Hosted by {invite.host} on {invite.date}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-full border border-stone bg-cream px-6 py-3 font-sans text-sm font-medium text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
