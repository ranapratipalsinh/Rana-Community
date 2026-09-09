import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import type { Media } from '@/payload-types'
import { getTranslations } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'
import './styles.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const DEFAULT_DESCRIPTION =
  'Rana Community Hub — a digital home for the Rana community of Sayla State: villages, family heritage and genealogy, events, news and more.'

// Header/footer content (logo, site name, contact info) comes from the CMS —
// without this, a statically-rendered page (see the other frontend pages)
// would keep serving whatever was true at the last deploy, so admin changes
// wouldn't show up until the next redeploy.
export const revalidate = 60

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Rana Community Hub',
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Rana Community Hub',
    title: 'Rana Community Hub',
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rana Community Hub',
    description: DEFAULT_DESCRIPTION,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const translations = getTranslations(locale)
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  const siteName = settings.siteName || 'Rana Community Hub'
  const logo = (settings.logo as Media | null) ?? null

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Header siteName={siteName} logo={logo} locale={locale} translations={translations} />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={siteName}
          contact={settings.contact}
          social={settings.social}
          translations={translations}
        />
      </body>
    </html>
  )
}
