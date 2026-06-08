"use client"

import { useActionState, useEffect, useRef } from "react"
import { useToast } from "@/components/Toast"
import { changePassword } from "@/lib/profile/actions"

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-2.5 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function PasswordForm() {
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(changePassword, undefined)

  useEffect(() => {
    if (state && typeof state === "object" && "message" in state) {
      showToast(state.message as string)
      formRef.current?.reset()
    }
  }, [state, showToast])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          className="font-sans text-sm font-medium text-espresso"
          htmlFor="new-password"
        >
          New password
        </label>
        <input
          id="new-password"
          type="password"
          name="newPassword"
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-sans text-sm font-medium text-espresso"
          htmlFor="confirm-password"
        >
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          name="confirmPassword"
          required
          placeholder="••••••••"
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
          {pending ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  )
}
