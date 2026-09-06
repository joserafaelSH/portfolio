import { getCommand, parseInput } from '@/commands'
import { TextBlock } from './blocks/TextBlock'

const NOOP_CTX = { cwd: '/', navigate: () => {}, setCwd: () => {} }

/**
 * Pinned identity strip, always visible above the scrollback. Reuses the
 * `whoami` command's own handler so this never drifts from what typing
 * `whoami` prints.
 */
export function WhoamiHeader() {
  const cmd = getCommand('whoami')
  if (!cmd) return null

  const { blocks } = cmd.run(parseInput('whoami'), NOOP_CTX)

  return (
    <div className="shrink-0 border-b border-term-fg/10 bg-term-bg px-4 py-3">
      {blocks.map((block) =>
        block.type === 'text' || block.type === 'error' ? (
          <TextBlock key={block.id} text={block.text} variant={block.type === 'error' ? 'error' : 'default'} />
        ) : null,
      )}
    </div>
  )
}
