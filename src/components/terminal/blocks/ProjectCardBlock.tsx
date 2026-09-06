import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ProjectCardBlockProps {
  title: string
  category: string
  slug: string
  link?: string
  onRun: (command: string) => void
}

export function ProjectCardBlock({ title, category, slug, link, onRun }: ProjectCardBlockProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onRun(`cat /projects/${slug}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onRun(`cat /projects/${slug}`)
      }}
      className="my-1 max-w-md cursor-pointer border-term-fg/10 bg-transparent transition-colors hover:bg-white/5"
    >
      <CardHeader>
        <CardTitle className="text-term-accent">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-term-muted">
          <Badge variant="outline" className="border-term-warn/40 text-term-warn">
            {category}
          </Badge>
          {link && <span className="truncate">{link}</span>}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
