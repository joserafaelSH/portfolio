import { Button } from '@/components/ui/button'

interface MediaBlockProps {
  mediaKind: 'pdf' | 'image' | 'video'
  url: string
  name: string
}

export function MediaBlock({ mediaKind, url, name }: MediaBlockProps) {
  return (
    <div className="my-1 flex max-w-lg flex-col gap-2">
      {mediaKind === 'pdf' && (
        <embed src={url} type="application/pdf" className="h-96 w-full rounded border border-term-fg/10" />
      )}
      {mediaKind === 'image' && (
        <img src={url} alt={name} className="max-w-full rounded border border-term-fg/10" />
      )}
      {mediaKind === 'video' && (
        <video src={url} controls className="max-w-full rounded border border-term-fg/10" />
      )}
      <Button asChild variant="outline" size="sm" className="w-fit border-term-accent/40 text-term-accent">
        <a href={url} download={name} target="_blank" rel="noreferrer">
          open / download {name}
        </a>
      </Button>
    </div>
  )
}
