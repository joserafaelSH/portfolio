interface TextBlockProps {
  text: string
  variant?: 'default' | 'error'
}

export function TextBlock({ text, variant = 'default' }: TextBlockProps) {
  return (
    <p className={variant === 'error' ? 'whitespace-pre-wrap break-words text-term-error' : 'whitespace-pre-wrap break-words'}>
      {text}
    </p>
  )
}
