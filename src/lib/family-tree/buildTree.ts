import dagre from '@dagrejs/dagre'
import type { Edge, Node } from '@xyflow/react'

import type { FamilyMember, FamilyRelationship } from '@/payload-types'

export type PersonNodeData = {
  member: FamilyMember
}

const NODE_WIDTH = 190
const NODE_HEIGHT = 100
const SPOUSE_GAP = 24

const asId = (value: number | FamilyMember | null | undefined): number | undefined => {
  if (value === null || value === undefined) return undefined
  return typeof value === 'object' ? value.id : value
}

/**
 * Lays out a village's family tree with dagre (top-down, generation by
 * generation) and returns React Flow nodes/edges.
 *
 * Spouse relationships are deliberately NOT added as dagre graph edges —
 * dagre's ranking algorithm doesn't support a "same rank" edge (a minlen of
 * 0 crashes it internally), so instead spouses are laid out purely by
 * parent-child edges and then snapped onto the same row as a post-pass,
 * placed right next to each other.
 *
 * Cross-village spouses won't get an edge here since only this village's
 * members are passed in — acceptable for Phase 2, revisit if that turns out
 * to matter in practice.
 */
export function buildFamilyTree(
  members: FamilyMember[],
  relationships: FamilyRelationship[],
): { nodes: Node<PersonNodeData>[]; edges: Edge[] } {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', nodesep: 32, ranksep: 80 })

  const memberIds = new Set(members.map((m) => m.id))
  members.forEach((member) => {
    graph.setNode(String(member.id), { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  const edges: Edge[] = []
  const spousePairs: Array<[number, number]> = []

  relationships.forEach((rel) => {
    if (rel.relationshipType === 'parent-child') {
      const parentId = asId(rel.parent)
      const childId = asId(rel.child)
      if (!parentId || !childId || !memberIds.has(parentId) || !memberIds.has(childId)) return

      graph.setEdge(String(parentId), String(childId))
      edges.push({
        id: `pc-${parentId}-${childId}`,
        source: String(parentId),
        target: String(childId),
        type: 'smoothstep',
        style: { stroke: '#c9a227', strokeWidth: 1.5 },
      })
    }

    if (rel.relationshipType === 'spouse') {
      const aId = asId(rel.spouseA)
      const bId = asId(rel.spouseB)
      if (!aId || !bId || !memberIds.has(aId) || !memberIds.has(bId)) return

      spousePairs.push([aId, bId])
      edges.push({
        id: `sp-${aId}-${bId}`,
        source: String(aId),
        target: String(bId),
        type: 'straight',
        style: { stroke: '#6b1f2a', strokeWidth: 1.5, strokeDasharray: '4 4' },
      })
    }
  })

  dagre.layout(graph)

  const positions = new Map<number, { x: number; y: number }>()
  members.forEach((member) => {
    const pos = graph.node(String(member.id))
    positions.set(member.id, { x: pos?.x ?? 0, y: pos?.y ?? 0 })
  })

  // Snap each spouse onto their partner's row, right next to them.
  spousePairs.forEach(([aId, bId]) => {
    const a = positions.get(aId)
    const b = positions.get(bId)
    if (!a || !b) return
    positions.set(bId, { x: a.x + NODE_WIDTH + SPOUSE_GAP, y: a.y })
  })

  const nodes: Node<PersonNodeData>[] = members.map((member) => {
    const pos = positions.get(member.id) ?? { x: 0, y: 0 }
    return {
      id: String(member.id),
      type: 'person',
      // dagre positions are node centers; React Flow wants the top-left corner.
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      data: { member },
    }
  })

  return { nodes, edges }
}
