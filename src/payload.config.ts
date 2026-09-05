import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Villages } from './collections/Villages'
import { FamilyMembers } from './collections/FamilyMembers'
import { FamilyRelationships } from './collections/FamilyRelationships'
import { Events } from './collections/Events'
import { News } from './collections/News'
import { GalleryItems } from './collections/GalleryItems'
import { CommitteeMembers } from './collections/CommitteeMembers'
import { Documents } from './collections/Documents'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { AuditLog } from './collections/AuditLog'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Rana Community Hub Admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/admin/FamilyTreeBuilderNavLink#FamilyTreeBuilderNavLink'],
      views: {
        familyTreeBuilder: {
          Component: '/components/admin/FamilyTreeBuilderView#FamilyTreeBuilderView',
          path: '/family-tree-builder',
          exact: true,
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Villages,
    FamilyMembers,
    FamilyRelationships,
    Events,
    News,
    GalleryItems,
    CommitteeMembers,
    Documents,
    ContactSubmissions,
    AuditLog,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
