import { Download, ExternalLink } from 'lucide-react'
import { getNode } from '@/vfs/tree'

export function ResumeLink() {
  const node = getNode('/resume.pdf')
  if (!node || node.type !== 'file' || !node.url) return null

  return (
    <div className="flex shrink-0 flex-col gap-1 border-b border-term-fg/10 px-3 py-2 text-sm">
      <span className="text-term-muted">resume.pdf</span>
      <span className="flex items-center gap-3">
        <a
          href={node.url}
          target="_blank"
          rel="noreferrer"
          className="term-clickable inline-flex items-center gap-1"
          title="Open resume in a new tab"
        >
          <ExternalLink size={14} />
          open
        </a>
        <a
          href={node.url}
          download="resume.pdf"
          className="term-clickable inline-flex items-center gap-1"
          title="Download resume"
        >
          <Download size={14} />
          download
        </a>
      </span>
    </div>
  )
}
