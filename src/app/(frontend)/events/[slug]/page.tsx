import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { richTextToPlainText } from '@/lib/richTextToPlainText'
import type { Event, Media, Village } from '@/payload-types'

type Params = { slug: string }

async function getEvent(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })
  return (docs[0] as Event | undefined) ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  const cover = event.coverImage as Media | null
  const description = richTextToPlainText(event.description) || event.title

  return {
    title: `${event.title} — Rana Community Hub`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: cover?.url ? [{ url: cover.url, alt: cover.alt || event.title }] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const cover = event.coverImage as Media | null
  const village = event.village as Village | null
  const reg = event.registration

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: event.location
      ? { '@type': 'Place', name: event.location }
      : undefined,
    image: cover?.url ? [cover.url] : undefined,
    description: richTextToPlainText(event.description),
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {cover?.url ? (
        <div className="relative aspect-video w-full overflow-hidden border border-gold/30">
          <Image
            src={cover.url}
            alt={cover.alt || event.title}
            fill
            sizes="(min-width: 768px) 736px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-gold">
        {new Date(event.date).toLocaleString('en-IN', {
          dateStyle: 'long',
          timeStyle: 'short',
        })}
        {event.location ? ` · ${event.location}` : ''}
        {village ? (
          <>
            {' · '}
            <Link href={`/villages/${village.slug}`} className="underline hover:text-gold-light">
              {village.name}
            </Link>
          </>
        ) : null}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gold">{event.title}</h1>

      <div className="mt-6">
        <RichText data={event.description} />
      </div>

      {event.gallery && event.gallery.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {event.gallery.map((item, i) => {
            const img = item.image as Media | null
            return img?.url ? (
              <div key={i} className="relative aspect-square overflow-hidden border border-gold/15">
                <Image
                  src={img.url}
                  alt={img.alt || event.title}
                  fill
                  sizes="(min-width: 640px) 240px, 50vw"
                  className="object-cover"
                />
              </div>
            ) : null
          })}
        </div>
      ) : null}

      {reg?.contactName || reg?.contactPhone || reg?.contactEmail || reg?.registrationUrl ? (
        <div className="mt-10 border border-gold/30 bg-ink-card p-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            Registration / Contact
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-gold/70">
            {reg.contactName ? <li>{reg.contactName}</li> : null}
            {reg.contactPhone ? <li>{reg.contactPhone}</li> : null}
            {reg.contactEmail ? <li>{reg.contactEmail}</li> : null}
            {reg.registrationUrl ? (
              <li>
                <a
                  href={reg.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline hover:text-gold-light"
                >
                  Register
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
