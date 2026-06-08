"use client"

import { useActionState } from "react"
import type { MealFormState } from "@/lib/meals/actions"

interface MealFormProps {
  action: (prevState: MealFormState, formData: FormData) => Promise<MealFormState>
  hiddenFields?: { name: string; value: string }[]
  submitLabel: string
  pendingLabel: string
  initialValues?: { name: string; totalServings: number }
}

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function MealForm({
  action,
  hiddenFields = [],
  submitLabel,
  pendingLabel,
  initialValues,
}: MealFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      {hiddenFields.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}

      <label className="flex flex-col gap-2 font-sans text-sm text-espresso">
        Name
        <input
          type="text"
          name="name"
          required
          defaultValue={initialValues?.name}
          placeholder="Sunday Dinner Spread"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2 font-sans text-sm text-espresso sm:w-48">
        Total servings
        <input
          type="number"
          name="totalServings"
          min={1}
          required
          defaultValue={initialValues?.totalServings ?? 4}
          className={inputClass}
        />
      </label>

      {state && "error" in state ? (
        <p className="font-sans text-sm text-terracotta">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}
