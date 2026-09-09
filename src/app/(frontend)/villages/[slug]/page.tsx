import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Event, GalleryItem, Media, News as NewsItem, Village } from '@/payload-types'

type Params = { slug: string }

async function getVillage(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'villages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return (docs[0] as Village | undefined) ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) return {}

  const cover = village.coverImage as Media | null
  const description = village.meta?.description || village.shortDescription

  return {
    title: village.meta?.title || `${village.name} — Rana Community Hub`,
    description,
    openGraph: {
      title: village.name,
      description,
      images: cover?.url ? [{ url: cover.url, alt: cover.alt || village.name }] : undefined,
    },
  }
}

export default async function VillageDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) notFound()

  const cover = village.coverImage as Media | null

  const payload = await getPayloadClient()
  const now = new Date().toISOString()

  const [villageEvents, villageNews, villageGallery] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { and: [{ village: { equals: village.id } }, { date: { greater_than_equal: now } }] },
      sort: 'date',
      limit: 3,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'news',
      where: { village: { equals: village.id } },
      sort: '-date',
      limit: 3,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'gallery-items',
      where: { and: [{ village: { equals: village.id } }, { type: { equals: 'image' } }] },
      sort: 'order',
      limit: 8,
      depth: 1,
      overrideAccess: false,
    }),
  ])

  const events = villageEvents.docs as Event[]
  const news = villageNews.docs as NewsItem[]
  const gallery = villageGallery.docs as GalleryItem[]

  return (
    <article>
      <div className="relative h-72 w-full bg-ink-soft md:h-96">
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={cover.alt || village.name || 'Village'}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/95 via-ink/40 to-transparent">
          <h1 className="px-4 pb-6 text-3xl font-bold uppercase tracking-[0.1em] text-gold md:text-4xl">
            {village.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <RichText data={village.description} />

          {village.history ? (
            <div className="mt-10">
              <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">History</h2>
              <RichText data={village.history} className="mt-2" />
            </div>
          ) : null}

          {village.importantPlaces && village.importantPlaces.length > 0 ? (
            <div className="mt-10">
              <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">
                Important Places
              </h2>
              <ul className="mt-3 space-y-3">
                {village.importantPlaces.map((place, i) => (
                  <li key={i}>
                    <p className="font-semibold text-gold">{place.name}</p>
                    {place.description ? (
                      <p className="text-sm text-gold/70">{place.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {village.populationInfo ? (
            <div className="mt-10">
              <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">
                Population &amp; Basic Information
              </h2>
              <p className="mt-2 text-gold/90">{village.populationInfo}</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          {village.location?.address ? (
            <div className="border border-gold/20 bg-ink-card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Location
              </h3>
              <p className="mt-2 text-sm text-gold/70">{village.location.address}</p>
            </div>
          ) : null}

          {village.contactInfo?.phone || village.contactInfo?.email ? (
            <div className="border border-gold/20 bg-ink-card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Village Contact
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-gold/70">
                {village.contactInfo?.phone ? <li>{village.contactInfo.phone}</li> : null}
                {village.contactInfo?.email ? <li>{village.contactInfo.email}</li> : null}
                {village.contactInfo?.address ? <li>{village.contactInfo.address}</li> : null}
              </ul>
            </div>
          ) : null}
          <div className="border border-gold/40 bg-ink-soft p-4 text-center">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Family Tree
            </h3>
            <p className="mt-2 text-sm text-gold/70">
              Explore {village.name}&apos;s genealogy across generations.
            </p>
            <Link
              href={`/villages/${village.slug}/family-tree`}
              className={cn('mt-4', buttonVariants({ variant: 'primary', size: 'sm' }))}
            >
              View Family Tree
            </Link>
          </div>
        </aside>
      </div>

      {events.length > 0 || news.length > 0 || gallery.length > 0 ? (
        <div className="border-t border-gold/10 bg-ink-soft px-4 py-12">
          <div className="mx-auto max-w-6xl space-y-10">
            {events.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-gold">
                  {village.name} Events
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {events.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="block border border-gold/15 bg-ink-card p-3 transition-colors hover:border-gold/40"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="mt-1 font-medium text-gold">{event.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {news.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-gold">
                  {village.name} Announcements
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {news.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/news/${item.slug}`}
                        className="block border border-gold/15 bg-ink-card p-3 transition-colors hover:border-gold/40"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="mt-1 font-medium text-gold">{item.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {gallery.length > 0 ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold uppercase tracking-wide text-gold">
                    {village.name} Gallery
                  </h2>
                  <Link
                    href={`/gallery?village=${village.slug}`}
                    className="text-sm text-gold transition-colors hover:text-gold-light"
                  >
                    View all →
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">
                  {gallery.map((item) => {
                    const img = item.image as Media | null
                    return img?.url ? (
                      <div
                        key={item.id}
                        className="relative aspect-square overflow-hidden border border-gold/15"
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || item.caption || village.name || 'Village photo'}
                          fill
                          sizes="(min-width: 768px) 12vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}
