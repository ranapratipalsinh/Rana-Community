import Link from 'next/link'

import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import type { GalleryItem, Village } from '@/payload-types'

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

      <GalleryGrid items={items} />
    </section>
  )
}
