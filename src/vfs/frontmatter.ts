import type { Frontmatter } from './types'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function stripQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, '')
}

/**
 * Hand-rolled frontmatter parser for the flat schema used by this site's
 * content (title, category, link, summary).
 * No nested objects or YAML anchors are needed, so a real YAML library
 * (and its Node/Buffer-polyfill baggage in a browser bundle) is overkill.
 * The only array field is `tags`, written inline: tags: [go, concurrency]
 */
export function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  const match = FRONTMATTER_RE.exec(raw)
  if (!match) return { frontmatter: {}, body: raw }

  const [, yamlBlock, body] = match
  const frontmatter: Frontmatter = {}

  for (const line of yamlBlock.split(/\r?\n/)) {
    if (!line.trim()) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue

    const key = line.slice(0, idx).trim()
    const rawValue = line.slice(idx + 1).trim()

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      frontmatter[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((s) => stripQuotes(s.trim()))
        .filter(Boolean)
    } else {
      frontmatter[key] = stripQuotes(rawValue)
    }
  }

  return { frontmatter, body: body.trim() }
}
