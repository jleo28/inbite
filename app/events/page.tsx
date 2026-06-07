import EventCard from "@/components/EventCard"
import FadeIn from "@/components/FadeIn"
import { events } from "@/lib/data"

export default function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          Gather your people
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">Events</h1>
        <p className="mt-3 max-w-xl font-sans text-base text-muted">
          Plan get-togethers around your meals, send invitations, and keep track of
          who is coming.
        </p>
      </FadeIn>

      <div className="mt-10 flex flex-col gap-6">
        {events.map((event, index) => (
          <FadeIn key={event.id} delay={index * 100}>
            <EventCard event={event} />
          </FadeIn>
        ))}
      </div>
    </main>
  )
}
