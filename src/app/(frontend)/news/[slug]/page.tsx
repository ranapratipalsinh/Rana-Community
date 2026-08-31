import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { richTextToPlainText } from '@/lib/richTextToPlainText'
import type { Media, News as NewsItem, Village } from '@/payload-types'

type Params = { slug: string }

const TYPE_LABEL: Record<string, string> = {
  community: 'Community Announcement',
  village: 'Village Announcement',
  notice: 'Important Notice',
}

async function getNewsItem(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })
  return (docs[0] as NewsItem | undefined) ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = await getNewsItem(slug)
  if (!item) return {}
  const image = item.image as Media | null
  const description = richTextToPlainText(item.description) || item.title

  return {
    title: `${item.title} — Rana Community Hub`,
    description,
    openGraph: {
      title: item.title,
      description,
      images: image?.url ? [{ url: image.url, alt: image.alt || item.title }] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = await getNewsItem(slug)
  if (!item) notFound()

  const image = item.image as Media | null
  const attachment = item.attachment as Media | null
  const village = item.village as Village | null

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      {image?.url ? (
        <div className="relative aspect-video w-full overflow-hidden border border-gold/30">
          <Image src={image.url} alt={image.alt || item.title} fill className="object-cover" />
        </div>
      ) : null}

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-gold">
        {TYPE_LABEL[item.type] ?? item.type} ·{' '}
        {new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        {village ? (
          <>
            {' · '}
            <Link href={`/villages/${village.slug}`} className="underline hover:text-gold-light">
              {village.name}
            </Link>
          </>
        ) : null}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gold">{item.title}</h1>

      <div className="mt-6">
        <RichText data={item.description} />
      </div>

      {attachment?.url ? (
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block border border-gold px-4 py-2 text-sm font-medium uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          Download attachment
        </a>
      ) : null}
    </article>
  )
}
