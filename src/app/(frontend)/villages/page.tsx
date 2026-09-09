import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Media, Village } from '@/payload-types'
import { getTranslations } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export const metadata = {
  title: 'Our Villages — Sayla State — Rana Community Hub',
  description: 'Explore the 9 villages of Sayla State — profiles, history, and family trees.',
}

export const revalidate = 60

export default async function VillagesPage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'villages',
    sort: 'order',
    limit: 100,
    depth: 1,
    overrideAccess: false,
  })
  const villages = docs as Village[]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Our Villages — Sayla State
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gold/70">
        {t.nineVillageSummary}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {villages.map((village) => {
          const cover = village.coverImage as Media | null
          const villageName =
            typeof village.name === 'string' && village.name.trim() ? village.name : 'Village'
          return (
            <Link key={village.id} href={`/villages/${village.slug}`}>
              <Card>
                <CardImage>
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || villageName}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </CardImage>
                <CardContent>
                  <CardTitle>{villageName}</CardTitle>
                  <CardDescription>{village.shortDescription}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {villages.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            {t.noVillagesPublished}
          </p>
        ) : null}
      </div>
    </section>
  )
}
