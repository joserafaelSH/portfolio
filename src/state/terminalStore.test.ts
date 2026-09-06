import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@/commands'
import { useTerminalStore } from './terminalStore'

const navigate = vi.fn<(path: string) => void>()

beforeEach(() => {
  useTerminalStore.setState({ cwd: '/', history: [], blocks: [] })
  navigate.mockClear()
})

describe('terminalStore.submit', () => {
  it('appends each command onto the existing scrollback by default', () => {
    const { submit } = useTerminalStore.getState()
    submit('ls', { navigate })
    submit('ls /projects', { navigate })
    expect(useTerminalStore.getState().blocks.filter((b) => b.type === 'command-echo')).toHaveLength(2)
  })

  it('clear empties the scrollback outright', () => {
    const { submit, clear } = useTerminalStore.getState()
    submit('ls', { navigate })
    clear()
    expect(useTerminalStore.getState().blocks).toEqual([])
  })

  it('viewing a project replaces the scrollback instead of appending to it', () => {
    const { submit } = useTerminalStore.getState()
    submit('ls', { navigate })
    submit('cat /projects/task-queue', { navigate })
    const blocks = useTerminalStore.getState().blocks
    expect(blocks[0]).toMatchObject({ type: 'command-echo', text: 'cat /projects/task-queue' })
    expect(blocks.some((b) => b.type === 'markdown')).toBe(true)
  })
})
