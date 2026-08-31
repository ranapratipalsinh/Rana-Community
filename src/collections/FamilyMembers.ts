import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedField } from '../access/authenticatedField'
import { publishedAndPublicOrAuthenticated } from '../access/publishedAndPublicOrAuthenticated'
import { withAuditLog } from '../hooks/auditLog'

export const FamilyMembers: CollectionConfig = {
  slug: 'family-members',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'village', 'generation', 'displayStatus', '_status'],
    description: 'People in a village family tree. Approve (publish) and mark "Public" before they appear on the site.',
  },
  access: {
    read: publishedAndPublicOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  hooks: withAuditLog('family-members', 'fullName'),
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'village',
      type: 'relationship',
      relationTo: 'villages',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Which village family tree this person belongs to.',
      },
    },
    {
      name: 'displayStatus',
      type: 'select',
      required: true,
      defaultValue: 'private',
      options: [
        { label: 'Private (hidden from public tree)', value: 'private' },
        { label: 'Public (shown on public tree, once published)', value: 'public' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'A person only appears on the public tree once they are both published AND marked Public.',
      },
    },
    {
      name: 'generation',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Generation number, starting at 1 for the founder/earliest ancestor.',
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'birthYear',
          type: 'number',
          admin: {
            description: 'Optional.',
            width: '50%',
          },
        },
        {
          name: 'deathYear',
          type: 'number',
          admin: {
            description: 'Optional. Leave blank if living.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'shortBiography',
      type: 'textarea',
    },
    {
      name: 'notes',
      type: 'textarea',
      access: {
        // Internal admin-only notes — never exposed to the public API, regardless of displayStatus.
        read: authenticatedField,
      },
      admin: {
        description: 'Internal notes for the Super Admin only — never shown publicly.',
      },
    },
  ],
}
