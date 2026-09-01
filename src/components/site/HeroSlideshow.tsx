'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function HeroSlideshow({ images }: { images: { url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {images.map((img, i) => (
        <Image
          key={img.url}
          src={img.url}
          alt={img.alt}
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
