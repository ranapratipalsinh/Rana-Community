'use client'

import { useState } from 'react'

import { BranchFirstTree } from './BranchFirstTree'
import { FamilyTreeImageViewer } from './FamilyTreeImageViewer'
import type { FamilyMember, FamilyRelationship } from '@/payload-types'

type Tab = 'original' | 'interactive'

export function FamilyTreeTabs({
  villageName,
  originalImage,
  members,
  relationships,
  rootName,
  rootChildren,
}: {
  villageName: string
  originalImage: { url: string; alt: string } | null
  members: FamilyMember[]
  relationships: FamilyRelationship[]
  rootName?: string
  rootChildren: Array<{ id: number; name: string }>
}) {
  const hasImage = Boolean(originalImage)
  const hasInteractiveData = members.length > 0

  // Default view is always Original when it exists (per spec); otherwise
  // fall back to whichever view is actually available.
  const [tab, setTab] = useState<Tab>(hasImage ? 'original' : 'interactive')

  const showBothTabs = hasImage && hasInteractiveData

  return (
    <div>
      {showBothTabs ? (
        <div
          role="tablist"
          aria-label="Family tree view"
          className="grid grid-cols-2 border border-gold/30"
        >
          <button
            type="button"
            role="tab"
            id="tab-original"
            aria-selected={tab === 'original'}
            aria-controls="panel-original"
            onClick={() => setTab('original')}
            className={`border-r border-gold/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              tab === 'original' ? 'bg-gold text-ink' : 'bg-transparent text-gold/70 hover:text-gold'
            }`}
          >
            Original Family Tree
          </button>
          <button
            type="button"
            role="tab"
            id="tab-interactive"
            aria-selected={tab === 'interactive'}
            aria-controls="panel-interactive"
            onClick={() => setTab('interactive')}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              tab === 'interactive' ? 'bg-gold text-ink' : 'bg-transparent text-gold/70 hover:text-gold'
            }`}
          >
            Interactive Family Tree
          </button>
        </div>
      ) : null}

      <div className="mt-6">
        {tab === 'original' && hasImage ? (
          <div id="panel-original" role="tabpanel" aria-labelledby="tab-original">
            <FamilyTreeImageViewer url={originalImage!.url} alt={originalImage!.alt} />
          </div>
        ) : (
          <div id="panel-interactive" role="tabpanel" aria-labelledby="tab-interactive">
            {hasInteractiveData ? (
              <div className="overflow-hidden border border-gold/25 bg-ink-card shadow-card">
                <BranchFirstTree
                  villageName={villageName}
                  members={members}
                  relationships={relationships}
                  rootName={rootName}
                  rootChildren={rootChildren}
                />
              </div>
            ) : (
              <div className="border border-gold/25 bg-ink-card px-6 py-16 text-center">
                <p className="font-heading text-lg text-gold">Interactive Family Tree</p>
                <p className="mt-2 text-sm text-gold/60">
                  An interactive version of this family tree is being prepared.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
