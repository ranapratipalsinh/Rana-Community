type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }
type LexicalRoot = { root?: LexicalNode } | null | undefined

function extractText(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (!node.children) return ''
  return node.children.map(extractText).join(' ')
}

/** Flattens a Lexical richText field into plain text, for use as a meta description excerpt. */
export function richTextToPlainText(data: LexicalRoot, maxLength = 160): string {
  const text = extractText(data?.root).replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
