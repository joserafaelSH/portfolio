import { useNavigate } from 'react-router-dom'
import { renderMarkdown } from '@/lib/markdown'
import { readFile } from '@/vfs/tree'
import { MarkdownBlock } from '../terminal/blocks/MarkdownBlock'

interface MobileProjectPageProps {
  slug: string
}

/** Full-screen, terminal-free view of a single project — the "new screen" a mobile tap loads. */
export function MobileProjectPage({ slug }: MobileProjectPageProps) {
  const navigate = useNavigate()
  const file = readFile(`/projects/${slug}`)

  return (
    <div className="min-h-svh bg-term-bg px-4 py-3 font-mono text-sm text-term-fg">
      <button type="button" onClick={() => navigate('/')} className="term-clickable mb-3 inline-block">
        ← back to projects
      </button>
      {file?.document ? (
        <MarkdownBlock html={renderMarkdown(file.document)} />
      ) : (
        <p className="text-term-error">Project not found.</p>
      )}
    </div>
  )
}
