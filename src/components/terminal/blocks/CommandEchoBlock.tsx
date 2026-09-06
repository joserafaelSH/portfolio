interface CommandEchoBlockProps {
  text: string
}

export function CommandEchoBlock({ text }: CommandEchoBlockProps) {
  return (
    <p className="whitespace-pre-wrap break-words">
      <span className="text-term-prompt">$</span> {text}
    </p>
  )
}
