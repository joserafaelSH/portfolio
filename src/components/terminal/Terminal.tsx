import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { urlToCommand } from '@/commands/urlMap'
import { useTerminalStore } from '@/state/terminalStore'
import { HelpPanel } from '../tree/HelpPanel'
import { ProjectsTree } from '../tree/ProjectsTree'
import { ResumeLink } from '../tree/ResumeLink'
import { InputLine } from './InputLine'
import { Scrollback } from './Scrollback'
import { WhoamiHeader } from './WhoamiHeader'

/** Only ever mounted at md and up — App renders MobileApp instead below that. */
export function Terminal() {
  const blocks = useTerminalStore((s) => s.blocks)
  const submit = useTerminalStore((s) => s.submit)
  const clear = useTerminalStore((s) => s.clear)
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()

  const runCommand = useCallback((raw: string) => submit(raw, { navigate }), [submit, navigate])

  useEffect(() => {
    // Our own commands call navigate() (a PUSH) after already appending their
    // blocks via submit() — reconstructing again here would duplicate them.
    // Only a POP navigation (first load, hard refresh, browser back/forward,
    // or an external link) should replay the URL as a fresh sole scrollback
    // entry, rather than a fabricated command history the visitor never typed.
    if (navigationType !== 'POP') return
    clear()
    // Pass a no-op navigate: we're already at this URL (it's what triggered
    // this reconstruction), so letting the replayed command call navigate()
    // again would push a redundant history entry — which, right after a
    // browser back(), clobbers the forward stack.
    submit(urlToCommand(location.pathname, location.search), { navigate: () => {} })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, navigationType])

  return (
    <div className="flex h-svh flex-col overflow-clip bg-term-bg font-mono text-sm text-term-fg">
      <WhoamiHeader />
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Scrollback blocks={blocks} onRun={runCommand} />
          <InputLine onSubmit={runCommand} />
        </div>
        <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-l border-term-fg/10 bg-term-bg/60">
          <ResumeLink />
          <ProjectsTree onRun={runCommand} />
          <HelpPanel onRun={runCommand} />
        </aside>
      </div>
    </div>
  )
}
