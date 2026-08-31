import type { Access } from 'payload'

/**
 * Super Admin sees everything (including drafts awaiting approval);
 * public/unauthenticated requests only ever see published documents.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
