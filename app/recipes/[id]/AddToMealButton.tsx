"use client"

import { useToast } from "@/components/Toast"

export default function AddToMealButton({ recipeName }: { recipeName: string }) {
  const { showToast } = useToast()

  return (
    <button
      type="button"
      onClick={() => showToast(`Added ${recipeName} to your meal plan.`)}
      className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
    >
      Add to Meal
    </button>
  )
}
