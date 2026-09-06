export interface ParsedInput {
  command: string
  args: string[]
  flags: Record<string, string | boolean>
}

export type OutputBlock =
  | { type: 'command-echo'; id: string; text: string }
  | { type: 'text'; id: string; text: string }
  | { type: 'error'; id: string; text: string }
  | { type: 'markdown'; id: string; html: string }
  | {
      type: 'listing'
      id: string
      entries: { name: string; path: string; kind: 'dir' | 'markdown' | 'binary' }[]
    }
  | {
      type: 'project-card'
      id: string
      title: string
      category: string
      slug: string
      link?: string
    }
  | { type: 'media'; id: string; mediaKind: 'pdf' | 'image' | 'video'; url: string; name: string }

export interface CommandContext {
  cwd: string
  /** Sync the current command to the URL. A no-op until routing is wired up. */
  navigate: (path: string) => void
  setCwd: (path: string) => void
}

export interface CommandResult {
  blocks: OutputBlock[]
  nextCwd?: string
  /** When true, this result replaces the whole scrollback instead of appending to it. */
  replace?: boolean
}

export type CommandHandler = (input: ParsedInput, ctx: CommandContext) => CommandResult

export interface Command {
  name: string
  summary: string
  usage: string
  /** Longer explanation shown by `help` — what it does and how to use it. */
  description: string
  run: CommandHandler
}
