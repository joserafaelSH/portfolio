import { renderMarkdown } from '@/lib/markdown'
import { resolvePath } from '@/vfs/path'
import { getNode, readFile } from '@/vfs/tree'
import { errorBlock } from './blockHelpers'
import { registerCommand } from './registry'
import { commandToUrl } from './urlMap'

function mediaKindFor(mime: string): 'pdf' | 'image' | 'video' | undefined {
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return undefined
}

registerCommand({
  name: 'cat',
  summary: 'Print a file, or preview a binary/media file',
  usage: 'cat <path>',
  description:
    'Prints a markdown file, or previews an image/video/PDF inline. Also works directly on a project or article directory. Example: cat /projects/task-queue',
  run: (input, ctx) => {
    const rawArg = input.args[0]
    if (!rawArg) return { blocks: [errorBlock('cat: missing operand')] }

    const target = resolvePath(ctx.cwd, rawArg)
    const file = readFile(target)

    if (!file) {
      const node = getNode(target)
      const message =
        node?.type === 'dir' ? `cat: ${rawArg}: is a directory` : `cat: ${rawArg}: no such file or directory`
      return { blocks: [errorBlock(message)] }
    }

    const url = commandToUrl(input)
    if (url) ctx.navigate(url)

    if (file.kind === 'markdown' && file.document) {
      return {
        blocks: [{ type: 'markdown', id: crypto.randomUUID(), html: renderMarkdown(file.document) }],
      }
    }

    if (file.kind === 'binary' && file.url) {
      const mediaKind = mediaKindFor(file.mime)
      if (mediaKind) {
        return {
          blocks: [{ type: 'media', id: crypto.randomUUID(), mediaKind, url: file.url, name: file.name }],
        }
      }
    }

    return { blocks: [errorBlock(`cat: ${rawArg}: cannot preview this file type`)] }
  },
})
