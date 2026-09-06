import { describe, expect, it } from 'vitest'
import { resolvePath } from './path'

describe('resolvePath', () => {
  it('resolves "~" and empty input to root', () => {
    expect(resolvePath('/projects', '~')).toBe('/')
    expect(resolvePath('/projects', '')).toBe('/')
  })

  it('resolves absolute paths independent of cwd', () => {
    expect(resolvePath('/nope', '/projects/task-queue')).toBe('/projects/task-queue')
  })

  it('resolves relative paths against cwd', () => {
    expect(resolvePath('/projects', 'task-queue')).toBe('/projects/task-queue')
  })

  it('resolves ".." to the parent, clamped at root', () => {
    expect(resolvePath('/projects/task-queue', '..')).toBe('/projects')
    expect(resolvePath('/', '..')).toBe('/')
  })

  it('resolves "~/" prefixed paths relative to root', () => {
    expect(resolvePath('/projects', '~/resume.pdf')).toBe('/resume.pdf')
  })

  it('handles "." as a no-op segment', () => {
    expect(resolvePath('/projects', './task-queue')).toBe('/projects/task-queue')
  })
})
