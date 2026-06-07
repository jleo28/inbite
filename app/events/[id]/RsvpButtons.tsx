"use client"

import { useToast } from "@/components/Toast"

export default function RsvpButtons({ eventName }: { eventName: string }) {
  const { showToast } = useToast()

  function handleAccept() {
    showToast(`You're in! See you at ${eventName}.`)
  }

  function handleDecline() {
    showToast("Got it, we will let the host know you can't make it.")
  }

  return (
    <div className="flex flex-wrap gap-3">
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
  )
}
