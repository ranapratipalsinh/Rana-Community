import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/lib/utils'

export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data) return null

  return (
    <div
      className={cn(
        // Every prose element is gold, per the site-wide "all text is gold" direction —
        // override Tailwind Typography's dark-mode (prose-invert) color variables directly
        // rather than the per-element modifiers, so lists/blockquotes/captions are covered too.
        'prose prose-invert max-w-none font-body',
        '[--tw-prose-invert-body:var(--color-gold)]',
        '[--tw-prose-invert-headings:var(--color-gold)]',
        '[--tw-prose-invert-lead:var(--color-gold)]',
        '[--tw-prose-invert-links:var(--color-gold-light)]',
        '[--tw-prose-invert-bold:var(--color-gold)]',
        '[--tw-prose-invert-counters:var(--color-gold)]',
        '[--tw-prose-invert-bullets:var(--color-gold)]',
        '[--tw-prose-invert-quotes:var(--color-gold)]',
        '[--tw-prose-invert-quote-borders:var(--color-gold)]',
        '[--tw-prose-invert-captions:var(--color-gold)]',
        'prose-headings:font-heading prose-headings:tracking-wide',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
