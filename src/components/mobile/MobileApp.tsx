import { useLocation, useNavigate } from 'react-router-dom'
import { projectSlugFromPath } from '@/commands/urlMap'
import { WhoamiHeader } from '@/components/terminal/WhoamiHeader'
import { ProjectsTree } from '@/components/tree/ProjectsTree'
import { ResumeLink } from '@/components/tree/ResumeLink'
import { MobileProjectPage } from './MobileProjectPage'

/**
 * The mobile experience is not a shrunk-down terminal — there's no typing
 * on a phone, so there's no command dispatch or scrollback here. It's a
 * plain two-screen flow driven directly by the URL: a home list, and a
 * full-screen project view, navigated between via ordinary route pushes so
 * the browser's native back button works for free.
 */
export function MobileApp() {
  const location = useLocation()
  const slug = projectSlugFromPath(location.pathname)

  if (slug) return <MobileProjectPage slug={slug} />
  return <MobileHome />
}

function MobileHome() {
  const navigate = useNavigate()

  // ProjectsTree calls onRun with a "cat /projects/<slug>" string — the
  // terminal's dispatch format. There's no terminal on mobile, so just pull
  // the path back out of it and navigate there directly.
  const handleProjectRun = (command: string) => {
    const path = /^cat (\/projects\/.+)$/.exec(command)?.[1]
    if (path) navigate(path)
  }

  return (
    <div className="flex min-h-svh flex-col bg-term-bg font-mono text-sm text-term-fg">
      <WhoamiHeader />
      <ResumeLink />
      <ProjectsTree onRun={handleProjectRun} />
    </div>
  )
}
