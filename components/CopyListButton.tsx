"use client"

import { useState } from "react"

export default function CopyListButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full border border-stone px-4 py-1.5 font-sans text-xs text-muted transition-colors hover:border-terracotta hover:text-terracotta"
    >
      {copied ? "Copied!" : "Copy list"}
    </button>
  )
}
