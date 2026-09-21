'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'

import { updatePersonPhoto } from '@/lib/family-tree/adminActions'
import type { FamilyMember, Media } from '@/payload-types'

export function EditPersonPhotoModal({
  person,
  onClose,
  onUpdated,
}: {
  person: FamilyMember
  onClose: () => void
  onUpdated: () => void
}) {
  const currentPhoto = person.profilePhoto as Media | null
  const memberName =
    typeof person.fullName === 'string' && person.fullName.trim() ? person.fullName : 'Family member'

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    setError(null)
    if (!photo) {
      setError('Choose a photo to upload.')
      return
    }
    startTransition(async () => {
      const result = await updatePersonPhoto(person.id, photo)
      if (result.success) {
        onUpdated()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm border border-gold/30 bg-ink-card p-6 text-gold shadow-elevated">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/70">
          Update photo
        </p>
        <h2 className="mt-1 text-lg font-semibold text-gold">{memberName}</h2>

        <div className="mt-4 flex items-center gap-4">
          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-ink-soft">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : currentPhoto?.url ? (
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.alt || memberName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg text-gold/40">
                {memberName.charAt(0)}
              </span>
            )}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setPhoto(file)
              setPhotoPreview(file ? URL.createObjectURL(file) : null)
            }}
            className="flex-1 text-xs text-gold/70 file:mr-2 file:border file:border-gold/30 file:bg-ink file:px-2 file:py-1 file:text-xs file:text-gold file:uppercase file:tracking-wide"
          />
        </div>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gold/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-gold/70 hover:text-gold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !photo}
            className="border border-gold bg-gold px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink hover:bg-gold-light disabled:opacity-50"
          >
            {isPending ? 'Uploading…' : 'Save photo'}
          </button>
        </div>
      </div>
    </div>
  )
}
