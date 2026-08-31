import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Writes an Audit Log entry for create/update/delete on the collection it's
 * attached to (BRD/SAD: "audit logging for important administrative and
 * genealogy changes where practical"). Best-effort — a logging failure must
 * never block the actual content operation.
 */
export function withAuditLog(collectionSlug: string, titleField: string) {
  const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
    if (operation !== 'create' && operation !== 'update') return doc

    try {
      await req.payload.create({
        collection: 'audit-log',
        data: {
          collectionSlug,
          documentId: String(doc.id),
          operation,
          performedByEmail: req.user?.email,
          summary: `${operation} on ${collectionSlug}: ${doc[titleField] ?? doc.id}`,
        },
        overrideAccess: true,
        req,
      })
    } catch (err) {
      req.payload.logger.error({ msg: 'Failed to write audit log entry', err })
    }

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    try {
      await req.payload.create({
        collection: 'audit-log',
        data: {
          collectionSlug,
          documentId: String(doc.id),
          operation: 'delete',
          performedByEmail: req.user?.email,
          summary: `delete on ${collectionSlug}: ${doc[titleField] ?? doc.id}`,
        },
        overrideAccess: true,
        req,
      })
    } catch (err) {
      req.payload.logger.error({ msg: 'Failed to write audit log entry', err })
    }

    return doc
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
