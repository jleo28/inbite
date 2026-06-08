"use client"

import { useActionState, useEffect, useRef } from "react"
import { addGuest } from "@/lib/events/actions"
import { useToast } from "@/components/Toast"

interface AddGuestFormProps {
  eventId: string
  eventSlug: string
}

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-2.5 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function AddGuestForm({ eventId, eventSlug }: AddGuestFormProps) {
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(addGuest, undefined)

  useEffect(() => {
    if (state && "message" in state) {
      showToast(state.message as string)
      formRef.current?.reset()
    }
  }, [state, showToast])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="guestName"
          required
          placeholder="Guest name"
          className={`${inputClass} flex-1`}
        />
        <input
          type="email"
          name="guestEmail"
          placeholder="Email (optional, links account)"
          className={`${inputClass} flex-1`}
        />
      </div>
      {state && "error" in state ? (
        <p className="font-sans text-sm text-terracotta">{state.error as string}</p>
      ) : null}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-stone px-5 py-2.5 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add guest"}
        </button>
      </div>
    </form>
  )
}
