import { Fragment } from 'react'

interface TextBlockProps {
  text: string
  variant?: 'default' | 'error'
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g

function renderWithLinks(text: string) {
  return text.split(URL_PATTERN).map((segment, i) =>
    /^https?:\/\//.test(segment) ? (
      <a key={i} href={segment} target="_blank" rel="noreferrer" className="term-clickable">
        {segment}
      </a>
    ) : (
      <Fragment key={i}>{segment}</Fragment>
    ),
  )
}

export function TextBlock({ text, variant = 'default' }: TextBlockProps) {
  return (
    <p className={variant === 'error' ? 'whitespace-pre-wrap break-words text-term-error' : 'whitespace-pre-wrap break-words'}>
      {renderWithLinks(text)}
    </p>
  )
}
