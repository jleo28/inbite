"use client"

import { useActionState } from "react"
import type { MealOption } from "@/lib/meals/queries"

interface EventFormDefaults {
  dbId: string
  slug: string
  name: string
  eventDate: string
  status: string
  mealDbId: string | null
}

interface EventFormProps {
  mode: "create" | "edit"
  action: (prevState: unknown, formData: FormData) => Promise<unknown>
  defaults?: EventFormDefaults
  userMeals: MealOption[]
}

const inputClass =
  "rounded-lg border border-stone bg-cream px-4 py-2.5 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none"

export default function EventForm({ mode, action, defaults, userMeals }: EventFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {defaults ? <input type="hidden" name="dbId" value={defaults.dbId} /> : null}

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-espresso" htmlFor="event-name">
          Event name
        </label>
        <input
          id="event-name"
          type="text"
          name="name"
          required
          defaultValue={defaults?.name}
          placeholder="Sunday Dinner"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-espresso" htmlFor="event-date">
          Date
        </label>
        <input
          id="event-date"
          type="date"
          name="eventDate"
          required
          defaultValue={defaults?.eventDate}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-espresso" htmlFor="event-status">
          Status
        </label>
        <select
          id="event-status"
          name="status"
          defaultValue={defaults?.status ?? "pending-rsvp"}
          className={inputClass}
        >
          <option value="pending-rsvp">Pending RSVPs</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {userMeals.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-espresso" htmlFor="event-meal">
            Meal (optional)
          </label>
          <select
            id="event-meal"
            name="mealId"
            defaultValue={defaults?.mealDbId ?? ""}
            className={inputClass}
          >
            <option value="">None</option>
            {userMeals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {state && typeof state === "object" && "error" in state ? (
        <p className="font-sans text-sm text-terracotta">{(state as { error: string }).error}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create event" : "Save changes"}
        </button>
        <a
          href={mode === "edit" && defaults ? `/events/${defaults.slug}` : "/events"}
          className="rounded-full border border-stone px-6 py-3 font-sans text-sm text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
