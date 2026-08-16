import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PDF_OPTIONS,
  defaultPdfPathForPayload,
  ensurePdfExtension,
  normalizePdfOptions,
  pdfFileNameFromMarkdownName
} from '../../electron/shared/pdf'

describe('PDF shared helpers', () => {
  it.each([
    ['README.md', 'README.pdf'],
    ['notes.markdown', 'notes.pdf'],
    ['abc.test.md', 'abc.test.pdf'],
    ['Untitled', 'Untitled.pdf'],
    ['README.md •', 'README.pdf'],
    ['existing.pdf', 'existing.pdf']
  ])('returns %s as %s', (input, expected) => {
    expect(pdfFileNameFromMarkdownName(input)).toBe(expected)
  })

  it('keeps existing PDF extensions and appends missing ones', () => {
    expect(ensurePdfExtension('E:\\notes\\README.pdf')).toBe('E:\\notes\\README.pdf')
    expect(ensurePdfExtension('E:\\notes\\README')).toBe('E:\\notes\\README.pdf')
  })

  it('defaults exported PDFs beside the source Markdown file', () => {
    expect(
      defaultPdfPathForPayload({
        defaultFileName: 'abc.test.md',
        sourceFilePath: 'E:\\notes\\abc.test.md'
      })
    ).toBe('E:\\notes\\abc.test.pdf')
  })

  it('normalizes partial PDF options', () => {
    expect(
      normalizePdfOptions({
        margins: {
          topMm: 12,
          bottomMm: 16,
          leftMm: 18,
          rightMm: 22
        }
      })
    ).toEqual({
      ...DEFAULT_PDF_OPTIONS,
      margins: {
        topMm: 12,
        bottomMm: 16,
        leftMm: 18,
        rightMm: 22
      }
    })
  })
})
