"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import { useToast } from "@/components/Toast"
import { addRecipeToMeal } from "@/lib/meals/actions"
import type { MealOption } from "@/lib/meals/queries"

interface AddToMealButtonProps {
  recipeId: string
  recipeSlug: string
  recipeName: string
  isSignedIn: boolean
  ownMeals: MealOption[]
}

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-2.5 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function AddToMealButton({
  recipeId,
  recipeSlug,
  recipeName,
  isSignedIn,
  ownMeals,
}: AddToMealButtonProps) {
  const { showToast } = useToast()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selection, setSelection] = useState<string>(ownMeals[0]?.id ?? "new")
  const [state, formAction, pending] = useActionState(addRecipeToMeal, undefined)
  const mode = selection === "new" ? "new" : "existing"

  useEffect(() => {
    if (state && "message" in state) {
      showToast(state.message)
      dialogRef.current?.close()
    }
  }, [state, showToast])

  if (!isSignedIn) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-stone bg-cream px-6 py-3 font-sans text-sm font-medium text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
      >
        Sign in to add to a meal
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
      >
        Add to Meal
      </button>

      <dialog
        ref={dialogRef}
        className="w-[24rem] max-w-[calc(100vw-3rem)] rounded-2xl border border-stone bg-cream p-6 shadow-xl shadow-espresso/10 backdrop:bg-espresso/30"
      >
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="recipeId" value={recipeId} />
          <input type="hidden" name="recipeSlug" value={recipeSlug} />
          <input type="hidden" name="recipeName" value={recipeName} />
          <input type="hidden" name="mode" value={mode} />
          {mode === "existing" ? <input type="hidden" name="mealId" value={selection} /> : null}

          <fieldset className="flex flex-col gap-2.5">
            <legend className="font-sans text-sm text-espresso">Add to a meal</legend>
            {ownMeals.map((meal) => (
              <label key={meal.id} className="flex items-center gap-2 font-sans text-sm text-espresso">
                <input
                  type="radio"
                  checked={selection === meal.id}
                  onChange={() => setSelection(meal.id)}
                  className="accent-terracotta"
                />
                {meal.name}
              </label>
            ))}
            <label className="flex items-center gap-2 font-sans text-sm text-espresso">
              <input
                type="radio"
                checked={selection === "new"}
                onChange={() => setSelection("new")}
                className="accent-terracotta"
              />
              Create a new meal
            </label>
          </fieldset>

          {mode === "new" ? (
            <div className="flex flex-col gap-3 border-l-2 border-stone pl-4">
              <input
                type="text"
                name="mealName"
                required
                placeholder="Meal name"
                className={inputClass}
              />
              <label className="flex items-center gap-2 font-sans text-sm text-espresso">
                Total servings
                <input
                  type="number"
                  name="mealServings"
                  min={1}
                  defaultValue={4}
                  required
                  className={`${inputClass} w-20`}
                />
              </label>
            </div>
          ) : null}

          {state && "error" in state ? (
            <p className="font-sans text-sm text-terracotta">{state.error}</p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-terracotta px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Adding…" : "Add to meal"}
            </button>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-stone px-5 py-2.5 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
