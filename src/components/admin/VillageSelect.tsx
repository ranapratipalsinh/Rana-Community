'use client'

import { useRouter } from 'next/navigation'

import type { Village } from '@/payload-types'

export function VillageSelect({
  villages,
  selectedId,
}: {
  villages: Village[]
  selectedId: number | null
}) {
  const router = useRouter()

  return (
    <select
      value={selectedId ?? ''}
      onChange={(e) => router.push(`/admin/family-tree-builder?village=${e.target.value}`)}
      style={{ padding: '0.5rem', minWidth: 260 }}
    >
      <option value="" disabled>
        Choose a village…
      </option>
      {villages.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  )
}
