#!/usr/bin/env node
// Takes a full pg_dump backup of a database before running a migration against it.
//
// Why this exists: a migration that adds `localized: true` to existing fields
// (or any migration Payload/Drizzle auto-generates) can include a DROP COLUMN
// with no data backfill — Payload's migration generator does not guarantee old
// values get copied into the new schema. This happened for real on 2026-09-09
// (village names, About Us text, committee member names, etc. were dropped by
// the multilingual-content migration with no backfill). A pre-migration backup
// is the only reliable safety net against this class of bug — always run this
// before `payload migrate` / `pnpm run ci` against a database with real
// content, no exceptions, even for a migration that "looks" purely additive.
//
// Usage:
//   node scripts/backup-db.mjs                  # backs up $DATABASE_URL
//   node scripts/backup-db.mjs "postgresql://…"  # backs up an explicit URL

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, globSync } from 'node:fs'
import { join } from 'node:path'

const databaseUrl = process.argv[2] || process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('Usage: node scripts/backup-db.mjs [DATABASE_URL]')
  console.error('(or set DATABASE_URL in the environment)')
  process.exit(1)
}

function findPgDump() {
  const candidates = [
    'pg_dump', // on PATH
    ...globSync('C:/Program Files/PostgreSQL/*/bin/pg_dump.exe'),
    ...globSync('/usr/lib/postgresql/*/bin/pg_dump'),
    '/usr/bin/pg_dump',
    '/opt/homebrew/bin/pg_dump',
  ]
  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ['--version'], { stdio: 'ignore' })
      return candidate
    } catch {
      // not found at this path, try the next
    }
  }
  return null
}

const pgDump = findPgDump()
if (!pgDump) {
  console.error(
    'Could not find pg_dump. Install PostgreSQL client tools, or run pg_dump manually.',
  )
  process.exit(1)
}

const backupDir = join(import.meta.dirname, '..', 'backups')
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outFile = join(backupDir, `backup_${timestamp}.dump`)

console.log(`Backing up database to ${outFile} ...`)
execFileSync(
  pgDump,
  ['--no-owner', '--no-privileges', '-Fc', '--dbname', databaseUrl, '-f', outFile],
  { stdio: 'inherit' },
)
console.log('Backup complete.')
console.log(
  `To restore: pg_restore --clean --if-exists --no-owner --no-privileges --dbname "<DATABASE_URL>" "${outFile}"`,
)
