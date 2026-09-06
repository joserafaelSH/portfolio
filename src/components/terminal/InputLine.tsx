import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { listCommands } from '@/commands'
import { useTerminalStore } from '@/state/terminalStore'

interface InputLineProps {
  onSubmit: (raw: string) => void
}

export function InputLine({ onSubmit }: InputLineProps) {
  const history = useTerminalStore((s) => s.history)
  const cwd = useTerminalStore((s) => s.cwd)
  const [value, setValue] = useState('')
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the prompt feeling always-active, like a real terminal: refocus
  // whenever the window regains focus or the input loses it (e.g. after a
  // click on a scrollback link/button or a projects-tree entry), instead of
  // requiring the visitor to click the input bar first.
  useEffect(() => {
    function refocus() {
      inputRef.current?.focus()
    }
    window.addEventListener('focus', refocus)
    return () => window.removeEventListener('focus', refocus)
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (value.trim()) onSubmit(value)
      setValue('')
      setHistoryIndex(null)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setValue(history[nextIndex])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === null) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        setHistoryIndex(null)
        setValue('')
      } else {
        setHistoryIndex(nextIndex)
        setValue(history[nextIndex])
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const [first, ...rest] = value.split(' ')
      if (rest.length > 0 || !first) return
      const matches = listCommands()
        .map((c) => c.name)
        .filter((name) => name.startsWith(first))
      if (matches.length === 1) setValue(`${matches[0]} `)
    }
  }

  return (
    <div className="flex items-center gap-2 border-t border-term-fg/10 px-4 py-2">
      <span className="shrink-0 text-term-prompt">{cwd}$</span>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Deferred so whatever just took focus (a link, a tree button)
          // still receives its click before we steal focus back.
          window.setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className="flex-1 bg-transparent font-mono text-term-fg outline-none"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  )
}
