'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

import type { GalleryItem, Media } from '@/payload-types'

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const imageItems = items.filter(
    (item) => item.type === 'image' && (item.image as Media | null)?.url,
  )
  const [openId, setOpenId] = useState<number | null>(null)
  const activeIndex = imageItems.findIndex((item) => item.id === openId)

  const close = () => setOpenId(null)
  const showPrev = () => {
    if (activeIndex < 0) return
    const prev = imageItems[(activeIndex - 1 + imageItems.length) % imageItems.length]
    setOpenId(prev.id)
  }
  const showNext = () => {
    if (activeIndex < 0) return
    const next = imageItems[(activeIndex + 1) % imageItems.length]
    setOpenId(next.id)
  }

  useEffect(() => {
    if (openId === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openId, close, showPrev, showNext])

  const activeItem = activeIndex >= 0 ? imageItems[activeIndex] : null
  const activeImage = activeItem ? (activeItem.image as Media | null) : null

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => {
          const img = item.image as Media | null
          return (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden border border-gold/15"
            >
              {item.type === 'image' && img?.url ? (
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className="block h-full w-full"
                  aria-label={`View full size: ${img.alt || item.caption || 'Gallery photo'}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || item.caption || 'Gallery photo'}
                    fill
                    sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </button>
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
                <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-xs text-gold">
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

      {activeItem && activeImage?.url ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 text-gold hover:text-gold-light"
          >
            <X size={32} />
          </button>

          {imageItems.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              aria-label="Previous image"
              className="absolute left-2 text-gold hover:text-gold-light sm:left-6"
            >
              <ChevronLeft size={40} />
            </button>
          ) : null}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt || activeItem.caption || 'Gallery photo'}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {imageItems.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label="Next image"
              className="absolute right-2 text-gold hover:text-gold-light sm:right-6"
            >
              <ChevronRight size={40} />
            </button>
          ) : null}

          {activeItem.caption ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/70 px-3 py-1.5 text-sm text-gold">
              {activeItem.caption}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
