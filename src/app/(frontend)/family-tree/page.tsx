import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Media, Village } from '@/payload-types'

export const metadata = {
  title: 'Family Tree / Genealogy — Rana Community Hub',
  description: 'Explore the data-driven family tree and genealogy for each Sayla State village.',
}

export default async function FamilyTreeLandingPage() {
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
        Family Tree &amp; Genealogy
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gold/70">
        Every village has its own family tree, built from the generations that came before.
        Choose a village to explore its tree.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {villages.map((village) => {
          const cover = village.coverImage as Media | null
          return (
            <Link key={village.id} href={`/villages/${village.slug}/family-tree`}>
              <Card>
                <CardImage>
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt || village.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </CardImage>
                <CardContent>
                  <CardTitle>{village.name} Family Tree</CardTitle>
                  <CardDescription>{village.shortDescription}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {villages.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            Add villages from the admin panel to start building their family trees.
          </p>
        ) : null}
      </div>
    </section>
  )
}
