export type Frontmatter = Record<string, string | string[] | undefined>

export interface Document {
  /** Absolute VFS path this document lives at, e.g. "/projects/task-queue" */
  path: string
  frontmatter: Frontmatter
  /** Raw markdown body, not yet rendered to HTML. */
  body: string
  assets: {
    images: Record<string, string>
    video: Record<string, string>
  }
}

export interface FileNode {
  type: 'file'
  name: string
  path: string
  kind: 'markdown' | 'binary'
  mime: string
  document?: Document
  /** Final built asset URL, present when kind === "binary". */
  url?: string
}

export interface DirNode {
  type: 'dir'
  name: string
  path: string
  children: Record<string, VfsNode>
}

export type VfsNode = FileNode | DirNode
