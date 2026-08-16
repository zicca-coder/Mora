# Mora Manual Smoke Test

Use this checklist for Electron behaviors that are not fully covered by unit tests. Run it from the project root:

```bash
pnpm dev
```

Recommended fixture:

```text
examples/showcase.md
```

## 1. Application Startup

- [ ] `pnpm dev` starts Mora without terminal errors.
- [ ] The main window opens with the Mora toolbar, editor, preview, and status bar visible.
- [ ] The initial window title is correct for an untitled saved document.

## 2. New Document

- [ ] Click New.
- [ ] The document content becomes empty.
- [ ] The title shows `Untitled`.
- [ ] The status bar shows `Saved`.
- [ ] The word and character counts update for an empty document.

## 3. Markdown Editing

- [ ] Type ordinary text.
- [ ] Type a heading.
- [ ] Type bold and italic text.
- [ ] Type ordered and unordered lists.
- [ ] Type a fenced code block.
- [ ] Type a table.
- [ ] Type a task list.
- [ ] Type a Markdown link.
- [ ] Type an image reference.
- [ ] Preview updates as the document changes.
- [ ] Dirty state changes to `Unsaved` after editing.

## 4. View Mode

- [ ] Editor mode shows only the editor.
- [ ] Preview mode shows only rendered Markdown.
- [ ] Split mode shows editor and preview side by side.
- [ ] Switching view modes does not change document content or dirty state.

## 5. Open

- [ ] Open a `.md` file.
- [ ] Open a `.markdown` file.
- [ ] The opened file content appears in the editor and preview.
- [ ] The title updates to the opened file name.
- [ ] The status bar shows `Saved` immediately after opening.

## 6. Save

- [ ] Edit a saved file.
- [ ] Press `Ctrl+S` on Windows/Linux or `Cmd+S` on macOS.
- [ ] Confirm the file content is written to disk.
- [ ] Edit again and click Save in the toolbar.
- [ ] Confirm the file content is written to disk.
- [ ] Dirty state clears after each successful save.

## 7. Save As

- [ ] Trigger Save As from the More menu.
- [ ] Save with a `.md` extension.
- [ ] Save with a `.markdown` extension if the current implementation allows it.
- [ ] Save without typing an extension and confirm `.md` is appended.
- [ ] Save with an unsupported extension and confirm the final behavior matches the current implementation.
- [ ] The document title and file path update after Save As.
- [ ] Dirty state clears after Save As.

## 8. Unsaved Changes

- [ ] With dirty content, click New and choose Cancel.
- [ ] Confirm the current draft remains unchanged.
- [ ] With dirty content, click New and choose Discard Changes.
- [ ] Confirm a clean empty untitled document is created.
- [ ] With dirty content, click Open and choose Cancel.
- [ ] Confirm the current draft remains unchanged.
- [ ] With dirty content, click Open and choose Discard Changes.
- [ ] Confirm the selected file opens.
- [ ] With dirty content, close the Electron window and choose Cancel.
- [ ] Confirm the window remains open.
- [ ] With dirty content, close the Electron window and choose Discard Changes.
- [ ] Confirm the window closes.

## 9. PDF Export

- [ ] Open `examples/showcase.md`.
- [ ] Edit the document without saving.
- [ ] Press `Ctrl+Shift+E` on Windows/Linux or `Cmd+Shift+E` on macOS.
- [ ] Confirm a PDF file is generated.
- [ ] Repeat export using More -> Export PDF.
- [ ] Confirm unsaved Markdown content appears in the PDF.
- [ ] Confirm export does not trigger Markdown Save.
- [ ] Confirm export does not clear dirty state.
- [ ] Confirm the PDF does not include Mora toolbar, editor, status bar, or window UI.
- [ ] Confirm the PDF is A4.
- [ ] Confirm the PDF has a white background.
- [ ] Confirm Chinese text renders.
- [ ] Confirm code blocks render and wrap acceptably.
- [ ] Confirm tables render and wrap acceptably.
- [ ] Confirm images render.
- [ ] Confirm a multi-page document paginates acceptably.

## 10. External Links

- [ ] Add or open a Markdown preview containing an `https://` link.
- [ ] Click the link.
- [ ] Confirm Mora does not navigate away from the editor window.
- [ ] Confirm the link opens in the system browser.
- [ ] Add or open a `mailto:` link and confirm it opens externally.

## 11. Keyboard Shortcuts

- [ ] `Ctrl/Cmd+N` triggers New.
- [ ] `Ctrl/Cmd+O` triggers Open.
- [ ] `Ctrl/Cmd+S` triggers Save.
- [ ] `Ctrl/Cmd+Shift+S` triggers Save As.
- [ ] `Ctrl/Cmd+Shift+E` triggers Export PDF.

## 12. Status Bar

- [ ] Status bar shows `Markdown`.
- [ ] Status bar shows `UTF-8`.
- [ ] Status bar switches between `Saved` and `Unsaved`.
- [ ] Word count updates while editing.
- [ ] Character count updates while editing.
- [ ] Cursor position updates while moving through the editor.
