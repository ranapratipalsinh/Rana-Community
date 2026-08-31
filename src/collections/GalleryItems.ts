import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { publishedOrAuthenticated } from '../access/publishedOrAuthenticated'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: { singular: 'Gallery Item', plural: 'Gallery' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'village', '_status'],
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
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Photo', value: 'image' },
        { label: 'Video (embed link)', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.type === 'image' },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.type === 'image' && !value) return 'An image is required.'
        return true
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        condition: (data) => data?.type === 'video',
        description: 'YouTube/Vimeo link.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.type === 'video' && !value) return 'A video URL is required.'
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Events', value: 'events' },
        { label: 'Villages', value: 'villages' },
        { label: 'Community', value: 'community' },
        { label: 'Heritage', value: 'heritage' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'village',
      type: 'relationship',
      relationTo: 'villages',
      admin: { position: 'sidebar', description: 'Optional — for village-wise filtering.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
