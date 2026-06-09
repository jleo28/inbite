"use client"

import { useActionState, useState } from "react"
import { RECIPE_GRADIENTS } from "@/lib/recipes/constants"
import type { RecipeFormState } from "@/lib/recipes/actions"

interface RecipeFormValues {
  name: string
  description: string
  servings: number
  tags: string[]
  ingredients: { amount: string; item: string }[]
  steps: string[]
  imageGradient: string
}

interface RecipeFormProps {
  action: (prevState: RecipeFormState, formData: FormData) => Promise<RecipeFormState>
  hiddenFields?: { name: string; value: string }[]
  submitLabel: string
  pendingLabel: string
  initialValues?: RecipeFormValues
}

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

const labelClass = "flex flex-col gap-2 font-sans text-sm text-espresso"

export default function RecipeForm({
  action,
  hiddenFields = [],
  submitLabel,
  pendingLabel,
  initialValues,
}: RecipeFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [ingredients, setIngredients] = useState(
    initialValues?.ingredients.length ? initialValues.ingredients : [{ amount: "", item: "" }]
  )
  const [steps, setSteps] = useState(initialValues?.steps.length ? initialValues.steps : [""])

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      {hiddenFields.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}

      <label className={labelClass}>
        Name
        <input
          type="text"
          name="name"
          required
          defaultValue={initialValues?.name}
          placeholder="Roasted Tomato Pasta"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Description
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={initialValues?.description}
          placeholder="A short, mouth-watering summary of the dish."
          className={`${inputClass} resize-none`}
        />
      </label>

      <div className="flex flex-col gap-5 sm:flex-row">
        <label className={`${labelClass} sm:w-40`}>
          Servings
          <input
            type="number"
            name="servings"
            min={1}
            required
            defaultValue={initialValues?.servings ?? 4}
            className={inputClass}
          />
        </label>

        <label className={`${labelClass} flex-1`}>
          Tags
          <input
            type="text"
            name="tags"
            required
            defaultValue={initialValues?.tags.join(", ")}
            placeholder="Vegetarian, Dinner, 30 min"
            className={inputClass}
          />
          <span className="font-sans text-xs text-muted">Separate tags with commas.</span>
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-sans text-sm text-espresso">Cover style</legend>
        <div className="flex flex-wrap gap-3">
          {RECIPE_GRADIENTS.map((gradient, index) => (
            <label key={gradient} className="cursor-pointer">
              <input
                type="radio"
                name="imageGradient"
                value={gradient}
                required
                defaultChecked={
                  initialValues ? initialValues.imageGradient === gradient : index === 0
                }
                className="peer sr-only"
              />
              <span
                className="block h-12 w-12 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-cream transition-all peer-checked:ring-terracotta"
                style={{ backgroundImage: gradient }}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-sans text-sm text-espresso">Ingredients</legend>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              name="ingredientAmount"
              defaultValue={ingredient.amount}
              placeholder="1 cup"
              className={`${inputClass} w-28`}
            />
            <input
              type="text"
              name="ingredientItem"
              defaultValue={ingredient.item}
              placeholder="grated parmesan"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => setIngredients((rows) => rows.filter((_, i) => i !== index))}
              disabled={ingredients.length === 1}
              className="rounded-full border border-stone px-3 font-sans text-sm text-muted transition-colors hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIngredients((rows) => [...rows, { amount: "", item: "" }])}
          className="self-start rounded-full border border-stone px-4 py-2 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Add ingredient
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-sans text-sm text-espresso">Steps</legend>
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <span className="flex h-11 w-7 shrink-0 items-center justify-center font-sans text-sm font-medium text-terracotta">
              {index + 1}
            </span>
            <textarea
              name="step"
              defaultValue={step}
              rows={2}
              placeholder="Describe this step."
              className={`${inputClass} flex-1 resize-none`}
            />
            <button
              type="button"
              onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
              disabled={steps.length === 1}
              className="self-start rounded-full border border-stone px-3 py-2 font-sans text-sm text-muted transition-colors hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSteps((rows) => [...rows, ""])}
          className="self-start rounded-full border border-stone px-4 py-2 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Add step
        </button>
      </fieldset>

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
