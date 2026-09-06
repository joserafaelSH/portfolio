import { useState } from 'react'
import { ChevronDown, ChevronRight, Terminal as TerminalIcon } from 'lucide-react'
import { listCommands } from '@/commands'
import { cn } from '@/lib/utils'

interface HelpPanelProps {
  onRun: (command: string) => void
}

export function HelpPanel({ onRun }: HelpPanelProps) {
  const commands = listCommands().sort((a, b) => a.name.localeCompare(b.name))
  const [open, setOpen] = useState(true)

  return (
    <div className="flex max-h-72 shrink-0 flex-col border-t border-term-fg/10 text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 text-term-muted hover:text-term-fg"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="font-semibold tracking-wide">commands</span>
      </button>

      {open && (
        <ul className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-2">
          {commands.map((cmd) => (
            <li key={cmd.name}>
              <button
                type="button"
                onClick={() => onRun(cmd.name)}
                className={cn(
                  'term-clickable flex w-full items-start gap-1.5 py-0.5 text-left',
                  'decoration-transparent hover:decoration-dotted',
                )}
                title={cmd.description}
              >
                <TerminalIcon size={12} className="mt-0.5 shrink-0 text-term-muted" />
                <span className="flex min-w-0 flex-col">
                  <span className="break-words">{cmd.usage}</span>
                  <span className="break-words text-xs text-term-muted no-underline">{cmd.summary}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
