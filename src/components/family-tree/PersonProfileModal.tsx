'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

import type { FamilyMember, Media } from '@/payload-types'

export function PersonProfileModal({
  member,
  onClose,
}: {
  member: FamilyMember | null
  onClose: () => void
}) {
  if (!member) return null

  const photo = member.profilePhoto as Media | null
  const years = (() => {
    if (member.birthYear && member.deathYear) return `${member.birthYear} – ${member.deathYear}`
    if (member.birthYear) return `Born ${member.birthYear}`
    if (member.deathYear) return `Died ${member.deathYear}`
    return null
  })()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 md:items-center md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.fullName} profile`}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto border-t-2 border-gold bg-white p-6 shadow-elevated md:max-w-md md:border-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-gold bg-ivory">
              {photo?.url ? (
                <Image
                  src={photo.url}
                  alt={photo.alt || member.fullName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg text-charcoal/40">
                  {member.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-ink">{member.fullName}</h2>
              {years ? <p className="text-sm text-charcoal/60">{years}</p> : null}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="rounded-full p-1 text-charcoal/50 hover:bg-ivory hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {member.shortBiography ? (
          <p className="mt-5 text-sm leading-relaxed text-charcoal/80">{member.shortBiography}</p>
        ) : (
          <p className="mt-5 text-sm text-charcoal/50">No biography added yet.</p>
        )}
      </div>
    </div>
  )
}
