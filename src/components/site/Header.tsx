'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Languages, Menu, Search, X } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'
import { LOCALE_LABELS, LOCALES, type Locale } from '@/lib/i18n'

type HeaderTranslations = {
  home: string; about: string; villages: string; familyTree: string; events: string;
  gallery: string; committee: string; search: string; selectLanguage: string
}

export function Header({ siteName, logo, locale, translations }: {
  siteName: string; logo?: MediaType | null; locale: Locale; translations: HeaderTranslations
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '/', label: translations.home }, { href: '/about', label: translations.about },
    { href: '/villages', label: translations.villages }, { href: '/family-tree', label: translations.familyTree },
    { href: '/events', label: translations.events }, { href: '/gallery', label: translations.gallery },
    { href: '/committee', label: translations.committee },
  ]

  function changeLocale(nextLocale: string) {
    if (!LOCALES.includes(nextLocale as Locale)) return
    document.cookie = `rana-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ink text-gold">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || siteName}
              width={200}
              height={64}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
          ) : (
            <span className="font-heading text-lg font-semibold uppercase tracking-[0.2em] text-gold sm:text-xl">
              {siteName}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden flex-wrap items-center justify-end gap-x-6 gap-y-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.1em] text-gold/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/search" aria-label={translations.search} className="text-gold hover:text-gold-light">
            <Search size={20} />
          </Link>

          <label className="flex items-center gap-2 text-gold" title={translations.selectLanguage}>
            <Languages size={18} aria-hidden="true" />
            <select value={locale} onChange={(event) => changeLocale(event.target.value)}
              aria-label={translations.selectLanguage}
              className="bg-transparent text-xs font-medium uppercase tracking-[0.08em] outline-none">
              {LOCALES.map((code) => <option key={code} value={code} className="bg-ink text-gold">
                {LOCALE_LABELS[code]}
              </option>)}
            </select>
          </label>

          <button
            className="text-gold lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="flex flex-col gap-1 border-t border-gold/20 px-4 pb-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2 text-xs font-medium uppercase tracking-[0.1em] text-gold/70 transition-colors hover:bg-ink-soft hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
