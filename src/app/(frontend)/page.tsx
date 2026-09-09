import Link from 'next/link'
import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
import { HeroSlideshow } from '@/components/site/HeroSlideshow'
import { VillagesCarousel } from '@/components/site/VillagesCarousel'
import type { Event, GalleryItem, Media, News as NewsItem, Village } from '@/payload-types'
import { getTranslations } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

// Without this, the whole page (hero image, villages, everything) freezes
// at build time — an admin uploading a new hero image or adding a village
// wouldn't show up on the live site until the next deploy.
export const revalidate = 60

export default async function HomePage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const payload = await getPayloadClient()
  const now = new Date().toISOString()

  const [settings, villagesResult, upcomingEvents, latestNews, galleryHighlights] =
    await Promise.all([
      payload.findGlobal({ slug: 'site-settings', overrideAccess: false }),
      payload.find({
        collection: 'villages',
        sort: 'order',
        limit: 9,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'events',
        where: { date: { greater_than_equal: now } },
        sort: 'date',
        limit: 3,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'news',
        sort: '-date',
        limit: 3,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'gallery-items',
        where: { type: { equals: 'image' } },
        sort: '-createdAt',
        limit: 6,
        depth: 1,
        overrideAccess: false,
      }),
    ])

  const villages = villagesResult.docs as Village[]
  const events = upcomingEvents.docs as Event[]
  const news = latestNews.docs as NewsItem[]
  const gallery = galleryHighlights.docs as GalleryItem[]
  const heroImages = (settings.home?.heroImages ?? [])
    .map((item) => item.image as Media | null)
    .filter((img): img is Media => Boolean(img?.url))
  const heroImagesMobileRaw = (settings.home?.heroImagesMobile ?? [])
    .map((item) => item.image as Media | null)
    .filter((img): img is Media => Boolean(img?.url))
  // Fall back to the desktop images if no mobile-specific ones are set, so
  // nothing breaks for sites that haven't uploaded a mobile version yet.
  const heroImagesMobile = heroImagesMobileRaw.length > 0 ? heroImagesMobileRaw : heroImages
  const heroVideo = settings.home?.heroVideo as Media | null

  return (
    <>
      {/* Hero / banner — full-bleed background image slideshow or video, text overlaid */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-gold/20 text-gold md:min-h-[680px]">
        {heroVideo?.url ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroImages[0]?.url ?? undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={heroVideo.url} type={heroVideo.mimeType || 'video/mp4'} />
          </video>
        ) : heroImages.length > 0 ? (
          <>
            {/* A single wide desktop photo crops badly on a narrow phone
                screen, so mobile gets its own image (or the same one, if no
                mobile-specific version has been uploaded) via CSS visibility
                rather than a JS viewport check. */}
            <div className="block h-full w-full sm:hidden">
              <HeroSlideshow
                images={heroImagesMobile.map((img) => ({
                  url: img.url as string,
                  alt: img.alt || '',
                }))}
              />
            </div>
            <div className="hidden h-full w-full sm:block">
              <HeroSlideshow
                images={heroImages.map((img) => ({ url: img.url as string, alt: img.alt || '' }))}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}

        {/* Dark overlay for text legibility — strong on the left where the text sits, fading out so the background stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-ink/10" />

        <div className="relative z-10 w-full px-4 py-20 sm:px-8 lg:px-16">
          <div className="max-w-2xl">
            {settings.tagline ? (
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                {settings.tagline}
              </p>
            ) : null}
            {settings.home?.heroHeading ? (
              <h1
                className="font-heading text-4xl font-normal tracking-wide text-gold md:text-5xl lg:text-6xl"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
              >
                {settings.home.heroHeading}
              </h1>
            ) : null}
            {settings.home?.heroSubheading ? (
              <p className="mt-4 max-w-md text-base tracking-wide text-gold/70 md:text-lg">
                {settings.home.heroSubheading}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                {t.about}
              </Link>
              <Link href="/villages" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                {t.exploreVillages}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      {settings.home?.introText ? (
        <section className="mx-auto max-w-3xl px-4 py-14 text-center">
          <RichText data={settings.home.introText} />
        </section>
      ) : null}

      {/* History */}
      {settings.home?.history?.content ? (
        <section className="border-t border-gold/10 bg-ink-soft px-4 py-14">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            {(settings.home.history.image as Media | null)?.url ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-gold/30 bg-ink-card">
                <div className="absolute inset-0 p-8 sm:p-10">
                  <div className="relative h-full w-full">
                    <Image
                      src={(settings.home.history.image as Media).url as string}
                      alt={
                        (settings.home.history.image as Media).alt ||
                        settings.home.history.heading ||
                        'History'
                      }
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t.ourHeritage}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-[0.1em] text-gold md:text-3xl">
                {settings.home.history.heading || t.ourHistory}
              </h2>
              <RichText data={settings.home.history.content} className="mt-4" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Villages carousel */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-heading text-2xl font-bold uppercase tracking-[0.15em] text-gold md:text-3xl">
          {t.villagesOfSayla}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gold/70">
          {t.sharedHeritage}
        </p>
        <div className="mt-10">
          {villages.length > 0 ? (
            <VillagesCarousel villages={villages} />
          ) : (
            <p className="text-center text-gold/70">
              {t.noVillages}
            </p>
          )}
        </div>
      </section>

      {/* Upcoming events + latest news */}
      {events.length > 0 || news.length > 0 ? (
        <section className="border-t border-gold/10 bg-ink-soft px-4 py-14">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            {events.length > 0 ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-gold">
                    {t.upcomingEvents}
                  </h2>
                  <Link
                    href="/events"
                    className="text-sm text-gold transition-colors hover:text-gold-light"
                  >
                    View all →
                  </Link>
                </div>
                <ul className="mt-4 space-y-3">
                  {events.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="block border border-gold/15 bg-ink-card p-4 transition-colors hover:border-gold/40"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="mt-1 font-medium text-gold">{event.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {news.length > 0 ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-gold">
                    {t.latestNews}
                  </h2>
                  <Link
                    href="/news"
                    className="text-sm text-gold transition-colors hover:text-gold-light"
                  >
                    View all →
                  </Link>
                </div>
                <ul className="mt-4 space-y-3">
                  {news.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/news/${item.slug}`}
                        className="block border border-gold/15 bg-ink-card p-4 transition-colors hover:border-gold/40"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="mt-1 font-medium text-gold">{item.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Gallery highlights */}
      {gallery.length > 0 ? (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-gold">
                {t.galleryHighlights}
              </h2>
              <Link
                href="/gallery"
                className="text-sm text-gold transition-colors hover:text-gold-light"
              >
                View gallery →
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
              {gallery.map((item) => {
                const img = item.image as Media | null
                return img?.url ? (
                  <div
                    key={item.id}
                    className="relative aspect-square overflow-hidden border border-gold/15"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || item.caption || 'Gallery photo'}
                      fill
                      sizes="(min-width: 768px) 16vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
