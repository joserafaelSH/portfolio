/**
 * Resolve a user-typed path against the current working directory.
 * "~" always means VFS root — there's only one user, no nested home dirs.
 */
export function resolvePath(cwd: string, input: string): string {
  if (!input || input === '~') return '/'

  const startsAbsolute = input.startsWith('/') || input.startsWith('~/')
  const base = startsAbsolute ? '/' : cwd
  const relativeInput = input.startsWith('~/') ? input.slice(2) : input

  const baseSegments = base.split('/').filter(Boolean)
  const inputSegments = relativeInput.split('/').filter(Boolean)

  const segments = startsAbsolute ? [] : [...baseSegments]

  for (const segment of inputSegments) {
    if (segment === '.') continue
    if (segment === '..') {
      segments.pop()
      continue
    }
    segments.push(segment)
  }

  return segments.length === 0 ? '/' : `/${segments.join('/')}`
}
