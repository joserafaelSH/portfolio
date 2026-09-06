import { describe, expect, it } from 'vitest'
import { getNode, listDir, readFile } from './tree'

describe('vfs tree', () => {
  it('builds the expected root layout', () => {
    const root = getNode('/')
    expect(root?.type).toBe('dir')

    const entries = listDir('/')?.map((e) => e.name)
    expect(entries).toEqual(expect.arrayContaining(['about.md', 'resume.pdf', 'projects', 'articles']))
  })

  it('resolves a project directory to its index.md document', () => {
    const file = readFile('/projects/task-queue')
    expect(file?.kind).toBe('markdown')
    expect(file?.document?.frontmatter.title).toBe('Distributed Task Queue in Go')
    expect(file?.document?.frontmatter.category).toBe('go')
  })

  it('resolves an article directory and parses its tags array', () => {
    const file = readFile('/articles/building-a-task-queue')
    expect(file?.document?.frontmatter.tags).toEqual(['go', 'concurrency', 'distributed-systems'])
  })

  it('resolves co-located image assets to built URLs', () => {
    const file = readFile('/projects/task-queue')
    expect(file?.document?.assets.images['images/cover.png']).toBeTruthy()
  })

  it('parses about.md as a standalone leaf document with a summary', () => {
    const file = readFile('/about.md')
    expect(file?.kind).toBe('markdown')
    expect(file?.document?.frontmatter.summary).toContain('Backend engineer')
  })

  it('exposes resume.pdf as a binary node', () => {
    const node = getNode('/resume.pdf')
    expect(node?.type).toBe('file')
    expect((node as { kind?: string })?.kind).toBe('binary')
    expect((node as { mime?: string })?.mime).toBe('application/pdf')
  })

  it('returns undefined for a nonexistent path', () => {
    expect(getNode('/nonexistent')).toBeUndefined()
  })
})
