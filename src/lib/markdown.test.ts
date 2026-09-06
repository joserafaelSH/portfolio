import { describe, expect, it } from 'vitest'
import { rewriteRelativeAssetUrls } from './markdown'

const assets = {
  images: { 'images/cover.png': 'https://cdn.example/cover-abc123.png' },
  video: { 'video/demo.mp4': 'https://cdn.example/demo-def456.mp4' },
}

describe('rewriteRelativeAssetUrls', () => {
  it('rewrites a "./images/x.png"-style relative src', () => {
    const html = '<img src="./images/cover.png" alt="cover">'
    expect(rewriteRelativeAssetUrls(html, assets)).toBe(
      '<img src="https://cdn.example/cover-abc123.png" alt="cover">',
    )
  })

  it('rewrites a bare "images/x.png"-style relative src (no leading ./)', () => {
    const html = '<video src="video/demo.mp4"></video>'
    expect(rewriteRelativeAssetUrls(html, assets)).toBe(
      '<video src="https://cdn.example/demo-def456.mp4"></video>',
    )
  })

  it('leaves absolute http(s) URLs untouched', () => {
    const html = '<img src="https://example.com/pic.png">'
    expect(rewriteRelativeAssetUrls(html, assets)).toBe(html)
  })

  it('leaves an unmatched relative reference untouched', () => {
    const html = '<img src="./images/missing.png">'
    expect(rewriteRelativeAssetUrls(html, assets)).toBe(html)
  })
})
