'use client'

import Image from 'next/image'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

import type { Media } from '@/payload-types'
import type { PersonNodeData } from '@/lib/family-tree/buildTree'

export function PersonNode({ data, selected }: NodeProps<Node<PersonNodeData>>) {
  const { member } = data
  const photo = member.profilePhoto as Media | null

  const years = (() => {
    if (member.birthYear && member.deathYear) return `${member.birthYear} – ${member.deathYear}`
    if (member.birthYear) return `b. ${member.birthYear}`
    if (member.deathYear) return `d. ${member.deathYear}`
    return null
  })()

  return (
    <div
      className={`w-[170px] border-2 bg-white px-3 py-2 text-center shadow-card transition-shadow sm:w-[190px] ${
        selected ? 'border-bronze shadow-elevated' : 'border-gold'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-gold" />

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

      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-gold" />
    </div>
  )
}
