"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { removeGuest } from "@/lib/events/actions"
import { useToast } from "@/components/Toast"

interface GuestActionsProps {
  guestId: string
  eventSlug: string
}

export default function GuestActions({ guestId, eventSlug }: GuestActionsProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [state, formAction, pending] = useActionState(removeGuest, undefined)

  useEffect(() => {
    if (state && typeof state === "object" && "message" in state) {
      showToast(state.message as string)
      router.refresh()
    }
  }, [state, showToast, router])

  return (
    <form action={formAction}>
      <input type="hidden" name="guestId" value={guestId} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-stone px-3 py-1 font-sans text-xs text-muted transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-60"
      >
        Remove
      </button>
    </form>
  )
}
