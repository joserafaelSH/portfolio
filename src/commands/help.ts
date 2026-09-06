import { textBlock } from './blockHelpers'
import { listCommands, registerCommand } from './registry'
import type { OutputBlock } from './types'

registerCommand({
  name: 'help',
  summary: 'List available commands',
  usage: 'help',
  description: 'Shows every command with what it does and an example. Run this any time you forget the syntax.',
  run: () => {
    const blocks: OutputBlock[] = []
    for (const cmd of listCommands().sort((a, b) => a.name.localeCompare(b.name))) {
      blocks.push(textBlock(`${cmd.usage.padEnd(28)} ${cmd.summary}`))
      blocks.push(textBlock(`  ${cmd.description}`))
      blocks.push(textBlock(''))
    }
    return { blocks }
  },
})
