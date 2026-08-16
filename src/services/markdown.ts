import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import taskLists from 'markdown-it-task-lists'

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code: string, language: string): string {
    const normalizedLanguage = language.trim()

    if (normalizedLanguage && hljs.getLanguage(normalizedLanguage)) {
      const highlighted = hljs.highlight(code, {
        language: normalizedLanguage,
        ignoreIllegals: true
      }).value

      return `<pre><code class="hljs language-${escapeAttribute(normalizedLanguage)}">${highlighted}</code></pre>`
    }

    return `<pre><code class="hljs">${markdown.utils.escapeHtml(code)}</code></pre>`
  }
}).use(taskLists, {
  enabled: true,
  label: true
})

export function renderMarkdown(source: string): string {
  const html = markdown.render(source)
  return DOMPurify.sanitize(html, {
    USE_PROFILES: {
      html: true
    }
  })
}
