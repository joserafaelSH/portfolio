import { useEffect, useRef } from 'react'
import type { OutputBlock } from '@/commands'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArticleEntryBlock } from './blocks/ArticleEntryBlock'
import { CommandEchoBlock } from './blocks/CommandEchoBlock'
import { ListingBlock } from './blocks/ListingBlock'
import { MarkdownBlock } from './blocks/MarkdownBlock'
import { MediaBlock } from './blocks/MediaBlock'
import { ProjectCardBlock } from './blocks/ProjectCardBlock'
import { TextBlock } from './blocks/TextBlock'

interface ScrollbackProps {
  blocks: OutputBlock[]
  onRun: (command: string) => void
}

export function Scrollback({ blocks, onRun }: ScrollbackProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [blocks])

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-2">
        {blocks.map((block) => {
          switch (block.type) {
            case 'command-echo':
              return <CommandEchoBlock key={block.id} text={block.text} />
            case 'text':
              return <TextBlock key={block.id} text={block.text} />
            case 'error':
              return <TextBlock key={block.id} text={block.text} variant="error" />
            case 'markdown':
              return <MarkdownBlock key={block.id} html={block.html} />
            case 'listing':
              return <ListingBlock key={block.id} entries={block.entries} onRun={onRun} />
            case 'project-card':
              return (
                <ProjectCardBlock
                  key={block.id}
                  title={block.title}
                  category={block.category}
                  slug={block.slug}
                  link={block.link}
                  onRun={onRun}
                />
              )
            case 'article-entry':
              return (
                <ArticleEntryBlock
                  key={block.id}
                  title={block.title}
                  date={block.date}
                  tags={block.tags}
                  slug={block.slug}
                  onRun={onRun}
                />
              )
            case 'media':
              return (
                <MediaBlock key={block.id} mediaKind={block.mediaKind} url={block.url} name={block.name} />
              )
            default:
              return null
          }
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
