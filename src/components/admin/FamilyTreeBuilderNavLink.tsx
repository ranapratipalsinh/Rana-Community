import Link from 'next/link'

export function FamilyTreeBuilderNavLink() {
  return (
    <div style={{ padding: '0 8px 8px' }}>
      <Link href="/admin/family-tree-builder" style={{ fontSize: 13 }}>
        🌳 Family Tree Builder
      </Link>
    </div>
  )
}
