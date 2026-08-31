import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'

import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'
import type { GalleryItem, Media, Village } from '@/payload-types'

export const metadata = {
  title: 'Gallery — Rana Community Hub',
  description: 'Photos and videos from villages, events, community life and heritage.',
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'events', label: 'Events' },
  { value: 'villages', label: 'Villages' },
  { value: 'community', label: 'Community' },
  { value: 'heritage', label: 'Heritage' },
]

function buildHref(category: string, village: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (village) params.set('village', village)
  const qs = params.toString()
  return `/gallery${qs ? `?${qs}` : ''}`
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; village?: string }>
}) {
  const { category = '', village: villageSlug = '' } = await searchParams
  const payload = await getPayloadClient()

  let villageId: number | undefined
  if (villageSlug) {
    const { docs } = await payload.find({
      collection: 'villages',
      where: { slug: { equals: villageSlug } },
      limit: 1,
      overrideAccess: false,
    })
    villageId = (docs[0] as Village | undefined)?.id
  }

  const { docs: villages } = await payload.find({
    collection: 'villages',
    sort: 'order',
    limit: 100,
    overrideAccess: false,
  })

  const whereClauses: Where[] = []
  if (category) whereClauses.push({ category: { equals: category } })
  if (villageId) whereClauses.push({ village: { equals: villageId } })

  const { docs } = await payload.find({
    collection: 'gallery-items',
    where: whereClauses.length > 0 ? { and: whereClauses } : undefined,
    sort: 'order',
    limit: 60,
    depth: 1,
    overrideAccess: false,
  })
  const items = docs as GalleryItem[]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Gallery
      </h1>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={buildHref(c.value, villageSlug)}
            className={cn(
              'border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
              category === c.value
                ? 'border-gold bg-gold text-ink'
                : 'border-gold/30 text-gold/70 hover:border-gold',
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Link
          href={buildHref(category, '')}
          className={cn(
            'border px-3 py-1 text-xs font-medium transition-colors',
            !villageSlug
              ? 'border-bronze bg-bronze text-ink'
              : 'border-gold/15 text-gold/70 hover:border-bronze',
          )}
        >
          All Villages
        </Link>
        {(villages as Village[]).map((v) => (
          <Link
            key={v.id}
            href={buildHref(category, v.slug)}
            className={cn(
              'border px-3 py-1 text-xs font-medium transition-colors',
              villageSlug === v.slug
                ? 'border-bronze bg-bronze text-ink'
                : 'border-gold/15 text-gold/70 hover:border-bronze',
            )}
          >
            {v.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => {
          const img = item.image as Media | null
          return (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden border border-gold/15"
            >
              {item.type === 'image' && img?.url ? (
                <Image
                  src={img.url}
                  alt={img.alt || item.caption || 'Gallery photo'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : item.type === 'video' && item.videoUrl ? (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center bg-ink"
                >
                  <Play className="text-gold" size={32} />
                </a>
              ) : null}
              {item.caption ? (
                <p className="absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-xs text-gold">
                  {item.caption}
                </p>
              ) : null}
            </div>
          )
        })}
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            No gallery items match this filter yet.
          </p>
        ) : null}
      </div>
    </section>
  )
}
