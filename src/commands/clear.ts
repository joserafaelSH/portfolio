import { registerCommand } from './registry'

registerCommand({
  name: 'clear',
  summary: 'Clear the terminal scrollback',
  usage: 'clear',
  description: 'Clears everything below the pinned header, leaving a blank prompt. Example: clear',
  // The store special-cases `clear` to reset its blocks array to empty;
  // this handler just needs to exist so `clear` resolves as a known command.
  run: () => ({ blocks: [] }),
})
