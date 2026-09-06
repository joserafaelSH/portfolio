import { resolvePath } from '@/vfs/path'
import { getNode } from '@/vfs/tree'
import { errorBlock } from './blockHelpers'
import { registerCommand } from './registry'

registerCommand({
  name: 'cd',
  summary: 'Change the current directory',
  usage: 'cd <path>',
  description:
    'Changes the working directory. Accepts absolute paths (/projects), relative paths (../articles), and ~ for root. Example: cd /projects',
  run: (input, ctx) => {
    const target = resolvePath(ctx.cwd, input.args[0] ?? '~')
    const node = getNode(target)
    const shown = input.args[0] ?? '~'

    if (!node) return { blocks: [errorBlock(`cd: ${shown}: no such file or directory`)] }
    if (node.type !== 'dir') return { blocks: [errorBlock(`cd: ${shown}: not a directory`)] }

    ctx.setCwd(target)
    return { blocks: [] }
  },
})
