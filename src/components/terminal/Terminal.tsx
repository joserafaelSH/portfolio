import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { urlToCommand } from '@/commands/urlMap'
import { useTerminalStore } from '@/state/terminalStore'
import { InputLine } from './InputLine'
import { Scrollback } from './Scrollback'
import { WhoamiHeader } from './WhoamiHeader'

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
    <div className="flex h-full flex-col bg-term-bg font-mono text-sm text-term-fg">
      <WhoamiHeader />
      <Scrollback blocks={blocks} onRun={runCommand} />
      <InputLine onSubmit={runCommand} />
    </div>
  )
}
