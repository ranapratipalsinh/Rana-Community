import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { QuickFacts } from '@/components/about/QuickFacts'
import { SectionNav } from '@/components/about/SectionNav'
import { RulerTimeline } from '@/components/about/RulerTimeline'

export const metadata = {
  title: 'About Us — Rana Community Hub',
  description:
    'The story, history, vision and heritage of the Rana community of Sayla State.',
}

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
      <section className="border-b border-gold/10 px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">
          The Rana Community of
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.15em] text-gold md:text-4xl">
          Sayla State
        </h1>
        {about?.introduction ? (
          <div className="mx-auto mt-6 max-w-2xl">
            <RichText
              data={about.introduction}
              className="prose-p:text-lg prose-p:leading-relaxed"
            />
          </div>
        ) : null}
      </section>

      {/* Quick facts */}
      <section className="bg-ink-soft px-4 py-10">
        <QuickFacts />
      </section>

      {visibleSections.length > 0 ? (
        <>
          <SectionNav sections={visibleSections} />

          {visibleSections.map(({ key, eyebrow, heading }, i) => (
            <section
              key={key}
              id={key}
              className={`scroll-mt-14 border-b border-gold/10 px-4 py-14 ${
                i % 2 === 1 ? 'bg-ink-soft' : ''
              }`}
            >
              <div className="mx-auto max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/60">
                  {eyebrow}
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold uppercase tracking-[0.1em] text-gold">
                  {heading}
                </h2>
                <RichText data={about[key]} className="mt-4" />
                {key === 'achievements' ? <RulerTimeline /> : null}
              </div>
            </section>
          ))}
        </>
      ) : null}
    </>
  )
}
