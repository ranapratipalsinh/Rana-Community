import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Audit Log Entry', plural: 'Audit Log' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['collectionSlug', 'operation', 'performedByEmail', 'createdAt'],
    description: 'Read-only record of administrative and genealogy changes. Written automatically.',
  },
  access: {
    // Only ever written by server-side hooks (overrideAccess: true) — never via the API directly.
    create: () => false,
    read: authenticated,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'collectionSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'operation',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
    },
    {
      name: 'performedByEmail',
      type: 'text',
    },
    {
      name: 'summary',
      type: 'text',
    },
  ],
}
