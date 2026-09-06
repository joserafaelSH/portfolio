interface MarkdownBlockProps {
  /** Already rendered + sanitized by lib/markdown.ts — safe to inject. */
  html: string
}

export function MarkdownBlock({ html }: MarkdownBlockProps) {
  return (
    <div
      className="prose-terminal max-w-none py-1 [&_a]:text-term-accent [&_a]:underline [&_a]:decoration-dotted [&_code]:text-term-warn [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_img]:my-2 [&_img]:max-w-full [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/40 [&_pre]:p-3"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
