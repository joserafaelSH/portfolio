import { siteConfig } from '@/state/siteConfig'
import { readFile } from '@/vfs/tree'
import { errorBlock, textBlock } from './blockHelpers'
import { registerCommand } from './registry'
import type { OutputBlock } from './types'

registerCommand({
  name: 'whoami',
  summary: 'Short identity blurb and contact info',
  usage: 'whoami',
  description:
    'Prints a one-line identity blurb plus contact info (email, LinkedIn, GitHub). Also pinned at the top of the page. Example: whoami',
  run: () => {
    const file = readFile('/about.md')
    const summary = file?.document?.frontmatter.summary

    if (!summary || typeof summary !== 'string') {
      return { blocks: [errorBlock('whoami: /about.md is missing a summary')] }
    }

    const blocks: OutputBlock[] = [
      textBlock(summary),
      textBlock(''),
      textBlock(`email    ${siteConfig.email}`),
      textBlock(`linkedin ${siteConfig.linkedin}`),
      textBlock(`github   ${siteConfig.github}`),
    ]
    return { blocks }
  },
})
