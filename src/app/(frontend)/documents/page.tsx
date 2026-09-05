import { FileText } from 'lucide-react'

import { getPayloadClient } from '@/lib/payload'
import type { Document as DocType } from '@/payload-types'

export const metadata = {
  title: 'Documents — Rana Community Hub',
  description: 'Community forms, notices, rules and reports available for download.',
}

export const revalidate = 60

const CATEGORY_LABEL: Record<string, string> = {
  forms: 'Forms',
  notices: 'Notices',
  rules: 'Rules',
  reports: 'Reports',
  other: 'Other',
}

const CATEGORY_ORDER = ['forms', 'notices', 'rules', 'reports', 'other']

function formatSize(bytes?: number | null) {
  if (!bytes) return null
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DocumentsPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'documents',
    sort: 'title',
    limit: 200,
    overrideAccess: false,
  })
  const documents = docs as DocType[]

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: documents.filter((d) => d.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold uppercase tracking-[0.15em] text-gold">
        Documents
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gold/70">
        Community forms, notices, rules and reports.
      </p>

      <div className="mt-10 space-y-10">
        {byCategory.map((group) => (
          <div key={group.category}>
            <h2 className="text-xl font-semibold uppercase tracking-wide text-gold">
              {CATEGORY_LABEL[group.category]}
            </h2>
            <ul className="mt-3 divide-y divide-gold/10 border border-gold/20 bg-ink-card">
              {group.items.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-soft"
                  >
                    <FileText className="flex-shrink-0 text-gold" size={20} />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gold">{doc.title}</span>
                      {doc.description ? (
                        <span className="block text-xs text-gold/70">{doc.description}</span>
                      ) : null}
                    </span>
                    {formatSize(doc.filesize) ? (
                      <span className="flex-shrink-0 text-xs text-gold/70">
                        {formatSize(doc.filesize)}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {documents.length === 0 ? (
          <p className="text-center text-gold/70">
            No documents published yet. The Super Admin can upload forms, notices, rules and
            reports from the admin panel.
          </p>
        ) : null}
      </div>
    </section>
  )
}
