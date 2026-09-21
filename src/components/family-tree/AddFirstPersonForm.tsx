'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { createFirstPerson } from '@/lib/family-tree/adminActions'

export function AddFirstPersonForm({ villageId }: { villageId: number }) {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    setError(null)
    if (!fullName.trim()) {
      setError('Name is required.')
      return
    }
    startTransition(async () => {
      const result = await createFirstPerson({
        villageId,
        fullName: fullName.trim(),
        gender: gender || undefined,
        photo: photo ?? undefined,
      })
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="mx-auto max-w-sm border border-gold/30 bg-ink-card p-6 text-center">
      <p className="text-sm text-gold/70">
        No one has been added to this village&apos;s tree yet. Start with the earliest known
        ancestor — you can add everyone else from their card once they&apos;re on the tree.
      </p>
      <div className="mt-4 space-y-3 text-left">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gold/70">
            Full name *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full border border-gold/30 bg-ink px-3 py-2 text-sm text-gold focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gold/70">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
            className="mt-1 w-full border border-gold/30 bg-ink px-2 py-2 text-sm text-gold focus:border-gold focus:outline-none"
          >
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-gold/70">
            Photo
          </label>
          <div className="mt-1 flex items-center gap-3">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-ink-soft">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-gold/40">
                  —
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
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-4 w-full border border-gold bg-gold px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink hover:bg-gold-light disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Add first person'}
      </button>
    </div>
  )
}
