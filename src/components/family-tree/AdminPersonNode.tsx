'use client'

import Image from 'next/image'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

import type { Media } from '@/payload-types'
import type { PersonNodeData } from '@/lib/family-tree/buildTree'

export type AdminPersonNodeData = PersonNodeData & {
  onAddRelative: (relationType: 'parent' | 'spouse' | 'child') => void
}

export function AdminPersonNode({ data, selected }: NodeProps<Node<AdminPersonNodeData>>) {
  const { member, onAddRelative } = data
  const photo = member.profilePhoto as Media | null

  const years = (() => {
    if (member.birthYear && member.deathYear) return `${member.birthYear} – ${member.deathYear}`
    if (member.birthYear) return `b. ${member.birthYear}`
    if (member.deathYear) return `d. ${member.deathYear}`
    return null
  })()

  return (
    <div
      className={`group relative w-[170px] border-2 bg-white px-3 py-2 text-center shadow-card transition-shadow sm:w-[190px] ${
        selected ? 'border-bronze shadow-elevated' : 'border-gold'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-gold" />

      {/* Not published/public yet — visible only in this admin builder */}
      {member.displayStatus !== 'public' || member._status !== 'published' ? (
        <span className="absolute -top-2 -left-2 bg-bronze px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
          Draft
        </span>
      ) : null}

      <div className="mx-auto h-11 w-11 overflow-hidden rounded-full border border-gold/50 bg-ivory sm:h-12 sm:w-12">
        {photo?.url ? (
          <Image
            src={photo.url}
            alt={photo.alt || member.fullName}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/40">
            {member.fullName.charAt(0)}
          </div>
        )}
      </div>

      <p className="mt-1 truncate text-sm font-semibold text-ink">{member.fullName}</p>
      {years ? <p className="text-xs text-charcoal/60">{years}</p> : null}

      <div className="mt-2 flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onAddRelative('parent')}
          className="border border-charcoal/20 bg-white px-1.5 py-0.5 text-[10px] font-medium text-charcoal hover:border-bronze hover:text-bronze"
          title="Add parent"
        >
          + Parent
        </button>
        <button
          type="button"
          onClick={() => onAddRelative('spouse')}
          className="border border-charcoal/20 bg-white px-1.5 py-0.5 text-[10px] font-medium text-charcoal hover:border-bronze hover:text-bronze"
          title="Add spouse"
        >
          + Spouse
        </button>
        <button
          type="button"
          onClick={() => onAddRelative('child')}
          className="border border-charcoal/20 bg-white px-1.5 py-0.5 text-[10px] font-medium text-charcoal hover:border-bronze hover:text-bronze"
          title="Add child"
        >
          + Child
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-gold" />
    </div>
  )
}
