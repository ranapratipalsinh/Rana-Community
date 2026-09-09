'use client'

import { Leaf, Users } from 'lucide-react'

import type { FamilyMember, FamilyRelationship } from '@/payload-types'

type Branch = {
  name: string
  rootId?: number
  tone: 'green' | 'amber' | 'blue' | 'red'
  families?: number
  members?: number
}

type BranchFirstTreeProps = {
  villageName: string
  members: FamilyMember[]
  relationships: FamilyRelationship[]
  rootName?: string
  rootChildren: Array<{ id: number; name: string }>
}

const sampleBranches: Branch[] = [
  { name: 'Rana Branch', tone: 'green', families: 24, members: 128 },
  { name: 'Solanki Branch', tone: 'amber', families: 18, members: 96 },
  { name: 'Vaghela Branch', tone: 'red', families: 21, members: 110 },
  { name: 'Chauhan Branch', tone: 'blue', families: 16, members: 84 },
]

const toneClasses: Record<Branch['tone'], string> = {
  green: 'border-emerald-300/60 bg-emerald-950/55',
  amber: 'border-amber-200/60 bg-amber-950/45',
  red: 'border-rose-300/55 bg-rose-950/45',
  blue: 'border-sky-300/55 bg-sky-950/45',
}

function relationId(value: number | FamilyMember | null | undefined) {
  return typeof value === 'object' && value ? value.id : value
}

function MemberCard({ member, tone }: { member: FamilyMember; tone: Branch['tone'] }) {
  const name = member.fullName || 'Unnamed family member'

  return (
    <div className={`flex min-h-24 w-full items-center justify-center gap-3 border px-3 py-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.16)] sm:min-h-28 sm:px-4 sm:py-5 ${toneClasses[tone]}`}>
      <div className="min-w-0">
        <Leaf className="mx-auto h-5 w-5 text-gold/80 sm:h-6 sm:w-6" strokeWidth={1.4} aria-hidden="true" />
        <p className="mt-2 truncate text-xs font-medium text-ivory sm:text-base">{name}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gold/70">Generation {member.generation || '-'}</p>
      </div>
    </div>
  )
}

