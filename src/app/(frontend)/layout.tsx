import React from 'react'
import { Cinzel, Playfair_Display, Inter } from 'next/font/google'

import { getPayloadClient } from '@/lib/payload'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import type { Media } from '@/payload-types'
import './styles.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const DEFAULT_DESCRIPTION =
  'Rana Community Hub — a digital home for the Rana community of Sayla State: villages, family heritage and genealogy, events, news and more.'

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
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  const siteName = settings.siteName || 'Rana Community Hub'
  const logo = (settings.logo as Media | null) ?? null

  return (
    <html lang="en" className={`${cinzel.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Header siteName={siteName} logo={logo} />
        <main className="flex-1">{children}</main>
        <Footer siteName={siteName} contact={settings.contact} social={settings.social} />
      </body>
    </html>
  )
}
