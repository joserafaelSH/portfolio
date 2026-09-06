import { beforeAll, describe, expect, it, vi } from 'vitest'
import { parseInput } from './parser'
import { getCommand } from './registry'
import type { CommandContext } from './types'

beforeAll(async () => {
  await import('./index')
})

function makeCtx(cwd = '/') {
  const navigate = vi.fn<(path: string) => void>()
  const setCwd = vi.fn<(path: string) => void>()
  const ctx: CommandContext = { cwd, navigate, setCwd }
  return Object.assign(ctx, { navigate, setCwd })
}

function run(command: string, ctx: CommandContext) {
  const parsed = parseInput(command)
  return getCommand(parsed.command)!.run(parsed, ctx)
}

describe('ls', () => {
  it('lists the root directory', () => {
    const result = run('ls /', makeCtx())
    const listing = result.blocks[0]
    expect(listing.type).toBe('listing')
    if (listing.type !== 'listing') throw new Error('unreachable')
    const names = listing.entries.map((e) => e.name)
    expect(names).toEqual(expect.arrayContaining(['about.md', 'resume.pdf', 'projects', 'articles']))
  })

  it('errors on a nonexistent path', () => {
    const result = run('ls /nope', makeCtx())
    expect(result.blocks[0].type).toBe('error')
  })
})

describe('cd', () => {
  it('changes cwd on a valid directory', () => {
    const ctx = makeCtx()
    run('cd /projects', ctx)
    expect(ctx.setCwd).toHaveBeenCalledWith('/projects')
  })

  it('errors when the target is a file, not a directory', () => {
    const result = run('cd /resume.pdf', makeCtx())
    expect(result.blocks[0].type).toBe('error')
  })
})

describe('cat', () => {
  it('renders a project directory as markdown and navigates', () => {
    const ctx = makeCtx()
    const result = run('cat /projects/task-queue', ctx)
    expect(result.blocks[0].type).toBe('markdown')
    expect(ctx.navigate).toHaveBeenCalledWith('/projects/task-queue')
  })

  it('renders resume.pdf as a media block', () => {
    const result = run('cat /resume.pdf', makeCtx())
    expect(result.blocks[0]).toMatchObject({ type: 'media', mediaKind: 'pdf' })
  })

  it('errors on a directory with no index.md via cat on a bare dir like /projects', () => {
    const result = run('cat /projects', makeCtx())
    expect(result.blocks[0].type).toBe('error')
  })
})

describe('whoami', () => {
  it('renders the about.md summary plus contact info', () => {
    const result = run('whoami', makeCtx())
    const text = result.blocks.map((b) => ('text' in b ? b.text : '')).join('\n')
    expect(text).toContain('Backend engineer')
    expect(text).toContain('email')
  })
})

describe('about', () => {
  it('renders the full about.md body as markdown and navigates to /about', () => {
    const ctx = makeCtx()
    const result = run('about', ctx)
    expect(result.blocks[0].type).toBe('markdown')
    expect(ctx.navigate).toHaveBeenCalledWith('/about')
  })
})

describe('resume', () => {
  it('renders resume.pdf as media and navigates to /resume', () => {
    const ctx = makeCtx()
    const result = run('resume', ctx)
    expect(result.blocks[0]).toMatchObject({ type: 'media', mediaKind: 'pdf' })
    expect(ctx.navigate).toHaveBeenCalledWith('/resume')
  })
})

describe('projects', () => {
  it('lists all projects and navigates to /projects', () => {
    const ctx = makeCtx()
    const result = run('projects', ctx)
    expect(result.blocks.some((b) => b.type === 'project-card')).toBe(true)
    expect(ctx.navigate).toHaveBeenCalledWith('/projects')
  })

  it('filters by --category and navigates with the query param', () => {
    const ctx = makeCtx()
    const result = run('projects --category go', ctx)
    expect(result.blocks.every((b) => b.type === 'project-card')).toBe(true)
    expect(ctx.navigate).toHaveBeenCalledWith('/projects?category=go')
  })

  it('reports no matches for an unknown category', () => {
    const result = run('projects --category rust', makeCtx())
    expect(result.blocks[0]).toMatchObject({ type: 'text' })
  })
})

describe('articles', () => {
  it('lists all articles and navigates to /articles', () => {
    const ctx = makeCtx()
    const result = run('articles', ctx)
    expect(result.blocks.some((b) => b.type === 'article-entry')).toBe(true)
    expect(ctx.navigate).toHaveBeenCalledWith('/articles')
  })

  it('renders a single article by slug and navigates to its URL', () => {
    const ctx = makeCtx()
    const result = run('articles building-a-task-queue', ctx)
    expect(result.blocks[0].type).toBe('markdown')
    expect(ctx.navigate).toHaveBeenCalledWith('/articles/building-a-task-queue')
  })

  it('errors on an unknown slug', () => {
    const result = run('articles nonexistent', makeCtx())
    expect(result.blocks[0].type).toBe('error')
  })
})
