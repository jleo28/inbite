import Link from "next/link"
import EventCard from "@/components/EventCard"
import FadeIn from "@/components/FadeIn"
import { createClient } from "@/lib/supabase/server"
import { listEvents } from "@/lib/events/queries"

export default async function EventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const events = await listEvents()
  const userId = user?.id ?? ""

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <FadeIn>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
              Gather your people
            </p>
            <h1 className="mt-3 font-display text-4xl text-espresso">Events</h1>
            <p className="mt-3 max-w-xl font-sans text-base text-muted">
              Plan get-togethers around your meals, send invitations, and keep track of who is
              coming.
            </p>
          </div>
          <Link
            href="/events/new"
            className="shrink-0 rounded-full bg-terracotta px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-terracotta/90"
          >
            New event
          </Link>
        </div>
      </FadeIn>

      <div className="mt-10 flex flex-col gap-6">
        {events.length === 0 ? (
          <FadeIn>
            <p className="rounded-2xl border border-stone bg-cream px-8 py-10 font-sans text-sm text-muted">
              You have no events yet.{" "}
              <Link href="/events/new" className="text-terracotta hover:underline">
                Create your first event.
              </Link>
            </p>
          </FadeIn>
        ) : (
          events.map((event, index) => (
            <FadeIn key={event.id} delay={index * 100}>
              <EventCard event={event} isHost={event.hostId === userId} />
            </FadeIn>
          ))
        )}
      </div>
    </main>
  )
}