function MemberTree({
  member,
  tone,
  childrenByParent,
  memberById,
}: {
  member: FamilyMember
  tone: Branch['tone']
  childrenByParent: Map<number, number[]>
  memberById: Map<number, FamilyMember>
}) {
  const children = (childrenByParent.get(member.id) || [])
    .map((id) => memberById.get(id))
    .filter((child): child is FamilyMember => Boolean(child))
    .sort((a, b) => (a.generation || 0) - (b.generation || 0) || (a.fullName || '').localeCompare(b.fullName || ''))

  return (
    <div className="relative flex w-full flex-col items-center">
      <MemberCard member={member} tone={tone} />
      {children.length ? (
        <div className="relative mt-1 w-full pt-5">
          <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-gold/50" aria-hidden="true" />
          {children.length > 1 ? <span className="absolute left-[calc(25%-2px)] right-[calc(25%-2px)] top-0 h-px bg-gold/50 sm:left-[calc(25%-5px)] sm:right-[calc(25%-5px)]" aria-hidden="true" /> : null}
          <div className={`grid gap-2 sm:gap-5 ${children.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {children.map((child) => (
              <div key={child.id} className="relative pt-5">
                {children.length > 1 ? <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-gold/50" aria-hidden="true" /> : null}
                <MemberTree member={child} tone={tone} childrenByParent={childrenByParent} memberById={memberById} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function BranchFirstTree({ villageName, members, relationships, rootName, rootChildren }: BranchFirstTreeProps) {
  const realMembers = members.filter((member) => Boolean(member.fullName))
  const rootMember = realMembers.find((member) => member.fullName === rootName)
  const memberById = new Map(realMembers.map((member) => [member.id, member]))
  const childrenByParent = new Map<number, number[]>()
  relationships.forEach((relationship) => {
    const parentId = relationId(relationship.parent)
    const childId = relationId(relationship.child)
    if (typeof parentId !== 'number' || typeof childId !== 'number' || !memberById.has(childId)) return
    const children = childrenByParent.get(parentId) || []
    if (!children.includes(childId)) children.push(childId)
    childrenByParent.set(parentId, children)
  })
  const branches: Branch[] = rootChildren.length
    ? rootChildren.map((child, index) => ({ name: child.name, rootId: child.id, tone: index % 2 === 0 ? 'green' : 'amber' }))
    : sampleBranches

  const hasRealTree = Boolean(rootMember && rootChildren.length)

  return (
    <div className="relative overflow-hidden bg-[#09110e] text-ivory">
      <div className="relative px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 border-b border-gold/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">Family archive</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold uppercase tracking-[0.08em] text-gold sm:text-3xl">{villageName}</h2>
            </div>
            <span className="w-fit border border-gold/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              {hasRealTree ? 'Community record' : 'Sample layout'}
            </span>
          </div>

          <div className="relative mt-10">
            <div className="mx-auto w-full max-w-sm border border-gold/60 bg-ink/85 px-5 py-6 text-center shadow-[0_16px_50px_rgba(0,0,0,0.28)] sm:px-8">
              <Users className="mx-auto h-8 w-8 text-gold/85" strokeWidth={1.4} aria-hidden="true" />
              <p className="mt-3 font-heading text-xl text-ivory sm:text-2xl">{rootName || 'Original Ancestor'}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-gold/75">Original ancestor</p>
            </div>

            <div className="relative mx-auto mt-8 max-w-7xl pt-5">
              <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-gold/65" aria-hidden="true" />
              <div className="absolute left-[calc(25%-3px)] right-[calc(25%-3px)] top-0 h-px bg-gold/65 sm:left-[calc(25%-6px)] sm:right-[calc(25%-6px)]" aria-hidden="true" />
              <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 grid-cols-2">
                {branches.map((branch) => {
                  const branchMember = branch.rootId ? memberById.get(branch.rootId) : undefined
                  const branchChildren = branch.rootId ? childrenByParent.get(branch.rootId) || [] : []
                  return (
                    <div key={branch.name} className="relative flex min-w-0 flex-col items-center">
                      <div className="absolute left-1/2 top-[-1.25rem] h-5 w-px -translate-x-1/2 bg-gold/65" aria-hidden="true" />
                      <div className={`flex min-h-28 w-full flex-col items-center justify-center border px-3 py-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)] sm:min-h-36 sm:px-5 sm:py-6 ${toneClasses[branch.tone]}`}>
                        <Leaf className="h-6 w-6 text-gold/85 sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                        <p className="mt-2 font-heading text-sm text-ivory sm:mt-3 sm:text-xl">{branch.name}</p>
                        {branch.rootId ? <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gold/70">Direct descendant</p> : null}
                        {branch.families && branch.members ? <p className="mt-2 text-xs text-ivory/65">{branch.families} families · {branch.members} members</p> : null}
                      </div>

                      {branchMember && branchChildren.length ? (
                        <div className="relative mx-auto mt-1 w-full max-w-lg">
                          <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-gold/50" aria-hidden="true" />
                          {branchChildren.length > 1 ? <span className="absolute left-[calc(25%-2px)] right-[calc(25%-2px)] top-0 h-px bg-gold/50 sm:left-[calc(25%-5px)] sm:right-[calc(25%-5px)]" aria-hidden="true" /> : null}
                          <div className={`grid gap-2 sm:gap-5 ${branchChildren.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {branchChildren
                              .map((id) => memberById.get(id))
                              .filter((member): member is FamilyMember => Boolean(member))
                              .map((member) => (
                                <div key={member.id} className="relative pt-5">
                                  <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-gold/50" aria-hidden="true" />
                                  <MemberTree member={member} tone={branch.tone} childrenByParent={childrenByParent} memberById={memberById} />
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
