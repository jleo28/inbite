"use client"

import { useActionState, useEffect } from "react"
import { useToast } from "@/components/Toast"
import { updateProfile } from "@/lib/profile/actions"

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-2.5 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function ProfileForm({ defaultName }: { defaultName: string }) {
  const { showToast } = useToast()
  const [state, formAction, pending] = useActionState(updateProfile, undefined)

  useEffect(() => {
    if (state && typeof state === "object" && "message" in state)
      showToast(state.message as string)
  }, [state, showToast])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-espresso" htmlFor="profile-name">
          Name
        </label>
        <input
          id="profile-name"
          type="text"
          name="name"
          required
          defaultValue={defaultName}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      {state && typeof state === "object" && "error" in state ? (
        <p className="font-sans text-sm text-terracotta">{state.error as string}</p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-terracotta px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save name"}
        </button>
      </div>
    </form>
  )
}
