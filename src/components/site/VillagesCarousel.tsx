'use client'

import Link from 'next/link'
import Image from 'next/image'

import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import type { Media, Village } from '@/payload-types'

export function VillagesCarousel({ villages }: { villages: Village[] }) {
  return (
    <InfiniteSlider gap={24} speed={40} speedOnHover={12} className="py-2">
      {villages.map((village) => {
        const cover = village.coverImage as Media | null
        const villageName =
          typeof village.name === 'string' && village.name.trim() ? village.name : 'Village'
        return (
          <Link key={village.id} href={`/villages/${village.slug}`} className="w-[280px] sm:w-[340px]">
            <Card>
              <CardImage>
                {cover?.url ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt || villageName}
                    fill
                    sizes="(min-width: 640px) 340px, 280px"
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
    </InfiniteSlider>
  )
}
