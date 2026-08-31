import Image from 'next/image'

import { getPayloadClient } from '@/lib/payload'
import type { CommitteeMember, Media } from '@/payload-types'

export const metadata = {
  title: 'Committee / Leadership — Rana Community Hub',
  description: 'Meet the committee members and leadership of the Rana community.',
}

export default async function CommitteePage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'committee-members',
    sort: 'order',
    limit: 100,
    depth: 1,
    overrideAccess: false,
  })
  const members = docs as CommitteeMember[]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Committee &amp; Leadership
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gold/70">
        The people who guide the Rana community forward.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const photo = member.photo as Media | null
          return (
            <div
              key={member.id}
              className="border border-gold/20 bg-ink-card p-6 text-center shadow-card transition-all duration-300 hover:border-gold/40 hover:shadow-elevated"
            >
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-gold">
                {photo?.url ? (
                  <Image
                    src={photo.url}
                    alt={photo.alt || member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-ink-soft text-2xl text-gold/70">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-4 text-lg font-semibold text-gold">{member.name}</p>
              <p className="text-sm font-medium uppercase tracking-wide text-gold">
                {member.position}
              </p>
              {member.shortDescription ? (
                <p className="mt-2 text-sm text-gold/70">{member.shortDescription}</p>
              ) : null}
              {member.contactInfo?.phone || member.contactInfo?.email ? (
                <div className="mt-3 space-y-0.5 text-xs text-gold/70">
                  {member.contactInfo?.phone ? <p>{member.contactInfo.phone}</p> : null}
                  {member.contactInfo?.email ? <p>{member.contactInfo.email}</p> : null}
                </div>
              ) : null}
            </div>
          )
        })}
        {members.length === 0 ? (
          <p className="col-span-full text-center text-gold/70">
            Committee members will appear here once added by the Super Admin.
          </p>
        ) : null}
      </div>
    </section>
  )
}
