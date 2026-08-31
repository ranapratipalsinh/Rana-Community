import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Media, Village } from '@/payload-types'

export const metadata = {
  title: 'Our Villages — Sayla State — Rana Community Hub',
  description: 'Explore the 9 villages of Sayla State — profiles, history, and family trees.',
}

export default async function VillagesPage() {
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
        Nine villages, each with its own profile, history and family tree.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {villages.map((village) => {
          const cover = village.coverImage as Media | null
          return (
            <Link key={village.id} href={`/villages/${village.slug}`}>
              <Card>
                <CardImage>
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || village.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </CardImage>
                <CardContent>
                  <CardTitle>{village.name}</CardTitle>
                  <CardDescription>{village.shortDescription}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {villages.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            No villages published yet. The Super Admin can add all 9 Sayla State villages from the
            admin panel.
          </p>
        ) : null}
      </div>
    </section>
  )
}
