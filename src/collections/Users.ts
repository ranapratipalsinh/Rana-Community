import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/**
 * Phase 1 scope: Super Admin account(s) only (BRD v1.2 / SAD v1.1).
 * No public self-registration and no other admin roles — access is
 * restricted to already-authenticated users. Payload's admin panel
 * still allows creating the very first account when this collection
 * is empty, which is how the initial Super Admin gets created.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // BRD §18 / SAD §6 security hardening: lock out after repeated failed
    // logins, and only send auth cookies over HTTPS once actually deployed.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    },
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  versions: false,
}
