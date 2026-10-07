import Link from 'next/link'
import Image from 'next/image'

import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Event, Media } from '@/payload-types'

export function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function EventCard({ event }: { event: Event }) {
  const cover = event.coverImage as Media | null
  return (
    <Link href={`/events/${event.slug}`}>
      <Card>
        <CardImage className="aspect-video">
          {cover?.url ? (
            <Image
              src={cover.url}
              alt={cover.alt || event.title || 'Event'}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </CardImage>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {formatEventDate(event.date)}
          </p>
          <CardTitle>{event.title}</CardTitle>
          {event.location ? <CardDescription>{event.location}</CardDescription> : null}
        </CardContent>
      </Card>
    </Link>
  )
}
