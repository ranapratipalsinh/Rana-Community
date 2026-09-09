import Link from 'next/link'

type FooterTranslations = {
  home: string
  about: string
  villages: string
  familyTree: string
  events: string
  gallery: string
  committee: string
  navigate: string
  community: string
  contact: string
  allRightsReserved: string
}

type ContactInfo = {
  address?: string | null
  phone?: string | null
  email?: string | null
} | null

type SocialLink = {
  platform?: string | null
  url?: string | null
} | null

export function Footer({
  siteName,
  contact,
  social,
  translations,
}: {
  siteName: string
  contact?: ContactInfo
  social?: SocialLink[] | null
  translations: FooterTranslations
}) {
  return (
    <footer className="border-t border-gold/20 bg-ink text-gold">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-heading text-lg font-semibold uppercase tracking-[0.15em] text-gold">
            {siteName}
          </p>
          <p className="mt-3 text-sm text-gold/70">
            A digital home for the Rana community of Sayla State — its villages, families and heritage.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">{translations.navigate}</p>
          <ul className="mt-3 space-y-2 text-sm text-gold/70">
            <li>
              <Link href="/" className="transition-colors hover:text-gold">
                {translations.home}
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-gold">
                {translations.about}
              </Link>
            </li>
            <li>
              <Link href="/villages" className="transition-colors hover:text-gold">
                {translations.villages}
              </Link>
            </li>
            <li>
              <Link href="/family-tree" className="transition-colors hover:text-gold">
                {translations.familyTree}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">{translations.community}</p>
          <ul className="mt-3 space-y-2 text-sm text-gold/70">
            <li>
              <Link href="/events" className="transition-colors hover:text-gold">
                {translations.events}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="transition-colors hover:text-gold">
                {translations.gallery}
              </Link>
            </li>
            <li>
              <Link href="/committee" className="transition-colors hover:text-gold">
                {translations.committee}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">{translations.contact}</p>
          <ul className="mt-3 space-y-2 text-sm text-gold/70">
            {contact?.address ? <li>{contact.address}</li> : null}
            {contact?.phone ? <li>{contact.phone}</li> : null}
            {contact?.email ? <li>{contact.email}</li> : null}
          </ul>
          {social && social.length > 0 ? (
            <div className="mt-4 flex gap-4">
              {social.map((link, i) =>
                link?.url ? (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold/70 transition-colors hover:text-gold"
                  >
                    {link.platform || link.url}
                  </a>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-gold/10 py-5 text-center text-xs text-gold/70">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  )
}
