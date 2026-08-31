import type { CollectionBeforeValidateHook, CollectionConfig, Payload } from 'payload'
import { APIError } from 'payload'

import { authenticated } from '../access/authenticated'
import { publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { withAuditLog } from '../hooks/auditLog'

const asId = (value: unknown): string | undefined => {
  if (!value) return undefined
  return typeof value === 'object' && value !== null && 'id' in value
    ? String((value as { id: unknown }).id)
    : String(value)
}

/** Is `candidateAncestorId` reachable by walking upward (parent-of-parent) from `personId`? */
async function isAncestor(
  payload: Payload,
  candidateAncestorId: string,
  personId: string,
): Promise<boolean> {
  const visited = new Set<string>()
  const frontier: string[] = [personId]

  while (frontier.length > 0) {
    const current = frontier.pop() as string
    if (visited.has(current)) continue
    visited.add(current)

    const { docs } = await payload.find({
      collection: 'family-relationships',
      where: {
        and: [{ relationshipType: { equals: 'parent-child' } }, { child: { equals: current } }],
      },
      limit: 100,
      depth: 0,
    })

    for (const rel of docs) {
      const parentId = asId(rel.parent)
      if (!parentId) continue
      if (parentId === candidateAncestorId) return true
      frontier.push(parentId)
    }
  }

  return false
}

const validateRelationship: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data) return data

  const relationshipType = data.relationshipType ?? originalDoc?.relationshipType

  if (relationshipType === 'parent-child') {
    const parentId = asId(data.parent ?? originalDoc?.parent)
    const childId = asId(data.child ?? originalDoc?.child)

    if (parentId && childId) {
      if (parentId === childId) {
        throw new APIError('A person cannot be their own parent.', 400)
      }

      if (await isAncestor(req.payload, childId, parentId)) {
        throw new APIError(
          'This would create a cycle: the selected child is already an ancestor of the selected parent.',
          400,
        )
      }

      const { docs: duplicates } = await req.payload.find({
        collection: 'family-relationships',
        where: {
          and: [
            { relationshipType: { equals: 'parent-child' } },
            { parent: { equals: parentId } },
            { child: { equals: childId } },
          ],
        },
        limit: 1,
        depth: 0,
      })

      const isSameDocument = operation === 'update' && duplicates[0]?.id === originalDoc?.id
      if (duplicates.length > 0 && !isSameDocument) {
        throw new APIError('This parent-child relationship already exists.', 400)
      }
    }
  }

  if (relationshipType === 'spouse') {
    const spouseAId = asId(data.spouseA ?? originalDoc?.spouseA)
    const spouseBId = asId(data.spouseB ?? originalDoc?.spouseB)

    if (spouseAId && spouseBId) {
      if (spouseAId === spouseBId) {
        throw new APIError('A person cannot be their own spouse.', 400)
      }

      const { docs: duplicates } = await req.payload.find({
        collection: 'family-relationships',
        where: {
          and: [
            { relationshipType: { equals: 'spouse' } },
            {
              or: [
                { and: [{ spouseA: { equals: spouseAId } }, { spouseB: { equals: spouseBId } }] },
                { and: [{ spouseA: { equals: spouseBId } }, { spouseB: { equals: spouseAId } }] },
              ],
            },
          ],
        },
        limit: 1,
        depth: 0,
      })

      const isSameDocument = operation === 'update' && duplicates[0]?.id === originalDoc?.id
      if (duplicates.length > 0 && !isSameDocument) {
        throw new APIError('This spouse relationship already exists.', 400)
      }
    }
  }

  return data
}

export const FamilyRelationships: CollectionConfig = {
  slug: 'family-relationships',
  admin: {
    useAsTitle: 'relationshipType',
    defaultColumns: ['relationshipType', 'parent', 'child', 'spouseA', 'spouseB', '_status'],
    description: 'Connects Family Members with parent-child or spouse relationships.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  hooks: {
    beforeValidate: [validateRelationship],
    ...withAuditLog('family-relationships', 'relationshipType'),
  },
  fields: [
    {
      name: 'relationshipType',
      type: 'select',
      required: true,
      options: [
        { label: 'Parent → Child', value: 'parent-child' },
        { label: 'Spouse', value: 'spouse' },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'family-members',
      admin: {
        condition: (data) => data?.relationshipType === 'parent-child',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.relationshipType === 'parent-child' && !value) {
          return 'Parent is required for a parent-child relationship.'
        }
        return true
      },
    },
    {
      name: 'child',
      type: 'relationship',
      relationTo: 'family-members',
      admin: {
        condition: (data) => data?.relationshipType === 'parent-child',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.relationshipType === 'parent-child' && !value) {
          return 'Child is required for a parent-child relationship.'
        }
        return true
      },
    },
    {
      name: 'spouseA',
      type: 'relationship',
      relationTo: 'family-members',
      label: 'Spouse',
      admin: {
        condition: (data) => data?.relationshipType === 'spouse',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.relationshipType === 'spouse' && !value) {
          return 'Both spouses are required for a spouse relationship.'
        }
        return true
      },
    },
    {
      name: 'spouseB',
      type: 'relationship',
      relationTo: 'family-members',
      label: 'Spouse',
      admin: {
        condition: (data) => data?.relationshipType === 'spouse',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.relationshipType === 'spouse' && !value) {
          return 'Both spouses are required for a spouse relationship.'
        }
        return true
      },
    },
  ],
}
