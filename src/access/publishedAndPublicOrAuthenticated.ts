import type { Access, Where } from 'payload'

/**
 * Family Members carry a privacy axis on top of draft/publish: a person can
 * be "published" (admin-reviewed) yet still marked private (BRD §7/§18 —
 * don't publish sensitive personal information without explicit approval).
 * Super Admin sees everyone; the public only sees published + public people.
 */
export const publishedAndPublicOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true

  const where: Where = {
    and: [{ _status: { equals: 'published' } }, { displayStatus: { equals: 'public' } }],
  }
  return where
}
