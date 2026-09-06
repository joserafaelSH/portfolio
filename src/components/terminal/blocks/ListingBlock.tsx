interface ListingEntry {
  name: string
  path: string
  kind: 'dir' | 'markdown' | 'binary'
}

interface ListingBlockProps {
  entries: ListingEntry[]
  onRun: (command: string) => void
}

export function ListingBlock({ entries, onRun }: ListingBlockProps) {
  if (entries.length === 0) {
    return <p className="text-term-muted">(empty directory)</p>
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 py-1">
      {entries.map((entry) => (
        <button
          key={entry.path}
          type="button"
          className="term-clickable text-left"
          onClick={() => onRun(entry.kind === 'dir' ? `cd ${entry.path}` : `cat ${entry.path}`)}
        >
          {entry.name}
          {entry.kind === 'dir' ? '/' : ''}
        </button>
      ))}
    </div>
  )
}
