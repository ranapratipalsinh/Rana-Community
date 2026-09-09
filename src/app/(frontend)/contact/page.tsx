import { getPayloadClient } from '@/lib/payload'
import { ContactForm } from '@/components/contact/ContactForm'
import { getTranslations } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export const metadata = {
  title: 'Contact Us — Rana Community Hub',
  description: 'Get in touch with the Rana Community Hub — address, phone, email and a contact form.',
}

export const revalidate = 60

export default async function ContactPage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
  const contact = settings.contact
  const social = settings.social

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Contact Us
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <div className="space-y-4">
            {contact?.address ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {t.address}
                </h2>
                <p className="mt-1 whitespace-pre-line text-gold/70">{contact.address}</p>
              </div>
            ) : null}
            {contact?.phone ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {t.phone}
                </h2>
                <p className="mt-1 text-gold/70">{contact.phone}</p>
              </div>
            ) : null}
            {contact?.email ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {t.email}
                </h2>
                <p className="mt-1 text-gold/70">{contact.email}</p>
              </div>
            ) : null}
            {social && social.length > 0 ? (
              <div className="flex gap-3 pt-2">
                {social.map((link, i) =>
                  link?.url ? (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold underline hover:text-gold-light"
                    >
                      {link.platform || link.url}
                    </a>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>

          {contact?.mapEmbedUrl ? (
            <div className="mt-6 aspect-video w-full overflow-hidden border border-gold/30">
              <iframe
                src={contact.mapEmbedUrl}
                title="Location map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}

          {!contact?.address && !contact?.phone && !contact?.email ? (
            <p className="text-gold/70">
              Contact details will appear here once the Super Admin adds them under Website
              Settings.
            </p>
          ) : null}
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
