import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, FolderGit2 } from 'lucide-react'
import { listDir, readFile } from '@/vfs/tree'
import { cn } from '@/lib/utils'

interface ProjectEntry {
  slug: string
  title: string
  category: string
}

interface ProjectsTreeProps {
  onRun: (command: string) => void
}

function useProjectEntries(): ProjectEntry[] {
  return useMemo(() => {
    const entries = listDir('/projects') ?? []
    const projects: ProjectEntry[] = []
    for (const { name } of entries) {
      const file = readFile(`/projects/${name}`)
      if (!file?.document) continue
      const fm = file.document.frontmatter
      projects.push({
        slug: name,
        title: typeof fm.title === 'string' ? fm.title : name,
        category: typeof fm.category === 'string' ? fm.category : 'uncategorized',
      })
    }
    return projects
  }, [])
}

export function ProjectsTree({ onRun }: ProjectsTreeProps) {
  const projects = useProjectEntries()
  const [open, setOpen] = useState(true)

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3 text-sm" aria-label="Projects">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 py-1 text-term-muted hover:text-term-fg"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="font-semibold tracking-wide">projects/</span>
      </button>

      {open && (
        <ul className="ml-4 flex flex-col gap-0.5 border-l border-term-fg/10 pl-3">
          {projects.length === 0 && <li className="text-term-muted">no projects found</li>}
          {projects.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                onClick={() => onRun(`cat /projects/${project.slug}`)}
                className={cn(
                  'term-clickable flex w-full items-start gap-1.5 py-0.5 text-left',
                  'decoration-transparent hover:decoration-dotted',
                )}
                title={`cat /projects/${project.slug}`}
              >
                <FolderGit2 size={14} className="mt-0.5 shrink-0 text-term-muted" />
                <span className="break-words">{project.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
