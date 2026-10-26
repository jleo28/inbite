"use client"

import { useFormStatus } from "react-dom"
import { signInAsGuest } from "@/lib/auth/actions"

function Inner({ className, label }: { className: string; label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {pending ? "Setting up the demo…" : label}
    </button>
  )
}

export default function GuestButton({
  className = "",
  label = "Try as guest",
}: {
  className?: string
  label?: string
}) {
  return (
    <form action={signInAsGuest}>
      <Inner className={className} label={label} />
    </form>
  )
}
