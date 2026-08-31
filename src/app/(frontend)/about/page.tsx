import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'

export const metadata = {
  title: 'About Us — Rana Community Hub',
  description:
    'The story, history, vision and heritage of the Rana community of Sayla State.',
}

const SECTIONS: Array<{ key: 'introduction' | 'historyAndBackground' | 'visionAndMission' | 'objectives' | 'heritageAndCulture' | 'achievements'; heading: string }> = [
  { key: 'introduction', heading: 'Introduction' },
  { key: 'historyAndBackground', heading: 'History & Background' },
  { key: 'visionAndMission', heading: 'Vision & Mission' },
  { key: 'objectives', heading: 'Community Objectives' },
  { key: 'heritageAndCulture', heading: 'Heritage & Culture' },
  { key: 'achievements', heading: 'Achievements & Milestones' },
]

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
  const about = settings.about

  const hasAnyContent = about && SECTIONS.some((s) => about[s.key])

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-gold">About Us</h1>

      {hasAnyContent ? (
        <div className="mt-8 space-y-10">
          {SECTIONS.map(({ key, heading }) =>
            about?.[key] ? (
              <div key={key}>
                <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">
                  {heading}
                </h2>
                <RichText data={about[key]} className="mt-2" />
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <p className="mt-6 text-gold/70">
          About Us content will appear here once the Super Admin fills it in from Website
          Settings in the admin panel.
        </p>
      )}
    </section>
  )
}
