import { beforeAll, describe, expect, it } from 'vitest'
import { parseInput } from './parser'
import { getCommand, listCommands } from './registry'
import type { CommandContext } from './types'

const ctx: CommandContext = { cwd: '/', navigate: () => {}, setCwd: () => {} }

beforeAll(async () => {
  await import('./index')
})

describe('command registry', () => {
  it('registers exactly the final v1 command list', () => {
    const names = listCommands()
      .map((c) => c.name)
      .sort()
    expect(names).toEqual(['about', 'cat', 'cd', 'clear', 'help', 'ls', 'projects', 'resume', 'whoami'].sort())
  })

  it('does not register a "blog" alias or removed commands', () => {
    expect(getCommand('blog')).toBeUndefined()
    expect(getCommand('theme')).toBeUndefined()
    expect(getCommand('stats')).toBeUndefined()
    expect(getCommand('curl')).toBeUndefined()
    expect(getCommand('articles')).toBeUndefined()
  })

  it('runs a command handler directly against a parsed input', () => {
    const ls = getCommand('ls')
    expect(ls).toBeDefined()
    const result = ls!.run(parseInput('ls /projects'), ctx)
    expect(result.blocks.length).toBeGreaterThan(0)
  })

  it('help lists every registered command with its usage string', () => {
    const help = getCommand('help')!
    const result = help.run(parseInput('help'), ctx)
    const text = result.blocks.map((b) => ('text' in b ? b.text : '')).join('\n')
    expect(text).toContain('projects [--category <name>]')
    expect(text).toContain('cat <path>')
  })

  it('clear returns an empty block list', () => {
    const clear = getCommand('clear')!
    expect(clear.run(parseInput('clear'), ctx).blocks).toEqual([])
  })
})
