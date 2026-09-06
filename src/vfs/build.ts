import type { Document, DirNode, FileNode } from './types'
import { parseFrontmatter } from './frontmatter'

const CONTENT_PREFIX = '../../content'

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  mp4: 'video/mp4',
  webm: 'video/webm',
}

function extOf(name: string): string {
  const idx = name.lastIndexOf('.')
  return idx === -1 ? '' : name.slice(idx + 1).toLowerCase()
}

function toVfsPath(globKey: string): string {
  const withoutPrefix = globKey.slice(CONTENT_PREFIX.length)
  return withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`
}

function dirnameOf(vfsPath: string): string {
  const segments = vfsPath.split('/').filter(Boolean)
  segments.pop()
  return segments.length ? `/${segments.join('/')}` : '/'
}

function ensureDir(root: DirNode, dirPath: string): DirNode {
  if (dirPath === '/') return root
  const segments = dirPath.split('/').filter(Boolean)
  let current = root
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const existing = current.children[segment]
    if (!existing || existing.type !== 'dir') {
      const created: DirNode = { type: 'dir', name: segment, path: currentPath, children: {} }
      current.children[segment] = created
      current = created
    } else {
      current = existing
    }
  }
  return current
}

function insertFile(root: DirNode, vfsPath: string, node: FileNode) {
  const dir = ensureDir(root, dirnameOf(vfsPath))
  dir.children[node.name] = node
}

function binaryFileNode(vfsPath: string, url: string): FileNode {
  const name = vfsPath.split('/').pop()!
  return {
    type: 'file',
    name,
    path: vfsPath,
    kind: 'binary',
    mime: MIME_BY_EXT[extOf(name)] ?? 'application/octet-stream',
    url,
  }
}

export function buildVfsTree(): DirNode {
  const markdownFiles = import.meta.glob('../../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const images = import.meta.glob('../../content/**/images/*.{png,jpg,jpeg,gif,svg,webp}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>

  const videos = import.meta.glob('../../content/**/video/*.{mp4,webm}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>

  const rootBinaries = import.meta.glob('../../content/*.pdf', {
    eager: true,
    import: 'default',
  }) as Record<string, string>

  const root: DirNode = { type: 'dir', name: '', path: '/', children: {} }

  const assetEntries = [
    ...Object.entries(images).map(([globKey, url]) => ({ globKey, url, kind: 'images' as const })),
    ...Object.entries(videos).map(([globKey, url]) => ({ globKey, url, kind: 'video' as const })),
  ]

  for (const { globKey, url } of assetEntries) {
    insertFile(root, toVfsPath(globKey), binaryFileNode(toVfsPath(globKey), url))
  }

  for (const [globKey, url] of Object.entries(rootBinaries)) {
    insertFile(root, toVfsPath(globKey), binaryFileNode(toVfsPath(globKey), url))
  }

  for (const [globKey, raw] of Object.entries(markdownFiles)) {
    const vfsPath = toVfsPath(globKey)
    const name = vfsPath.split('/').pop()!
    // Project/article docs live at index.md, identified by their containing
    // directory (so `cd`/`ls`/`cat` all target the same path). A standalone
    // file like about.md has no directory of its own — it IS the document.
    const docPath = name === 'index.md' ? dirnameOf(vfsPath) : vfsPath

    const { frontmatter, body } = parseFrontmatter(raw)

    const assets = { images: {} as Record<string, string>, video: {} as Record<string, string> }
    for (const { globKey: assetKey, url, kind } of assetEntries) {
      const assetPath = toVfsPath(assetKey)
      const prefix = `${docPath}/${kind}/`
      if (assetPath.startsWith(prefix)) {
        assets[kind][assetPath.slice(docPath.length + 1)] = url
      }
    }

    const document: Document = { path: docPath, frontmatter, body, assets }

    insertFile(root, vfsPath, {
      type: 'file',
      name,
      path: vfsPath,
      kind: 'markdown',
      mime: 'text/markdown',
      document,
    })
  }

  return root
}

export const vfsRoot: DirNode = buildVfsTree()
