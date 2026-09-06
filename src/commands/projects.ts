import { listDir, readFile } from '@/vfs/tree'
import { textBlock } from './blockHelpers'
import { registerCommand } from './registry'
import type { OutputBlock } from './types'
import { commandToUrl } from './urlMap'

registerCommand({
  name: 'projects',
  summary: 'List projects, optionally filtered by --category',
  usage: 'projects [--category <name>]',
  description:
    'Lists all projects as clickable cards (or filters to one category). Click a card, or an entry in the projects tree on the right, to open it. Example: projects --category go',
  run: (input, ctx) => {
    ctx.navigate(commandToUrl(input) ?? '/projects')

    const category = typeof input.flags.category === 'string' ? input.flags.category : undefined
    const entries = listDir('/projects') ?? []

    const cards: OutputBlock[] = []
    for (const { name } of entries) {
      const file = readFile(`/projects/${name}`)
      if (!file?.document) continue

      const fm = file.document.frontmatter
      const cardCategory = typeof fm.category === 'string' ? fm.category : 'uncategorized'
      if (category && cardCategory !== category) continue

      cards.push({
        type: 'project-card',
        id: crypto.randomUUID(),
        title: typeof fm.title === 'string' ? fm.title : name,
        category: cardCategory,
        slug: name,
        link: typeof fm.link === 'string' ? fm.link : undefined,
      })
    }

    if (cards.length === 0) {
      return {
        blocks: [textBlock(category ? `No projects tagged --category ${category}` : 'No projects found.')],
      }
    }

    return { blocks: cards }
  },
})
