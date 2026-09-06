import type { ParsedInput } from './types'

/**
 * Hand-written tokenizer: raw string -> { command, args, flags }.
 * Both the input box and every clickable output element funnel a plain
 * command string through this same function — there is no second parser.
 */
export function parseInput(raw: string): ParsedInput {
  const tokens = raw.trim().split(/\s+/).filter(Boolean)
  const command = tokens[0] ?? ''
  const args: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const next = tokens[i + 1]
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      args.push(token)
    }
  }

  return { command, args, flags }
}
