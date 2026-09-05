'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Background, Controls, ReactFlow, ReactFlowProvider, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { PersonNodeData } from '@/lib/family-tree/buildTree'
import { AdminPersonNode, type AdminPersonNodeData } from './AdminPersonNode'
import { AddRelativeModal } from './AddRelativeModal'
import type { FamilyMember } from '@/payload-types'

const nodeTypes = { person: AdminPersonNode }

export function AdminFamilyTreeCanvas({
  villageId,
  members,
  nodes: initialNodes,
  edges,
}: {
  villageId: number
  members: FamilyMember[]
  nodes: Node<PersonNodeData>[]
  edges: Edge[]
}) {
  return (
    <ReactFlowProvider>
      <AdminFamilyTreeCanvasInner
        villageId={villageId}
        members={members}
        initialNodes={initialNodes}
        edges={edges}
      />
    </ReactFlowProvider>
  )
}

function AdminFamilyTreeCanvasInner({
  villageId,
  members,
  initialNodes,
  edges,
}: {
  villageId: number
  members: FamilyMember[]
  initialNodes: Node<PersonNodeData>[]
  edges: Edge[]
}) {
  const router = useRouter()
  const [modal, setModal] = useState<{
    anchor: FamilyMember
    relationType: 'parent' | 'spouse' | 'child'
  } | null>(null)

  const nodes: Node<AdminPersonNodeData>[] = useMemo(
    () =>
      initialNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddRelative: (relationType: 'parent' | 'spouse' | 'child') =>
            setModal({ anchor: node.data.member, relationType }),
        },
      })),
    [initialNodes],
  )

  const handleCreated = useCallback(() => {
    setModal(null)
    router.refresh()
  }, [router])

  return (
    <div className="relative">
      <div className="h-[65vh] w-full bg-ink sm:h-[70vh] md:h-[75vh]">
        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-gold/70">
            No family members in this village yet.
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#a07d4a" gap={24} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        )}
      </div>

      {modal ? (
        <AddRelativeModal
          anchor={modal.anchor}
          relationType={modal.relationType}
          villageId={villageId}
          existingMembers={members}
          onClose={() => setModal(null)}
          onCreated={handleCreated}
        />
      ) : null}
    </div>
  )
}
