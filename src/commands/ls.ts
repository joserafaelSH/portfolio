import { resolvePath } from '@/vfs/path'
import { getNode, listDir } from '@/vfs/tree'
import { errorBlock } from './blockHelpers'
import { registerCommand } from './registry'

registerCommand({
  name: 'ls',
  summary: 'List directory contents',
  usage: 'ls [path]',
  description: 'Lists files and folders in <path>, or the current directory if omitted. Example: ls /projects',
  run: (input, ctx) => {
    const target = resolvePath(ctx.cwd, input.args[0] ?? '')
    const node = getNode(target)
    const shown = input.args[0] ?? target

    if (!node) return { blocks: [errorBlock(`ls: ${shown}: no such file or directory`)] }
    if (node.type !== 'dir') return { blocks: [errorBlock(`ls: ${shown}: not a directory`)] }

    const entries = listDir(target) ?? []
    const listingEntries = entries.map(({ name, node: child }) => ({
      name,
      path: target === '/' ? `/${name}` : `${target}/${name}`,
      kind: child.type === 'dir' ? ('dir' as const) : child.kind,
    }))

    return { blocks: [{ type: 'listing', id: crypto.randomUUID(), entries: listingEntries }] }
  },
})
