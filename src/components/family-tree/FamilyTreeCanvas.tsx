'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Search } from 'lucide-react'

import type { PersonNodeData } from '@/lib/family-tree/buildTree'
import { PersonNode } from './PersonNode'
import { PersonProfileModal } from './PersonProfileModal'
import type { FamilyMember } from '@/payload-types'

const nodeTypes = { person: PersonNode }

export function FamilyTreeCanvas({
  members,
  nodes: initialNodes,
  edges: initialEdges,
}: {
  members: FamilyMember[]
  nodes: Node<PersonNodeData>[]
  edges: Edge[]
}) {
  return (
    <ReactFlowProvider>
      <FamilyTreeCanvasInner
        members={members}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </ReactFlowProvider>
  )
}

function FamilyTreeCanvasInner({
  members,
  initialNodes,
  initialEdges,
}: {
  members: FamilyMember[]
  initialNodes: Node<PersonNodeData>[]
  initialEdges: Edge[]
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [search, setSearch] = useState('')
  const { setCenter } = useReactFlow()

  const handleNodeClick: NodeMouseHandler<Node<PersonNodeData>> = useCallback((_event, node) => {
    setSelectedMember(node.data.member)
  }, [])

  const searchMatches = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return members.filter((m) => m.fullName.toLowerCase().includes(query)).slice(0, 8)
  }, [members, search])

  const focusOnMember = useCallback(
    (member: FamilyMember) => {
      const node = nodes.find((n) => n.id === String(member.id))
      if (node) {
        setCenter(node.position.x + 95, node.position.y + 50, { zoom: 1.1, duration: 500 })
      }
      setSelectedMember(member)
      setSearch('')
    },
    [nodes, setCenter],
  )

  return (
    <div className="relative">
      <div className="border-b border-gold/20 bg-ink-soft px-4 py-3">
        <div className="relative mx-auto max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold/70"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search family members by name…"
            className="w-full border border-gold/30 bg-ink-card py-2 pl-9 pr-3 text-sm text-gold placeholder:text-gold/70 focus:border-gold focus:outline-none"
          />
          {searchMatches.length > 0 ? (
            <ul className="absolute z-10 mt-1 w-full border border-gold/30 bg-ink-card shadow-elevated">
              {searchMatches.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => focusOnMember(m)}
                    className="block w-full px-3 py-2 text-left text-sm text-gold hover:bg-ink-soft"
                  >
                    {m.fullName}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="h-[65vh] w-full bg-ink sm:h-[70vh] md:h-[75vh]">
        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-gold/70">
            No published family members yet. The Super Admin can add people and relationships from
            the admin panel.
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#a07d4a" gap={24} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              className="hidden md:block"
              nodeColor="#c9a96e"
              maskColor="rgba(11,11,11,0.5)"
              bgColor="#1a1816"
            />
          </ReactFlow>
        )}
      </div>

      <PersonProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  )
}
