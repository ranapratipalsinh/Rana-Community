import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'

import { getPayloadClient } from '@/lib/payload'
import type { Event, FamilyMember, News as NewsItem, Village } from '@/payload-types'

export const metadata = {
  title: 'Search — Rana Community Hub',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()

  let villages: Village[] = []
  let people: FamilyMember[] = []
  let events: Event[] = []
  let news: NewsItem[] = []

  if (query) {
    const payload = await getPayloadClient()
    const [villagesRes, peopleRes, eventsRes, newsRes] = await Promise.all([
      payload.find({
        collection: 'villages',
        where: { name: { contains: query } },
        limit: 10,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'family-members',
        where: { fullName: { contains: query } },
        limit: 10,
        depth: 1,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'events',
        where: { title: { contains: query } },
        limit: 10,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'news',
        where: { title: { contains: query } },
        limit: 10,
        overrideAccess: false,
      }),
    ])
    villages = villagesRes.docs as Village[]
    people = peopleRes.docs as FamilyMember[]
    events = eventsRes.docs as Event[]
    news = newsRes.docs as NewsItem[]
  }

  const totalResults = villages.length + people.length + events.length + news.length

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Search
      </h1>

      <form action="/search" method="get" className="mx-auto mt-8 max-w-lg">
        <div className="relative">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold/70"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search villages, people, events, announcements…"
            className="w-full border border-gold/30 bg-ink-card py-3 pl-10 pr-4 text-sm text-gold placeholder:text-gold/70 focus:border-gold focus:outline-none"
            autoFocus
          />
        </div>
      </form>

      {query ? (
        <div className="mt-10 space-y-8">
          {totalResults === 0 ? (
            <p className="text-center text-gold/70">No results found for &quot;{query}&quot;.</p>
          ) : null}

          {villages.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide text-gold">Villages</h2>
              <ul className="mt-2 space-y-1">
                {villages.map((v) => (
                  <li key={v.id}>
                    <Link
                      href={`/villages/${v.slug}`}
                      className="text-gold hover:text-gold-light hover:underline"
                    >
                      {v.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {people.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide text-gold">People</h2>
              <ul className="mt-2 space-y-1">
                {people.map((p) => {
                  const village = p.village as Village | number
                  const slug = typeof village === 'object' ? village.slug : undefined
                  return (
                    <li key={p.id}>
                      {slug ? (
                        <Link
                          href={`/villages/${slug}/family-tree`}
                          className="text-gold hover:text-gold-light hover:underline"
                        >
                          {p.fullName}
                        </Link>
                      ) : (
                        <span className="text-gold">{p.fullName}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {events.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide text-gold">Events</h2>
              <ul className="mt-2 space-y-1">
                {events.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}`}
                      className="text-gold hover:text-gold-light hover:underline"
                    >
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {news.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold uppercase tracking-wide text-gold">
                News &amp; Announcements
              </h2>
              <ul className="mt-2 space-y-1">
                {news.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/news/${n.slug}`}
                      className="text-gold hover:text-gold-light hover:underline"
                    >
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
