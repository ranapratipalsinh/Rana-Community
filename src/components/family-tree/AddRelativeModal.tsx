'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'

import { addRelative } from '@/lib/family-tree/adminActions'
import type { FamilyMember, Media } from '@/payload-types'

const RELATION_LABEL: Record<'parent' | 'spouse' | 'child', string> = {
  parent: 'Parent',
  spouse: 'Spouse',
  child: 'Child',
}

export function AddRelativeModal({
  anchor,
  relationType,
  villageId,
  existingMembers,
  onClose,
  onCreated,
}: {
  anchor: FamilyMember
  relationType: 'parent' | 'spouse' | 'child'
  villageId: number
  existingMembers: FamilyMember[]
  onClose: () => void
  onCreated: () => void
}) {
  const [mode, setMode] = useState<'new' | 'existing'>('new')
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [birthYear, setBirthYear] = useState('')
  const [deathYear, setDeathYear] = useState('')
  const [search, setSearch] = useState('')
  const [existingId, setExistingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const candidates = useMemo(() => {
    const query = search.trim().toLowerCase()
    return existingMembers
      .filter((m) => m.id !== anchor.id)
      .filter((m) => (query ? m.fullName.toLowerCase().includes(query) : true))
      .slice(0, 30)
  }, [existingMembers, search, anchor.id])

  const handleSubmit = () => {
    setError(null)

    if (mode === 'existing' && !existingId) {
      setError('Choose an existing person to link.')
      return
    }
    if (mode === 'new' && !fullName.trim()) {
      setError('Name is required.')
      return
    }

    startTransition(async () => {
      const result = await addRelative({
        villageId,
        anchorId: anchor.id,
        anchorGeneration: anchor.generation,
        relationType,
        mode,
        existingPersonId: existingId ?? undefined,
        newPerson:
          mode === 'new'
            ? {
                fullName: fullName.trim(),
                gender: gender || undefined,
                birthYear: birthYear ? Number(birthYear) : undefined,
                deathYear: deathYear ? Number(deathYear) : undefined,
              }
            : undefined,
      })

      if (result.success) {
        onCreated()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto border border-gold/30 bg-ink-card p-6 text-gold shadow-elevated">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/70">
          Add {RELATION_LABEL[relationType]}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-gold">
          {relationType === 'spouse' ? "for" : "of"} {anchor.fullName}
        </h2>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`flex-1 border px-3 py-1.5 text-xs font-medium uppercase tracking-wide ${
              mode === 'new' ? 'border-gold bg-gold text-ink' : 'border-gold/30 text-gold/70'
            }`}
          >
            New person
          </button>
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 border px-3 py-1.5 text-xs font-medium uppercase tracking-wide ${
              mode === 'existing' ? 'border-gold bg-gold text-ink' : 'border-gold/30 text-gold/70'
            }`}
          >
            Link existing
          </button>
        </div>

        {mode === 'new' ? (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gold/70">
                Full name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full border border-gold/30 bg-ink px-3 py-2 text-sm text-gold focus:border-gold focus:outline-none"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
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
                  Birth yr
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="mt-1 w-full border border-gold/30 bg-ink px-2 py-2 text-sm text-gold focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-gold/70">
                  Death yr
                </label>
                <input
                  type="number"
                  value={deathYear}
                  onChange={(e) => setDeathYear(e.target.value)}
                  className="mt-1 w-full border border-gold/30 bg-ink px-2 py-2 text-sm text-gold focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gold/60">
              Photo, biography and publish status can be added afterward from this person&apos;s
              full record.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full border border-gold/30 bg-ink px-3 py-2 text-sm text-gold placeholder:text-gold/50 focus:border-gold focus:outline-none"
            />
            <ul className="max-h-64 space-y-1 overflow-y-auto">
              {candidates.map((m) => {
                const photo = m.profilePhoto as Media | null
                const memberName =
                  typeof m.fullName === 'string' && m.fullName.trim() ? m.fullName : 'Family member'
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setExistingId(m.id)}
                      className={`flex w-full items-center gap-2 border px-2 py-1.5 text-left text-sm ${
                        existingId === m.id
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/15 text-gold/80 hover:border-gold/40'
                      }`}
                    >
                      <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-ink-soft">
                        {photo?.url ? (
                          <Image
                            src={photo.url}
                            alt=""
                            width={28}
                            height={28}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[10px] text-gold/50">
                            {memberName.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span className="truncate">{memberName}</span>
                    </button>
                  </li>
                )
              })}
              {candidates.length === 0 ? (
                <li className="px-2 py-1.5 text-sm text-gold/50">No matches.</li>
              ) : null}
            </ul>
          </div>
        )}

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
            disabled={isPending}
            className="border border-gold bg-gold px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink hover:bg-gold-light disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
