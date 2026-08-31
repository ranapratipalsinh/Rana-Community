import type { FieldAccess } from 'payload'

export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)
