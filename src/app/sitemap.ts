import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const STATIC_ROUTES = [
  '',
  '/about',
  '/villages',
  '/family-tree',
  '/events',
  '/news',
  '/gallery',
  '/committee',
  '/documents',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [villages, events, news] = await Promise.all([
    payload.find({ collection: 'villages', limit: 100, overrideAccess: false }),
    payload.find({ collection: 'events', limit: 200, overrideAccess: false }),
    payload.find({ collection: 'news', limit: 200, overrideAccess: false }),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))

  const villageEntries: MetadataRoute.Sitemap = villages.docs.flatMap((v) => [
    { url: `${SITE_URL}/villages/${v.slug}`, lastModified: v.updatedAt },
    { url: `${SITE_URL}/villages/${v.slug}/family-tree`, lastModified: v.updatedAt },
  ])

  const eventEntries: MetadataRoute.Sitemap = events.docs.map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }))

  const newsEntries: MetadataRoute.Sitemap = news.docs.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: n.updatedAt,
  }))

  return [...staticEntries, ...villageEntries, ...eventEntries, ...newsEntries]
}
