import { renderMarkdown } from '@/lib/markdown'
import { siteConfig } from '@/state/siteConfig'
import { readFile } from '@/vfs/tree'
import { errorBlock, textBlock } from './blockHelpers'
import { registerCommand } from './registry'
import type { OutputBlock } from './types'

registerCommand({
  name: 'about',
  summary: 'Longer bio and contact info',
  usage: 'about',
  description: 'Prints the full bio from about.md plus contact info. Example: about',
  run: (_input, ctx) => {
    const file = readFile('/about.md')
    if (!file?.document) return { blocks: [errorBlock('about: /about.md not found')] }

    ctx.navigate('/about')

    const blocks: OutputBlock[] = [
      { type: 'markdown', id: crypto.randomUUID(), html: renderMarkdown(file.document) },
      textBlock(''),
      textBlock(`email    ${siteConfig.email}`),
      textBlock(`linkedin ${siteConfig.linkedin}`),
      textBlock(`github   ${siteConfig.github}`),
    ]
    return { blocks }
  },
})
