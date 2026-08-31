import type { Field } from 'payload'

/** Auto-generates a URL-safe slug from `name`/`title` (whichever the collection uses) when left blank. */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Used in the URL. Leave blank to auto-generate from ${sourceField}.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return value
        const source = data?.[sourceField] as string | undefined
        return source
          ? source
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : value
      },
    ],
  },
})
