import type { OutputBlock } from './types'

export function textBlock(text: string): OutputBlock {
  return { type: 'text', id: crypto.randomUUID(), text }
}

export function errorBlock(text: string): OutputBlock {
  return { type: 'error', id: crypto.randomUUID(), text }
}
