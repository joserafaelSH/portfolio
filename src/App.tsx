import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/commands'
import { Terminal } from '@/components/terminal/Terminal'
import { HelpPanel } from '@/components/tree/HelpPanel'
import { ProjectsTree } from '@/components/tree/ProjectsTree'
import { ResumeLink } from '@/components/tree/ResumeLink'
import { useTerminalStore } from '@/state/terminalStore'

function App() {
  const submit = useTerminalStore((s) => s.submit)
  const navigate = useNavigate()
  const runFromTree = useCallback((raw: string) => submit(raw, { navigate }), [submit, navigate])

  return (
    <div className="flex h-svh overflow-clip">
      <div className="min-w-0 flex-1">
        <Terminal />
      </div>
      <aside className="hidden w-64 shrink-0 flex-col border-l border-term-fg/10 bg-term-bg/60 lg:flex">
        <ResumeLink />
        <ProjectsTree onRun={runFromTree} />
        <HelpPanel onRun={runFromTree} />
      </aside>
    </div>
  )
}

export default App
