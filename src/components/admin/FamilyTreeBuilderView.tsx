import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import type { AdminViewServerProps } from 'payload'

import { buildFamilyTree } from '@/lib/family-tree/buildTree'
import { AdminFamilyTreeCanvas } from '@/components/family-tree/AdminFamilyTreeCanvas'
import { AddFirstPersonForm } from '@/components/family-tree/AddFirstPersonForm'
import { VillageSelect } from '@/components/admin/VillageSelect'
import { getPayloadClient } from '@/lib/payload'
import type { FamilyMember, FamilyRelationship, Village } from '@/payload-types'

export async function FamilyTreeBuilderView({ payload, searchParams }: AdminViewServerProps) {
  // Payload does not gate custom admin views behind login by default. The
  // `user` prop from AdminViewServerProps was not reliably populated for a
  // custom view in testing (it read as signed-out even for a logged-in
  // admin), so check the real session directly via payload.auth() instead —
  // the same reliable check already used in the add-relative Server Actions.
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    const villageParam = searchParams?.village
    const redirectTo =
      '/admin/family-tree-builder' +
      (typeof villageParam === 'string' && villageParam ? `?village=${villageParam}` : '')

    return (
      <div style={{ padding: '2rem', maxWidth: 480 }}>
        <p>
          Please{' '}
          <Link href={`/admin/login?redirect=${encodeURIComponent(redirectTo)}`}>sign in</Link> as
          an admin to use the Family Tree Builder.
        </p>
      </div>
    )
  }

  const { docs: villages } = await payload.find({
    collection: 'villages',
    sort: 'name',
    limit: 100,
    depth: 0,
  })

  const villageIdParam = searchParams?.village
  const villageId =
    typeof villageIdParam === 'string' && villageIdParam ? Number(villageIdParam) : null
  const village = villageId ? (villages as Village[]).find((v) => v.id === villageId) : null

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Family Tree Builder</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Build a village&apos;s family tree visually — hover any person&apos;s card and click Add
        Parent / Add Spouse / Add Child to grow the tree from there, instead of creating people
        and relationships as two separate steps.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="village-select"
          style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}
        >
          Village
        </label>
        <VillageSelect villages={villages as Village[]} selectedId={village?.id ?? null} />
      </div>

      {!village ? (
        <p>Choose a village above to view or build its family tree.</p>
      ) : (
        <VillageTree village={village} />
      )}
    </div>
  )
}

async function VillageTree({ village }: { village: Village }) {
  const payload = await getPayloadClient()

  const { docs: members } = await payload.find({
    collection: 'family-members',
    where: { village: { equals: village.id } },
    sort: 'generation',
    limit: 2000,
    depth: 1,
  })

  const memberIds = members.map((m) => m.id)

  const { docs: relationships } =
    memberIds.length > 0
      ? await payload.find({
          collection: 'family-relationships',
          where: {
            or: [
              { parent: { in: memberIds } },
              { child: { in: memberIds } },
              { spouseA: { in: memberIds } },
              { spouseB: { in: memberIds } },
            ],
          },
          limit: 5000,
          depth: 0,
        })
      : { docs: [] }

  if (members.length === 0) {
    return <AddFirstPersonForm villageId={village.id} />
  }

  const { nodes, edges } = buildFamilyTree(
    members as FamilyMember[],
    relationships as FamilyRelationship[],
  )

  return (
    <>
      <div style={{ border: '1px solid #ddd' }}>
        <AdminFamilyTreeCanvas
          villageId={village.id}
          members={members as FamilyMember[]}
          nodes={nodes}
          edges={edges}
        />
      </div>
      <p style={{ marginTop: '1rem', fontSize: 13, color: '#666' }}>
        New people are added as private drafts, matching manual creation — open{' '}
        <Link href="/admin/collections/family-members">Family Members</Link> to add a photo,
        biography, and publish/mark them public when ready.
      </p>
    </>
  )
}
