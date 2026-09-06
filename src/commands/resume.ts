import { siteConfig } from '@/state/siteConfig'
import { getNode } from '@/vfs/tree'
import { errorBlock, textBlock } from './blockHelpers'
import { registerCommand } from './registry'
import type { OutputBlock } from './types'

registerCommand({
  name: 'resume',
  summary: 'Render/download resume and contact info',
  usage: 'resume',
  description:
    'Shows an inline preview of the resume PDF (with a link to open/download it) plus contact info. Example: resume',
  run: (_input, ctx) => {
    const node = getNode('/resume.pdf')
    if (!node || node.type !== 'file' || node.kind !== 'binary' || !node.url) {
      return { blocks: [errorBlock('resume: /resume.pdf not found')] }
    }

    ctx.navigate('/resume')

    const blocks: OutputBlock[] = [
      { type: 'media', id: crypto.randomUUID(), mediaKind: 'pdf', url: node.url, name: node.name },
      textBlock(''),
      textBlock(`email    ${siteConfig.email}`),
      textBlock(`linkedin ${siteConfig.linkedin}`),
      textBlock(`github   ${siteConfig.github}`),
    ]
    return { blocks }
  },
})
