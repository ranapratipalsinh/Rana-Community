import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Event, Media } from '@/payload-types'

export const metadata = {
  title: 'Events — Rana Community Hub',
  description: 'Upcoming and past events for the Rana community and its villages.',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EventCard({ event }: { event: Event }) {
  const cover = event.coverImage as Media | null
  return (
    <Link href={`/events/${event.slug}`}>
      <Card>
        <CardImage>
          {cover?.url ? (
            <Image src={cover.url} alt={cover.alt || event.title} fill className="object-cover" />
          ) : null}
        </CardImage>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {formatDate(event.date)}
          </p>
          <CardTitle>{event.title}</CardTitle>
          {event.location ? <CardDescription>{event.location}</CardDescription> : null}
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function EventsPage() {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()

  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { date: { greater_than_equal: now } },
      sort: 'date',
      limit: 50,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: { date: { less_than: now } },
      sort: '-date',
      limit: 50,
      depth: 1,
      overrideAccess: false,
    }),
  ])

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Events
      </h1>

      <div className="mt-10">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">
          Upcoming Events
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.docs.map((event) => (
            <EventCard key={event.id} event={event as Event} />
          ))}
          {upcoming.docs.length === 0 ? (
            <p className="col-span-full text-gold/70">No upcoming events yet.</p>
          ) : null}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">Past Events</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {past.docs.map((event) => (
            <EventCard key={event.id} event={event as Event} />
          ))}
          {past.docs.length === 0 ? (
            <p className="col-span-full text-gold/70">No past events yet.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
