import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { QuickFacts } from '@/components/about/QuickFacts'
import { SectionNav } from '@/components/about/SectionNav'
import { RulerTimeline } from '@/components/about/RulerTimeline'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'About Us — Rana Community Hub',
  description:
    'The story, history, vision and heritage of the Rana community of Sayla State.',
}

// Content here is CMS-driven — without this, edits in Website Settings
// wouldn't show up until the next deploy.
export const revalidate = 60

type AboutKey =
  | 'historyAndBackground'
  | 'visionAndMission'
  | 'objectives'
  | 'heritageAndCulture'
  | 'achievements'

const SECTIONS: Array<{ key: AboutKey; eyebrow: string; heading: string }> = [
  { key: 'historyAndBackground', eyebrow: 'Where We Come From', heading: 'History & Background' },
  { key: 'visionAndMission', eyebrow: 'What Drives Us', heading: 'Vision & Mission' },
  { key: 'objectives', eyebrow: 'What We Do', heading: 'Community Objectives' },
  { key: 'heritageAndCulture', eyebrow: 'Our Roots', heading: 'Heritage & Culture' },
  { key: 'achievements', eyebrow: 'A Legacy Continued', heading: 'Achievements & Milestones' },
]

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
  const about = settings.about

  const hasAnyContent = about && (about.introduction || SECTIONS.some((s) => about[s.key]))
  const visibleSections = SECTIONS.filter((s) => about?.[s.key])

  if (!hasAnyContent) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-gold">About Us</h1>
        <p className="mt-6 text-gold/70">
          About Us content will appear here once the Super Admin fills it in from Website
          Settings in the admin panel.
        </p>
      </section>
    )
  }

  return (
    <>
      {/* Header + lede */}
      <section className="relative overflow-hidden border-b border-gold/10 px-4 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,169,110,0.16), transparent 70%)',
          }}
        />
        <div className="relative">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold/40" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">
              The Rana Community of
            </p>
            <span className="h-px w-10 bg-gold/40" />
          </div>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-[0.15em] text-gold md:text-5xl">
            Sayla State
          </h1>
          {about?.introduction ? (
            <div className="mx-auto mt-8 max-w-2xl border-l border-gold/25 pl-6 text-left sm:pl-8">
              <RichText
                data={about.introduction}
                className="prose-p:font-heading prose-p:text-xl prose-p:italic prose-p:leading-relaxed prose-p:text-gold/90"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Quick facts */}
      <section className="bg-ink-soft px-4 py-12">
        <QuickFacts />
      </section>

      {visibleSections.length > 0 ? (
        <>
          <SectionNav sections={visibleSections} />

          {visibleSections.map(({ key, eyebrow, heading }, i) => (
            <section
              key={key}
              id={key}
              className={`relative scroll-mt-32 border-b border-gold/10 px-4 py-20 ${
                i % 2 === 1 ? 'bg-ink-soft' : ''
              }`}
            >
              <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
                {/* Label column — stays put while a long section scrolls by, so
                    the reader always knows which chapter they're in */}
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <span
                    className="font-heading text-6xl font-bold leading-none text-gold/10 md:text-7xl"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold/60">
                    {eyebrow}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold uppercase tracking-[0.1em] text-gold">
                    {heading}
                  </h2>
                  <div className="mt-3 h-px w-12 bg-gold/30" />
                </div>

                {/* Reading column — sized and spaced for comfortable long-form
                    reading, with a storybook-style drop cap opening the section */}
                <div className="mt-8 max-w-2xl lg:mt-0">
                  <RichText
                    data={about[key]}
                    className="prose-p:text-lg prose-p:leading-loose [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:mr-3 [&_p:first-of-type::first-letter]:mt-1 [&_p:first-of-type::first-letter]:font-heading [&_p:first-of-type::first-letter]:text-6xl [&_p:first-of-type::first-letter]:leading-[0.8] [&_p:first-of-type::first-letter]:text-gold"
                  />
                  {key === 'achievements' ? <RulerTimeline /> : null}
                </div>
              </div>
            </section>
          ))}
        </>
      ) : null}

      {/* Closing — always renders, so the page has an intentional ending even
          while some sections above are still being filled in */}
      <section className="border-t border-gold/10 px-4 py-16 text-center">
        <p className="mx-auto max-w-xl text-sm text-gold/60">
          Explore the nine villages of Sayla State, trace family lineages, or reach out to the
          committee directly.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/villages" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
            Explore Our Villages
          </Link>
          <Link
            href="/contact"
            className={`${buttonVariants({ variant: 'outline', size: 'lg' })} inline-flex items-center gap-2`}
          >
            Contact Us
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
