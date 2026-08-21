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
- [ ] The main window opens with the Mora sidebar, tab bar, editor, preview, and status bar visible.
- [ ] The initial window title is correct for an untitled saved document.

## 2. Refined Mac Style UI

- [ ] 1366x768 layout has no severe overflow or overlapping controls.
- [ ] 1920x1080 layout keeps the document column readable instead of stretching endlessly.
- [ ] Sidebar feels quiet and light, with clear hover and selected states.
- [ ] Current file is visually selected without a dark blue selected row.
- [ ] Tab shell shows the active document title and dirty state clearly.
- [ ] Editor is the visual focus and does not feel like an IDE.
- [ ] Preview typography has comfortable H1, H2, paragraph, list, quote, and code block spacing.
- [ ] Blockquotes use a subtle left accent line and do not use a heavy background.
- [ ] Code blocks use a light background, border, rounded corners, and a language label when available.
- [ ] View mode segmented control is usable and does not collide with file actions.
- [ ] Status bar remains low-contrast and does not compete with the document.
- [ ] Hover, active, focus, selected, and disabled states are visually consistent.
- [ ] Windows native title bar controls still minimize, maximize/restore, and close normally.

## 3. New Document

- [ ] Click New.
- [ ] The document content becomes empty.
- [ ] The title shows `Untitled`.
- [ ] The status bar shows `Saved`.
- [ ] The word and character counts update for an empty document.

## 4. Markdown Editing

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

## 5. View Mode

- [ ] Editor mode shows only the editor.
- [ ] Preview mode shows only rendered Markdown.
- [ ] Split mode shows editor and preview side by side.
- [ ] Switching view modes does not change document content or dirty state.

## 6. Open

- [ ] Open a `.md` file.
- [ ] Open a `.markdown` file.
- [ ] The opened file content appears in the editor and preview.
- [ ] The title updates to the opened file name.
- [ ] The status bar shows `Saved` immediately after opening.

## 7. Save

- [ ] Edit a saved file.
- [ ] Press `Ctrl+S` on Windows/Linux or `Cmd+S` on macOS.
- [ ] Confirm the file content is written to disk.
- [ ] Edit again and click Save in the toolbar.
- [ ] Confirm the file content is written to disk.
- [ ] Dirty state clears after each successful save.

## 8. Save As

- [ ] Trigger Save As from the More menu.
- [ ] Save with a `.md` extension.
- [ ] Save with a `.markdown` extension if the current implementation allows it.
- [ ] Save without typing an extension and confirm `.md` is appended.
- [ ] Save with an unsupported extension and confirm the final behavior matches the current implementation.
- [ ] The document title and file path update after Save As.
- [ ] Dirty state clears after Save As.

## 9. Unsaved Changes

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

## 10. PDF Export

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

## 11. External Links

- [ ] Add or open a Markdown preview containing an `https://` link.
- [ ] Click the link.
- [ ] Confirm Mora does not navigate away from the editor window.
- [ ] Confirm the link opens in the system browser.
- [ ] Add or open a `mailto:` link and confirm it opens externally.

## 12. Keyboard Shortcuts

- [ ] `Ctrl/Cmd+N` triggers New.
- [ ] `Ctrl/Cmd+O` triggers Open.
- [ ] `Ctrl/Cmd+S` triggers Save.
- [ ] `Ctrl/Cmd+Shift+S` triggers Save As.
- [ ] `Ctrl/Cmd+Shift+E` triggers Export PDF.

## 13. Status Bar

- [ ] Status bar shows `Markdown`.
- [ ] Status bar shows `Local`.
- [ ] Status bar switches between `Saved` and `Unsaved`.
- [ ] Word count updates while editing.
- [ ] Reading time updates while editing.
- [ ] Character count updates while editing.
- [ ] Cursor position updates while moving through the editor.

## 14. Installed Windows Build

- [ ] Run `pnpm dist`.
- [ ] Confirm `dist/Mora-Setup-0.1.0.exe` exists.
- [ ] Install Mora from the setup executable.
- [ ] Launch Mora from the Start Menu.
- [ ] Confirm the app starts without `pnpm dev`.
- [ ] Confirm the main window is not blank.
- [ ] Create a Markdown document.
- [ ] Type Markdown content.
- [ ] Confirm Preview renders the Markdown.
- [ ] Open a local `.md` file.
- [ ] Modify the file and save it.
- [ ] Confirm Save As works.
- [ ] Confirm PDF Export works.
- [ ] Close Mora.
- [ ] Launch Mora again from the Start Menu.
- [ ] Confirm the installed app can be uninstalled from Windows.

## 15. Unpacked Windows Build

- [ ] Run `pnpm package`.
- [ ] Confirm `dist/win-unpacked/Mora.exe` exists.
- [ ] Launch `dist/win-unpacked/Mora.exe` directly.
- [ ] Confirm the app starts without `pnpm dev`.
- [ ] Confirm the main window is not blank.
- [ ] Confirm New, Open, editing, Save, Save As, Preview, and PDF Export work in the unpacked app.

## 16. Packaged PDF Export

- [ ] In the installed app, export a PDF from `examples/showcase.md`.
- [ ] In the unpacked app, export a PDF from `examples/showcase.md`.
- [ ] Confirm the PDF is not blank.
- [ ] Confirm print CSS is applied.
- [ ] Confirm Mora toolbar, editor, and status bar are not included in the PDF.
- [ ] Confirm Chinese text, code blocks, tables, and local images render acceptably.
