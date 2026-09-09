import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { publishedOrAuthenticated } from '../access/publishedOrAuthenticated'
import { slugField } from '../fields/slugField'
import { withAuditLog } from '../hooks/auditLog'

export const Villages: CollectionConfig = {
  slug: 'villages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', '_status', 'updatedAt'],
    description:
      'One reusable template drives every village page — add all 9 Sayla State villages here.',
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
  hooks: withAuditLog('villages', 'name'),
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
    },
    slugField('name'),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Controls display order on the village listing page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this village in the Home page "Featured Village" section.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'Short summary shown on the village listing card.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'history',
      type: 'richText',
      localized: true,
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          localized: true,
        },
        {
          name: 'mapEmbedUrl',
          type: 'text',
          admin: {
            description: 'Google Maps embed URL (optional, can be added later).',
          },
        },
      ],
    },
    {
      name: 'importantPlaces',
      type: 'array',
      labels: {
        singular: 'Important Place',
        plural: 'Important Places',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'populationInfo',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Population / basic information, where available.',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
