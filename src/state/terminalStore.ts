import { create } from 'zustand'
import { getCommand, parseInput } from '@/commands'
import type { OutputBlock } from '@/commands'

interface SubmitOptions {
  navigate: (path: string) => void
}

interface TerminalState {
  cwd: string
  history: string[]
  blocks: OutputBlock[]
  /**
   * The single dispatch path: parse -> look up in the registry -> run.
   * The input box (on Enter) and every clickable output element both call
   * this exact function with a plain command string — there is no separate
   * click-handling code path.
   */
  submit: (raw: string, opts: SubmitOptions) => void
  clear: () => void
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  cwd: '/',
  history: [],
  blocks: [],
  submit: (raw, { navigate }) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const echo: OutputBlock = { type: 'command-echo', id: crypto.randomUUID(), text: trimmed }
    const parsed = parseInput(trimmed)
    const cmd = getCommand(parsed.command)

    const resultBlocks: OutputBlock[] = cmd
      ? cmd.run(parsed, {
          cwd: get().cwd,
          navigate,
          setCwd: (path) => set({ cwd: path }),
        }).blocks
      : [
          {
            type: 'error',
            id: crypto.randomUUID(),
            text: `command not found: ${parsed.command}`,
          },
        ]

    set((s) => ({
      history: [...s.history, trimmed],
      blocks: cmd?.name === 'clear' ? [] : [...s.blocks, echo, ...resultBlocks],
    }))
  },
  clear: () => set({ blocks: [] }),
}))
