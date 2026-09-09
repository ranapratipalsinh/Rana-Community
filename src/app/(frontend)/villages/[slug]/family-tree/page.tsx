import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { BranchFirstTree } from '@/components/family-tree/BranchFirstTree'
import type { FamilyMember, FamilyRelationship, Village } from '@/payload-types'

type Params = { slug: string }

async function getVillage(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'villages', where: { slug: { equals: slug } }, limit: 1, depth: 1, overrideAccess: false })
  return (docs[0] as Village | undefined) ?? null
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) return {}
  const name = village.name || 'Village'
  return {
    title: `${name} Family Tree | Rana Community Hub`,
    description: `Explore the family heritage and genealogy of the ${name} community through generations and family records.`,
  }
}

export default async function VillageFamilyTreePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const village = await getVillage(slug)
  if (!village) notFound()

  const payload = await getPayloadClient()
  const { docs: members } = await payload.find({
    collection: 'family-members', where: { village: { equals: village.id } }, sort: 'generation', limit: 2000, depth: 1, overrideAccess: false,
  })
  const memberIds = members.map((member) => member.id)
  const { docs: relationships } = memberIds.length
    ? await payload.find({
        collection: 'family-relationships',
        where: { and: [{ relationshipType: { equals: 'parent-child' } }, { parent: { in: memberIds } }] },
        limit: 5000,
        depth: 0,
        overrideAccess: false,
      })
    : { docs: [] }
  const villageName = village.name || 'Village'
  const typedMembers = members as FamilyMember[]
  const typedRelationships = relationships as FamilyRelationship[]
  const root = typedMembers.find((member) => member.generation === Math.min(...typedMembers.map((item) => item.generation)))
  const memberNames = new Map(typedMembers.map((member) => [member.id, member.fullName]))
  const rootChildren = root
    ? typedRelationships
        .filter((relationship) => String(relationship.parent) === String(root.id))
        .map((relationship) => ({
          id: Number(relationship.child),
          name: memberNames.get(Number(relationship.child)),
        }))
        .filter((child): child is { id: number; name: string } => Boolean(child.name))
        .sort((a, b) => a.name.localeCompare(b.name))
    : []

  return (
    <section className="bg-ink">
      <div className="border-b border-gold/20 bg-ink-soft px-4 py-7 text-gold sm:py-9">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-xs text-gold/60">
            <Link href="/villages" className="hover:text-gold">Villages</Link><span className="px-2" aria-hidden="true">/</span>
            <Link href={`/villages/${village.slug}`} className="hover:text-gold">{villageName}</Link><span className="px-2" aria-hidden="true">/</span>
            <span>Family Tree</span>
          </nav>
          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/70">A family united through generations</p>
              <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.08em] text-gold sm:text-4xl">{villageName}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ivory/75">Explore the family heritage of {villageName} through its generations and relationships.</p>
            </div>
            <Link href={`/villages/${village.slug}`} className="inline-flex min-h-11 items-center justify-center border border-gold/40 px-4 text-sm text-gold transition-colors hover:border-gold hover:bg-gold/10">Back to village</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gold/15 pt-4 text-xs uppercase tracking-[0.14em] text-gold/65">
            <span><strong className="text-gold">{members.length}</strong> published people</span>
            <span>Interactive family record</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/70">Family lineage</p>
          <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-[0.08em] text-gold sm:text-3xl">Our family tree</h2>
          <p className="mt-3 text-sm leading-6 text-ivory/70">The complete family relationship record currently maintained by the community.</p>
        </div>
        <div className="overflow-hidden border border-gold/25 bg-ink-card shadow-card">
          <BranchFirstTree villageName={villageName} members={typedMembers} relationships={typedRelationships} rootName={root?.fullName} rootChildren={rootChildren} />
        </div>
      </div>
    </section>
  )
}
