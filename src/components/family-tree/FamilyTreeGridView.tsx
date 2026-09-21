import Image from 'next/image'

import type { FamilyMember, Media } from '@/payload-types'

export function FamilyTreeGridView({ members }: { members: FamilyMember[] }) {
  const sorted = [...members].sort(
    (a, b) =>
      (a.generation || 0) - (b.generation || 0) ||
      (a.fullName || '').localeCompare(b.fullName || ''),
  )

  if (sorted.length === 0) {
    return <p className="p-8 text-center text-sm text-gold/60">No family members published yet.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-gold/10 sm:grid-cols-3 md:grid-cols-4">
      {sorted.map((member) => {
        const photo = member.profilePhoto as Media | null
        const name = member.fullName || 'Unnamed family member'
        const years = (() => {
          if (member.birthYear && member.deathYear) return `${member.birthYear} – ${member.deathYear}`
          if (member.birthYear) return `b. ${member.birthYear}`
          if (member.deathYear) return `d. ${member.deathYear}`
          return null
        })()

        return (
          <div
            key={member.id}
            className="flex flex-col items-center gap-2 bg-ink-card px-3 py-6 text-center transition-colors hover:bg-ink-soft"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full border border-gold/40 bg-ivory sm:h-20 sm:w-20">
              {photo?.url ? (
                <Image
                  src={photo.url}
                  alt={photo.alt || name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg text-charcoal/40">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <p className="truncate text-sm font-semibold text-gold">{name}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-gold/60">
              Generation {member.generation || '—'}
            </p>
            {years ? <p className="text-xs text-gold/50">{years}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
