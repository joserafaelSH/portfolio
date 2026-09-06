import type { ParsedInput } from './types'

function matchSlug(pattern: RegExp, value: string): string | undefined {
  return pattern.exec(value)?.[1]
}

/**
 * Pure command <-> URL mapping, shared by commands (for ctx.navigate calls)
 * and the router bootstrap effect (for reconstructing state from a URL).
 * Keeping both directions in one module is what stops them from drifting.
 *
 * v1 only deep-links the canonical destinations from the grilling session
 * (whoami/about/resume/projects) plus `cat` on a project's own directory.
 * Arbitrary `cd`/`ls` browsing does not sync to the URL — a deliberate
 * scope cut, not an oversight.
 */
export function commandToUrl(input: ParsedInput): string | undefined {
  switch (input.command) {
    case 'whoami':
      return '/'
    case 'about':
      return '/about'
    case 'resume':
      return '/resume'
    case 'projects': {
      const category = typeof input.flags.category === 'string' ? input.flags.category : undefined
      return category ? `/projects?category=${encodeURIComponent(category)}` : '/projects'
    }
    case 'cat': {
      const arg = input.args[0] ?? ''
      const projectSlug = matchSlug(/^\/projects\/([^/]+)$/, arg)
      return projectSlug ? `/projects/${encodeURIComponent(projectSlug)}` : undefined
    }
    default:
      return undefined
  }
}

export function urlToCommand(pathname: string, search: string): string {
  if (pathname === '/' || pathname === '') return 'help'
  if (pathname === '/about') return 'about'
  if (pathname === '/resume') return 'resume'

  if (pathname === '/projects') {
    const category = new URLSearchParams(search).get('category')
    return category ? `projects --category ${category}` : 'projects'
  }

  const projectSlug = matchSlug(/^\/projects\/([^/]+)$/, pathname)
  if (projectSlug) return `cat /projects/${projectSlug}`

  return 'help'
}
