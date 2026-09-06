import { renderMarkdown } from '@/lib/markdown'
import { listDir, readFile } from '@/vfs/tree'
import { errorBlock, textBlock } from './blockHelpers'
import { registerCommand } from './registry'
import type { OutputBlock } from './types'
import { commandToUrl } from './urlMap'

registerCommand({
  name: 'articles',
  summary: 'List articles, or render one by slug',
  usage: 'articles [slug]',
  description:
    'Lists all articles, or renders one in full by slug. Click an entry to open it. Example: articles building-a-task-queue',
  run: (input, ctx) => {
    const slug = input.args[0]

    if (slug) {
      const file = readFile(`/articles/${slug}`)
      if (!file?.document) return { blocks: [errorBlock(`articles: no article named "${slug}"`)] }

      ctx.navigate(commandToUrl(input) ?? `/articles/${slug}`)
      return {
        blocks: [{ type: 'markdown', id: crypto.randomUUID(), html: renderMarkdown(file.document) }],
      }
    }

    ctx.navigate(commandToUrl(input) ?? '/articles')

    const entries = listDir('/articles') ?? []
    const items: OutputBlock[] = []
    for (const { name } of entries) {
      const file = readFile(`/articles/${name}`)
      if (!file?.document) continue

      const fm = file.document.frontmatter
      items.push({
        type: 'article-entry',
        id: crypto.randomUUID(),
        title: typeof fm.title === 'string' ? fm.title : name,
        date: typeof fm.date === 'string' ? fm.date : undefined,
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        slug: name,
      })
    }

    if (items.length === 0) return { blocks: [textBlock('No articles found.')] }
    return { blocks: items }
  },
})
