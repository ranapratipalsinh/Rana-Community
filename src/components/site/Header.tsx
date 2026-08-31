'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, X } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/villages', label: 'Our Villages' },
  { href: '/family-tree', label: 'Family Tree' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/committee', label: 'Committee' },
]

export function Header({ siteName, logo }: { siteName: string; logo?: MediaType | null }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-gold/20 bg-ink text-gold">
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.1em] text-gold/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/search" aria-label="Search" className="text-gold hover:text-gold-light">
            <Search size={20} />
          </Link>

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
          {NAV_LINKS.map((link) => (
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
