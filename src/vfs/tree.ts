import { vfsRoot } from './build'
import type { DirNode, FileNode, VfsNode } from './types'

export function getNode(path: string): VfsNode | undefined {
  if (path === '/') return vfsRoot
  const segments = path.split('/').filter(Boolean)
  let current: VfsNode = vfsRoot
  for (const segment of segments) {
    if (current.type !== 'dir') return undefined
    const next: VfsNode | undefined = current.children[segment]
    if (!next) return undefined
    current = next
  }
  return current
}

export interface ListEntry {
  name: string
  node: VfsNode
}

export function listDir(path: string): ListEntry[] | undefined {
  const node = getNode(path)
  if (!node || node.type !== 'dir') return undefined
  return Object.entries(node.children)
    .map(([name, child]) => ({ name, node: child }))
    .sort((a, b) => {
      if (a.node.type !== b.node.type) return a.node.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

/**
 * Resolve a path to a readable file. If the path is a directory containing
 * an index.md (a project/article's own directory), transparently reads
 * that instead — so `cat /projects/task-queue` and `cat
 * /projects/task-queue/index.md` both work, and commands like `articles
 * <slug>` can resolve against the directory path alone.
 */
export function readFile(path: string): FileNode | undefined {
  const node = getNode(path)
  if (!node) return undefined
  if (node.type === 'file') return node
  const indexDoc = (node as DirNode).children['index.md']
  return indexDoc && indexDoc.type === 'file' ? indexDoc : undefined
}
