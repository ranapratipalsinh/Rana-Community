import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { slugField } from '../fields/slugField'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News / Announcement', plural: 'News & Announcements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date', '_status'],
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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'community',
      options: [
        { label: 'Community Announcement', value: 'community' },
        { label: 'Village-Specific', value: 'village' },
        { label: 'Important Notice', value: 'notice' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'village',
      type: 'relationship',
      relationTo: 'villages',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'village',
        description: 'Required for village-specific announcements.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.type === 'village' && !value) {
          return 'Select a village for a village-specific announcement.'
        }
        return true
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional document attachment (PDF, etc).',
      },
    },
  ],
}
