'use client'

import { useState } from 'react'
import { GitBranch, LayoutGrid } from 'lucide-react'

import { BranchFirstTree } from './BranchFirstTree'
import { FamilyTreeGridView } from './FamilyTreeGridView'
import type { FamilyMember, FamilyRelationship } from '@/payload-types'

export function FamilyTreeViewSwitcher({
  villageName,
  members,
  relationships,
  rootName,
  rootChildren,
}: {
  villageName: string
  members: FamilyMember[]
  relationships: FamilyRelationship[]
  rootName?: string
  rootChildren: Array<{ id: number; name: string }>
}) {
  const [view, setView] = useState<'tree' | 'grid'>('tree')

  return (
    <div>
      <div className="flex items-center justify-end gap-2 border-b border-gold/15 bg-ink-soft px-3 py-2">
        <button
          type="button"
          onClick={() => setView('tree')}
          className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
            view === 'tree'
              ? 'border-gold bg-gold text-ink'
              : 'border-gold/30 text-gold/70 hover:border-gold'
          }`}
        >
          <GitBranch size={14} />
          Tree view
        </button>
        <button
          type="button"
          onClick={() => setView('grid')}
          className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
            view === 'grid'
              ? 'border-gold bg-gold text-ink'
              : 'border-gold/30 text-gold/70 hover:border-gold'
          }`}
        >
          <LayoutGrid size={14} />
          Photo grid
        </button>
      </div>

      {view === 'tree' ? (
        <BranchFirstTree
          villageName={villageName}
          members={members}
          relationships={relationships}
          rootName={rootName}
          rootChildren={rootChildren}
        />
      ) : (
        <FamilyTreeGridView members={members} />
      )}
    </div>
  )
}
