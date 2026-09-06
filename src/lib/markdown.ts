import DOMPurify from 'dompurify'
import bash from 'highlight.js/lib/languages/bash'
import go from 'highlight.js/lib/languages/go'
import typescript from 'highlight.js/lib/languages/typescript'
import yaml from 'highlight.js/lib/languages/yaml'
import hljs from 'highlight.js/lib/core'
import MarkdownIt from 'markdown-it'
import type { Document } from '@/vfs/types'

hljs.registerLanguage('go', go)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch {
        // fall through to auto-detect below
      }
    }
    try {
      return hljs.highlightAuto(code).value
    } catch {
      return ''
    }
  },
})

function normalizeRelativeSrc(src: string): string {
  return src.startsWith('./') ? src.slice(2) : src
}

/**
 * markdown-it has no build-time awareness of Vite's asset graph, so relative
 * `src="./images/x.png"` references from authored markdown are rewritten
 * post-render to the Document's already-resolved built asset URLs.
 */
export function rewriteRelativeAssetUrls(html: string, assets: Document['assets']): string {
  return html.replace(/\bsrc="([^"]+)"/g, (match, src: string) => {
    if (/^([a-z]+:)?\/\//i.test(src) || src.startsWith('data:')) return match
    const key = normalizeRelativeSrc(src)
    const resolved = assets.images[key] ?? assets.video[key]
    return resolved ? `src="${resolved}"` : match
  })
}

export function renderMarkdown(doc: Document): string {
  const rawHtml = md.render(doc.body)
  const rewritten = rewriteRelativeAssetUrls(rawHtml, doc.assets)
  return DOMPurify.sanitize(rewritten, { ADD_ATTR: ['target'] })
}
