import { describe, expect, it } from 'vitest'
import { parseInput } from './parser'

describe('parseInput', () => {
  it('parses a bare command with no args', () => {
    expect(parseInput('help')).toEqual({ command: 'help', args: [], flags: {} })
  })

  it('parses positional args', () => {
    expect(parseInput('cd /projects')).toEqual({
      command: 'cd',
      args: ['/projects'],
      flags: {},
    })
  })

  it('parses a flag with a value', () => {
    expect(parseInput('projects --category go')).toEqual({
      command: 'projects',
      args: [],
      flags: { category: 'go' },
    })
  })

  it('parses a boolean flag with no trailing value', () => {
    expect(parseInput('ls --all')).toEqual({
      command: 'ls',
      args: [],
      flags: { all: true },
    })
  })

  it('parses a flag followed by another flag as boolean', () => {
    expect(parseInput('projects --category --verbose')).toEqual({
      command: 'projects',
      args: [],
      flags: { category: true, verbose: true },
    })
  })

  it('mixes positional args and flags', () => {
    expect(parseInput('cat /projects/task-queue --format md')).toEqual({
      command: 'cat',
      args: ['/projects/task-queue'],
      flags: { format: 'md' },
    })
  })

  it('collapses repeated whitespace and trims the input', () => {
    expect(parseInput('  ls    /projects  ')).toEqual({
      command: 'ls',
      args: ['/projects'],
      flags: {},
    })
  })

  it('returns an empty command for blank input', () => {
    expect(parseInput('   ')).toEqual({ command: '', args: [], flags: {} })
  })
})
