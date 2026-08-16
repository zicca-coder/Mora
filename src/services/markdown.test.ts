import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '@/services/markdown'

describe('renderMarkdown', () => {
  it('renders configured Markdown features', () => {
    const html = renderMarkdown(`
## Heading

~~removed~~

- [x] Done

| Name | Status |
| --- | --- |
| Mora | Ready |
`)

    expect(html).toContain('<h2>Heading</h2>')
    expect(html).toContain('<s>removed</s>')
    expect(html).toContain('type="checkbox"')
    expect(html).toContain('<table>')
  })

  it('highlights known fenced code languages', () => {
    const html = renderMarkdown(`
\`\`\`ts
const name: string = 'Mora'
\`\`\`
`)

    expect(html).toContain('class="hljs language-ts"')
    expect(html).toContain('<span')
  })

  it('falls back safely for unknown fenced code languages', () => {
    expect(() =>
      renderMarkdown(`
\`\`\`unknown-language
hello <world>
\`\`\`
`)
    ).not.toThrow()

    const html = renderMarkdown(`
\`\`\`unknown-language
hello <world>
\`\`\`
`)

    expect(html).toContain('class="hljs"')
    expect(html).toContain('hello &lt;world&gt;')
  })

  it('does not emit executable raw HTML', () => {
    const html = renderMarkdown('<script>alert(1)</script><img src=x onerror=alert(1)>')

    expect(html).not.toContain('<script')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;script&gt;')
  })

  it('does not allow javascript links', () => {
    const html = renderMarkdown('[unsafe](javascript:alert(1))')

    expect(html).not.toContain('href="javascript:')
  })

  it('does not allow data links', () => {
    const html = renderMarkdown('[unsafe](data:text/html,<script>alert(1)</script>)')

    expect(html).not.toContain('href="data:')
  })
})
