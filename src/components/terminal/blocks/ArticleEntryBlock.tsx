import { Badge } from '@/components/ui/badge'

interface ArticleEntryBlockProps {
  title: string
  date?: string
  tags: string[]
  slug: string
  onRun: (command: string) => void
}

export function ArticleEntryBlock({ title, date, tags, slug, onRun }: ArticleEntryBlockProps) {
  return (
    <button
      type="button"
      onClick={() => onRun(`articles ${slug}`)}
      className="term-clickable flex w-full flex-col items-start gap-1 py-1 text-left"
    >
      <span>
        {title}
        {date && <span className="ml-2 text-term-muted">{date}</span>}
      </span>
      {tags.length > 0 && (
        <span className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-term-fg/20 text-term-muted">
              {tag}
            </Badge>
          ))}
        </span>
      )}
    </button>
  )
}
