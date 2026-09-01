import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { Card, CardImage, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Media, News as NewsItem } from '@/payload-types'

export const metadata = {
  title: 'News & Announcements — Rana Community Hub',
  description: 'Community announcements, village-specific news and important notices.',
}

const TYPE_LABEL: Record<string, string> = {
  community: 'Community',
  village: 'Village',
  notice: 'Notice',
}

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'community', label: 'Community' },
  { value: 'village', label: 'Village' },
  { value: 'notice', label: 'Notice' },
]

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'news',
    where: type ? { type: { equals: type } } : undefined,
    sort: '-date',
    limit: 50,
    depth: 1,
    overrideAccess: false,
  })
  const news = docs as NewsItem[]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        News &amp; Announcements
      </h1>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {TYPE_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/news?type=${f.value}` : '/news'}
            className={cn(
              'border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
              type === f.value
                ? 'border-gold bg-gold text-ink'
                : 'border-gold/30 text-gold/70 hover:border-gold',
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => {
          const image = item.image as Media | null
          return (
            <Link key={item.id} href={`/news/${item.slug}`}>
              <Card>
                <CardImage>
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </CardImage>
                <CardContent>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    {TYPE_LABEL[item.type] ?? item.type} ·{' '}
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <CardTitle>{item.title}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {news.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            No announcements published yet.
          </p>
        ) : null}
      </div>
    </section>
  )
}
