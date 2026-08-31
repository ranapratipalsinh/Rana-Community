import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { FamilyTreeCanvas } from '@/components/family-tree/FamilyTreeCanvas'
import { buildFamilyTree } from '@/lib/family-tree/buildTree'
import type { FamilyMember, FamilyRelationship, Village } from '@/payload-types'

type Params = { slug: string }

async function getVillage(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'villages',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })
  return (docs[0] as Village | undefined) ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) return {}
  return {
    title: `Family Tree — ${village.name} — Rana Community Hub`,
    description: `Explore the interactive family tree and genealogy of ${village.name}.`,
  }
}

export default async function VillageFamilyTreePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) notFound()

  const payload = await getPayloadClient()

  const { docs: members } = await payload.find({
    collection: 'family-members',
    where: { village: { equals: village.id } },
    sort: 'generation',
    limit: 2000,
    depth: 1,
    overrideAccess: false,
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
          overrideAccess: false,
        })
      : { docs: [] }

  // Layout is computed here on the server (dagre has no business in the
  // client bundle) and handed to the client canvas as plain, already-laid-out
  // nodes/edges.
  const { nodes, edges } = buildFamilyTree(
    members as FamilyMember[],
    relationships as FamilyRelationship[],
  )

  return (
    <section>
      <div className="border-b border-gold/20 bg-ink px-4 py-8 text-center text-gold">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Family Tree</p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.1em] text-gold md:text-3xl">
          {village.name}
        </h1>
        <Link
          href={`/villages/${village.slug}`}
          className="mt-3 inline-block text-sm text-gold/70 underline hover:text-gold"
        >
          ← Back to {village.name}
        </Link>
      </div>

      <FamilyTreeCanvas members={members as FamilyMember[]} nodes={nodes} edges={edges} />
    </section>
  )
}
