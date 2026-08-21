# Mora Agent HandOff

This file is the working context entry point for future coding agents. Read it before changing the project.

## 1. Project Overview

- Project name: Mora
- Positioning: a minimal, beautiful, local-first Markdown editor and reader.
- Current tech stack: Electron, Vue 3, TypeScript, Vite, Electron Vite, CodeMirror 6, markdown-it, highlight.js, DOMPurify, pnpm.
- Current project directory: `E:\projects\Mora`
- Current development stage: refined Mac-style desktop UI and Windows-native packaging verification completed. The NSIS installer now builds from the Windows checkout, and user manual testing confirmed the packaged PDF flow works.

## 2026-08-21 Packaging / Dialog Fix Status Note

Current objective:

- Fix the incomplete items called out in the handoff document without adding new product features.
- Validate Windows-native `pnpm dist`.
- Verify packaged/unpacked Save As and PDF Export dialog behavior.

Completed in this pass:

- Ran Windows-native `pnpm dist` from `E:\projects\Mora`; it completed successfully and generated:
  - `dist/win-unpacked/Mora.exe`
  - `dist/Mora-Setup-0.1.0.exe`
  - `dist/Mora-Setup-0.1.0.exe.blockmap`
- Fixed native save dialog defaults so unsaved documents use absolute default paths under the user's Documents folder instead of relative paths such as `Untitled.md` / `Untitled.pdf`.
- Normalized relative `sourceFilePath` values in the PDF export payload before deriving the PDF save default and local image base URL.
- Added local agent context files to `.prettierignore` so `pnpm format:check` is not affected by ignored handoff/response files.
- Verified the unpacked app starts from `dist/win-unpacked/Mora.exe`, loads `resources/app.asar/out/renderer/index.html`, exposes the typed `window.mora` bridge, renders the editor and preview, and can write a smoke Markdown file.
- User manually tested the fixed build and confirmed PDF export works.

Automated verification completed after this pass:

```bash
pnpm dist
.\node_modules\.bin\prettier.CMD . --check
.\node_modules\.bin\eslint.CMD . --max-warnings=0
.\node_modules\.bin\vitest.CMD run
.\node_modules\.bin\vue-tsc.CMD --noEmit
```

Results:

- `pnpm dist` passed on Windows and produced the NSIS installer.
- `prettier --check` passed.
- `eslint` passed.
- `vitest` passed: 4 files / 26 tests.
- `vue-tsc --noEmit` passed.

Notes:

- The existing `tmp/packaged-pdf-smoke.py` script can falsely report "Save dialog was not found" on Windows because Electron's native Save Dialog appears as a child `#32770` window under Mora rather than as a top-level window. Treat that as a smoke-script limitation, not a product failure, unless reproduced manually.

## 2026-08-20 Prompt 05 Status Note

Current objective:

- Keep Mora on the existing Electron Vite architecture.
- Make production load `out/renderer/index.html` instead of any Vite dev server.
- Provide clear `pnpm dev`, `pnpm build`, `pnpm package`, and `pnpm dist` commands.
- Use electron-builder + NSIS for Windows packaging.

Completed in this pass:

- `package.json` now includes `productName: "Mora"`.
- `package.json` scripts now use:
  - `pnpm dev` for development.
  - `pnpm build` for production Main/Preload/Renderer build.
  - `pnpm package` for `dist/win-unpacked/Mora.exe`.
  - `pnpm dist` for `dist/Mora-Setup-0.1.0.exe`.
- `electron-builder.yml` now outputs to `dist/`, keeps `asar: true`, uses NSIS, names the installer `Mora-Setup-${version}.exe`, and explicitly includes `node_modules/highlight.js/styles/github.css` for packaged PDF styling.
- Windows signing is disabled with `win.signExecutable: false` because code signing is explicitly out of scope for Prompt 05.
- Main process now only uses `ELECTRON_RENDERER_URL` when `!app.isPackaged`; packaged/production builds always load `../renderer/index.html`.
- `pnpm-workspace.yaml` now stores build-script approvals for both pnpm 11 (`allowBuilds`) and pnpm 10 (`onlyBuiltDependencies` / `ignoredBuiltDependencies`) because the project is developed across Windows and WSL.
- README and `docs/qa/manual-smoke-test.md` were updated for the new build/package/dist commands and Windows packaged QA checklist.

Verified in WSL:

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm test
pnpm typecheck
pnpm build
pnpm package
```

Results:

- `pnpm install` passes under WSL pnpm 11 after moving build-script approvals to `pnpm-workspace.yaml`.
- `pnpm lint` passed.
- `pnpm format:check` passed before the final HandOff edit; run it again before committing.
- `pnpm test` passed: 4 files / 26 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed and produced:
  - `out/main/index.js`
  - `out/preload/index.js`
  - `out/renderer/index.html`
- `pnpm package` passed and produced:
  - `dist/win-unpacked/Mora.exe`
  - `dist/win-unpacked/resources/app.asar`

Paused / not completed:

- `pnpm dist` is paused and should not be considered validated from the current WSL environment.
- On WSL, electron-builder reaches NSIS but fails because NSIS installer generation runs the temporary Windows installer to extract/sign the uninstaller, which requires Wine on non-Windows hosts.
- System Wine is missing in WSL: `wine: command not found`.
- electron-builder's beta bundled Wine toolset (`-c.toolsets.wine=1.0.1`) downloaded, but failed to start in this Ubuntu 26.04 WSL environment with:
  - `failed to load ... ntdll.dll error c0000135`
  - `run_wineboot failed to start wineboot 1`
- A Windows-native temporary copy was tried at:
  - `C:\Users\leeziqiang\AppData\Local\Temp\mora-package-20260820-165713`
- Windows `pnpm install` in that temp copy needed `pnpm rebuild` because Windows pnpm 10 ignored install scripts during the initial install. `pnpm rebuild` completed Electron/esbuild postinstall.
- Windows-native `pnpm dist` in the temp copy reached electron-builder but stayed without useful output for several minutes; per user instruction, it was stopped and left for later manual continuation on the real Windows project checkout.
- Any small `dist/Mora-Setup-0.1.0.exe` produced in WSL during failed attempts is incomplete and must not be used as a valid installer.

Recommended next action:

- Run the final installer build from the original Windows project checkout rather than WSL:

```bash
pnpm install
pnpm rebuild
pnpm dist
```

- Expected valid installer path after a successful Windows run:

```text
dist/Mora-Setup-0.1.0.exe
```

- Then run the installed-app checklist in `docs/qa/manual-smoke-test.md`, especially Start Menu launch, uninstall, and packaged PDF export.

## 2026-08-20 Refined Mac Style UI Status Note

Current objective:

- Make Mora feel like a calm, refined, modern desktop Markdown app.
- Keep the app local-first and document-focused.
- Preserve existing Markdown editing, preview, file operations, Save As, and PDF export behavior.
- Do not add unsupported product features such as multi-tab state, Recent, Starred, Focus Mode, tags, cloud sync, AI, or dark mode.

Completed in this pass:

- Added `src/components/AppSidebar.vue`.
- `src/App.vue` now uses a two-column desktop shell:
  - Left sidebar for real document actions and current-file context.
  - Right workbench for tab shell, editor, preview, and view modes.
  - Bottom status bar spanning the window.
- Kept the native Windows/Electron window frame. No fake macOS traffic-light buttons were added.
- Refactored `src/components/TitleBar.vue` into a restrained single-document tab shell with:
  - Active document tab.
  - Unsaved dot.
  - Real New/Open/Save/Save As/PDF Export actions.
  - Editor/Split/Preview segmented control.
- Refactored `src/components/StatusBar.vue` to show:
  - `Markdown`
  - `Local`
  - Saved/Unsaved
  - word count
  - estimated reading time
  - character count
  - line/column
- Added `@lucide/vue` as the single icon library for the new UI.
- Reworked `src/styles/tokens.css` around `--mora-*` design tokens for colors, typography, spacing, radii, shadows, layout sizes, and transitions, while keeping old token aliases for compatibility.
- Reworked `src/styles/app.css` for the refined app shell, sidebar, tab strip, segmented control, icon buttons, More menu, status bar, hover/focus/active/disabled states, and desktop breakpoints.
- Reworked `src/styles/markdown.css` for document-first Markdown typography:
  - Serif H1.
  - H2/H3 syntax accents.
  - comfortable paragraph/list spacing.
  - subtle blockquotes.
  - light code blocks with borders and language labels.
- Reworked `src/styles/codemirror.css` to make the editor feel more like a writing surface:
  - centered content width.
  - relaxed padding and line height.
  - hidden CodeMirror gutters by CSS.
  - subtle active line, selection, cursor, and tooltip styling.
- Updated `src/services/markdown.ts` so fenced code blocks expose a sanitized `data-language` attribute for UI/PDF code block labels.
- Updated `src/styles/print.css` so PDF export keeps code language labels without including Mora app chrome.
- Extended `docs/qa/manual-smoke-test.md` with a refined desktop UI QA checklist and updated the status bar expectations.

Automated verification completed after this pass:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Results:

- `pnpm format:check` passed.
- `pnpm lint` passed.
- `pnpm test` passed: 4 files / 26 tests.
- `pnpm typecheck` passed.
- `pnpm build` passed and produced Main, Preload, and Renderer production output under `out/`.

Manual / GUI verification status:

- Not completed in this WSL session.
- The final visual QA should be run from the Windows checkout or another environment that can launch the Electron GUI reliably.
- Use `docs/qa/manual-smoke-test.md`, especially the `Refined Mac Style UI`, core file operation, preview, and PDF export sections.

Not implemented by design in this UI pass:

- Real multi-tab document lifecycle.
- Recent files.
- Starred files.
- Full workspace file tree.
- Search backend.
- Focus Mode.
- Dark Mode.
- Custom frameless title bar.
- Fake macOS traffic-light controls.

## 2. Architecture

```text
Electron Main Process
        <-> controlled IPC
Preload
        <-> window.mora API
Vue Renderer
        |
        |-- CodeMirror Markdown editor
        |-- Markdown renderer service
        |-- Markdown preview
        |-- PDF export service
```

- `electron/main/index.ts`: owns native desktop setup and IPC registration. It creates the main `BrowserWindow`, handles file dialogs, UTF-8 file reads/writes, title updates, Save As path normalization, and external-link navigation hardening.
- `electron/main/pdf.ts`: owns PDF export in the Main process: default PDF options, Save Dialog, filename/path defaults, hidden print window, print-document HTML shell, print CSS loading, font/image readiness, `webContents.printToPDF()`, and PDF file writes.
- `electron/preload/index.ts`: exposes a small, typed `window.mora` bridge. It does not expose the raw `ipcRenderer`.
- `electron/shared/ipc.ts`: shared IPC payload/result types used by Main, Preload, and Renderer, including PDF export types.
- `src/`: Vue renderer application. It must not directly use Node.js APIs such as `fs`.
- `src/services/markdown.ts`: owns markdown-it setup, highlight.js integration, and DOMPurify sanitization.
- `src/services/pdf.ts`: renderer-side PDF helper. It renders the current in-memory Markdown with the existing Markdown renderer and calls the typed preload API.
- `src/services/documentModel.ts`: pure document state helpers for initial state, saved document application, content changes, dirty calculation, title formatting, and document stats.
- `src/composables/useMarkdownDocument.ts`: owns the active document state, dirty tracking, file actions, PDF export state, view mode state, cursor position, word/character counts, and title updates.
- `src/styles/`: renderer CSS architecture split into tokens, app layout, Markdown typography, CodeMirror styling, and print/PDF overrides.

Security boundaries to preserve:

- `contextIsolation: true`
- `nodeIntegration: false`
- Renderer must not access Node.js APIs directly.
- File system access must stay behind the typed preload API.
- PDF export follows Renderer -> Preload -> IPC -> Main -> hidden print window -> `printToPDF`.
- External Markdown links are blocked from navigating the Electron app window and opened through `shell.openExternal` for supported URL schemes.
- Unsaved-change confirmation uses typed preload APIs and Main-process dialogs; New/Open and window close are protected.
- Do not use `webSecurity: false`, `allowRunningInsecureContent`, or raw `ipcRenderer` exposure for PDF or local resources.

## 3. Current Progress

Completed:

- Electron + Vue 3 + TypeScript + Vite project skeleton.
- Electron Vite configuration.
- Secure Main / Preload / Renderer split.
- Typed `window.mora` API for file operations, PDF export, and title updates.
- Native Open dialog for `.md` and `.markdown` files.
- UTF-8 file reading.
- Save and Save As through Electron dialogs.
- Save As normalizes unsupported or missing extensions to `.md`.
- New document action with unsaved-change confirmation.
- Open document action with unsaved-change confirmation.
- Dirty state tracking through `content` vs `savedContent`.
- Window title updates with unsaved indicator, using the format `README.md • — Mora`.
- CodeMirror 6 Markdown editor.
- Markdown syntax highlighting in the editor.
- Undo/redo, active line highlighting, bracket matching, placeholder text, and Tab indentation through CodeMirror setup. CodeMirror line-number gutters are currently hidden by CSS to keep the editor document-focused.
- External document replacements in CodeMirror are kept out of undo history.
- `Ctrl+S` / `Cmd+S` save support in the editor and at the app window level.
- `Ctrl/Cmd+N`, `Ctrl/Cmd+O`, `Ctrl/Cmd+Shift+S`, and `Ctrl/Cmd+Shift+E` global shortcuts.
- Live Markdown preview.
- Editor / Preview / Split view modes, defaulting to Split.
- Refined title/tab shell with current document tab, unsaved state, real file actions, More menu, and compact segmented view mode switch.
- Lightweight status bar with Markdown, Local, saved state, word count, reading time, character count, and cursor position.
- markdown-it rendering pipeline.
- DOMPurify sanitization of rendered HTML.
- highlight.js fenced code block highlighting.
- Basic GFM-related rendering: tables, strikethrough, and task lists.
- Systematic Markdown preview typography for headings, paragraphs, inline code, fenced code blocks with language labels, blockquotes, lists, task lists, tables, links, images, and horizontal rules.
- Preview mode uses a centered reading column with a max width.
- Split mode keeps Editor and Preview at a 50/50 layout with subtler pane separation.
- CodeMirror visual polish for font stack, padding, gutter, current line, selection, cursor, and placeholder.
- CSS split into `tokens.css`, `app.css`, `markdown.css`, `codemirror.css`, and `print.css`.
- `print.css` provides PDF/print-only typography, A4 white-background layout, code block wrapping, table wrapping, image scaling, and basic page-break behavior.
- PDF export uses current in-memory Markdown content. It does not save Markdown and does not clear dirty state.
- PDF defaults: A4, portrait, white background, print backgrounds enabled, and 20mm margins.
- PDF Save Dialog defaults to `README.pdf`, `notes.pdf`, `abc.test.pdf`, or `Untitled.pdf`; saved Markdown files default to exporting beside the source document.
- Dedicated hidden print window is used so exported PDFs contain only Markdown document content, not Mora toolbar/editor/status UI.
- Print export waits for `document.fonts.ready` and image load/error completion before calling `printToPDF`.
- `examples/showcase.md` added and extended for manual Markdown rendering, PDF export, local image, long line, table, Chinese, and multi-page checks.
- `examples/assets/mora-architecture.svg` added as a local image fixture.
- `output/pdf/showcase.pdf` generated as a PDF smoke output from `examples/showcase.md`.
- README updated with PDF Export and keyboard shortcut documentation.
- Review/quality consolidation completed before the first Git commit.
- Vitest added for focused unit tests.
- Tests cover PDF filename/default option helpers, document dirty/title/stats transitions, Markdown sanitization/highlight fallback, and PDF export dirty-state behavior.
- Tests now also cover document stats whitespace/CRLF boundaries, missing-source PDF default paths, partial PDF option normalization, unsafe data links, and PDF export error-state reset.
- ESLint flat config added for TypeScript, Vue SFCs, Electron Main/Preload, Browser Renderer, and Vitest-oriented test files.
- Prettier added for TypeScript, Vue, JavaScript config, JSON, Markdown, and CSS formatting.
- `package.json` quality scripts added: `lint`, `lint:fix`, `format`, and `format:check`.
- Manual Electron smoke-test checklist added at `docs/qa/manual-smoke-test.md`.
- `.gitignore` excludes generated artifacts such as `tmp/`, `output/`, `review/`, `coverage/`, and release/build outputs.
- `HandOff.md` remains local Agent handoff context and is intentionally ignored by Git; update it between stages, but do not commit it.
- `res.txt` is local assistant response output and is intentionally ignored by Git.
- Prompt 04.5 final pre-commit review completed. The formal Prompt 04 project changes are suitable for the second Git commit after user review.
- electron-builder added for Windows packaging.
- `electron-builder.yml` added for Windows NSIS installer packaging.
- Windows packaging output directory is `dist/`, which remains ignored by Git.
- Windows package scripts added: `package` for `dist/win-unpacked/Mora.exe` and `dist` for `dist/Mora-Setup-0.1.0.exe`.
- Temporary Mora V0 icon assets added under `build/` for installer, executable, shortcuts, and taskbar branding.
- Main window now uses the Mora icon through a packaged-safe asset path helper.
- PDF print style loading now resolves assets from `app.getAppPath()` when packaged and `process.cwd()` during development, so `src/styles` and highlight.js CSS can be found from `app.asar`.
- `docs/qa/manual-smoke-test.md` now includes installed build, unpacked build, packaged PDF export, and refined desktop UI checklist sections.
- README now documents Windows build/distribution commands.
- Project migrated to `E:\projects\Mora`.
- Windows-native `pnpm dist` now passes from `E:\projects\Mora` and generates `dist/Mora-Setup-0.1.0.exe`.
- Native Save As and PDF Export dialogs now use absolute default paths for unsaved documents; packaged PDF export was manually confirmed working by the user on 2026-08-21.

Not implemented yet:

- Typora-style WYSIWYM editing.
- KaTeX.
- Mermaid.
- Outline / TOC.
- Real multi-tab document lifecycle.
- Multi-window behavior.
- Real file tree / workspace browser.
- Git integration.
- Cloud sync.
- Login.
- Database.
- AI features.
- Plugin system.
- Auto update.
- Internationalization.
- Complex settings.
- Dark Mode.

## 4. Important Files

```text
package.json
Project scripts, dependencies, lint/format tooling, and pnpm build-script allowlist.

eslint.config.mjs
ESLint Flat Config for TypeScript, Vue SFCs, Electron/Node code, Browser Renderer code, and tests.

electron-builder.yml
electron-builder configuration for Windows NSIS installer builds. Uses app id `app.mora.editor`, product name `Mora`, output directory `dist/`, and icon `build/icon.ico`.

.prettierrc.json
Prettier formatting style aligned with the existing single-quote/no-semicolon project style.

.prettierignore
Prettier ignore rules for dependencies, build outputs, generated artifacts, and local IDE files.

electron.vite.config.mjs
Electron Vite build configuration for Main, Preload, and Renderer.

electron/main/index.ts
Electron Main Process. Creates the BrowserWindow, handles file dialogs, file reads/writes, title updates, Save As extension normalization, external-link navigation hardening, and IPC registration.

electron/main/pdf.ts
PDF export pipeline: Save Dialog, print filename/path defaults, hidden print window, print HTML shell, CSS loading, asset readiness, `printToPDF`, and PDF writes.

electron/main/paths.ts
Packaged-safe asset path helpers for app resources such as `build/icon.ico` and print CSS assets.

electron/preload/index.ts
Secure bridge between Renderer and Main. Exposes only the typed window.mora API.

electron/shared/ipc.ts
Shared IPC types for file operations, PDF export, and preload API shape.

src/App.vue
Top-level renderer layout and global shortcut wiring for New, Open, Save, Save As, and Export PDF.

src/components/AppSidebar.vue
Refined desktop sidebar with real New/Open/Save/PDF actions, current document context, and current workspace/folder display.

src/composables/useMarkdownDocument.ts
Document state, dirty tracking, unsaved-change confirmation, file actions, PDF export state, view mode, cursor state, word/character stats, and window title updates.

src/services/documentModel.ts
Pure document state helpers used by the composable and unit tests.

src/components/TitleBar.vue
Refined title/tab shell with a single active document tab, unsaved indicator, real file actions, More menu, and view mode segmented control.

src/components/MarkdownEditor.vue
CodeMirror 6 editor integration, placeholder, save shortcut, cursor events, and external content sync.

src/components/MarkdownPreview.vue
Markdown preview component using the renderer service.

src/components/StatusBar.vue
Local document type, saved state, word count, reading time, character count, and cursor position display.

src/services/markdown.ts
Markdown rendering pipeline: markdown-it -> highlight.js -> DOMPurify.

src/services/pdf.ts
Renderer PDF export helper that reuses the Markdown renderer and calls `window.mora.exportPdf`.

electron/shared/pdf.ts
Shared pure PDF helpers for filename generation, default save path, extension normalization, and option normalization.

src/styles/main.css
CSS entry point that imports the split style files.

src/styles/tokens.css
Design tokens for colors, fonts, type sizes, radii, layout heights, and transitions.

src/styles/app.css
Application shell, toolbar, More menu, segmented control, pane layout, status bar, responsive behavior, and scrollbars.

src/styles/markdown.css
Markdown preview typography and element styling.

src/styles/codemirror.css
CodeMirror editor visual styling.

src/styles/print.css
PDF/print-specific Markdown document styling and page-break behavior.

src/types/
Renderer-side shared types and global window.mora typing.

src/**/*.test.ts
Vitest unit tests for document state, Markdown rendering, PDF helpers, PDF export dirty-state behavior, and selected edge cases.

vitest.config.mts
Vitest configuration with the `@` alias and jsdom environment.

examples/showcase.md
Development sample for manually checking Markdown rendering and PDF export coverage.

examples/assets/mora-architecture.svg
Local image fixture used by the Markdown/PDF showcase.

docs/qa/manual-smoke-test.md
Manual Electron smoke checklist for startup, refined desktop UI, file dialogs, Save/Save As, unsaved-change prompts, PDF export, external links, shortcuts, status bar behavior, installed Windows builds, unpacked Windows builds, and packaged PDF export.

build/icon.ico
Temporary Mora V0 Windows icon used by electron-builder and BrowserWindow.

build/icon.png
Source PNG for the temporary Mora V0 icon.

README.md
User-facing project overview and development commands.

HandOff.md
Local Agent-facing project status and handoff document. Keep it updated after meaningful work, but keep it ignored and out of commits.
```

## 5. Current State

- Project directory in this WSL session: `/home/leeziqiang/projects/Mora`.
- Original Windows project path referenced by the user: `E:\projects\Mora`.
- Git repository: present.
- Current working tree contains uncommitted Prompt 05 packaging baseline changes plus the refined Mac-style UI pass.
- `.gitignore` excludes generated `dist/`, `release/`, `out/`, `output/`, `tmp/`, and `review/` artifacts, local `HandOff.md`, and local `res.txt`.
- `HandOff.md` is ignored with `.gitignore:16:HandOff.md`.
- Packaging dependency: `electron-builder`.
- Icon dependency added for the UI pass: `@lucide/vue`.
- Build-script approvals are stored in `pnpm-workspace.yaml` for both pnpm 11 (`allowBuilds`) and pnpm 10 (`onlyBuiltDependencies` / `ignoredBuiltDependencies`).
- Production renderer bundle remains large because dependencies are bundled without optimization work. This has not been investigated yet.

Prompt 05 packaging status from this WSL checkout:

- `pnpm package` previously passed and generated `dist/win-unpacked/Mora.exe`.
- `pnpm dist` remains unsupported from WSL because NSIS installer generation requires Wine when run from a non-Windows host; use the Windows checkout for final installer generation.
- Windows-native `pnpm dist` passed on 2026-08-21 and generated `dist/Mora-Setup-0.1.0.exe`.
- User manual testing confirmed packaged PDF export works after the absolute default-path fix.

Most recent UI pass validation:

- `pnpm format:check` passed on 2026-08-20 after the refined Mac-style UI pass.
- `pnpm lint` passed on 2026-08-20 after the refined Mac-style UI pass.
- `pnpm test` passed on 2026-08-20: 4 files / 26 tests.
- `pnpm typecheck` passed on 2026-08-20 after the refined Mac-style UI pass.
- `pnpm build` passed on 2026-08-20 and produced Main, Preload, and Renderer output under `out/`.
- GUI visual QA was partially completed from Windows; user confirmed the fixed PDF export path works.

Verified commands:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build
git check-ignore -v HandOff.md
```

Most recent command results:

```bash
pnpm format:check  # passed
pnpm lint          # passed
pnpm test          # passed, 4 files / 26 tests
pnpm typecheck     # passed
pnpm build         # passed
git check-ignore -v HandOff.md  # passed, ignored by .gitignore
```

2026-08-21 command results:

```bash
pnpm dist  # passed on Windows
.\node_modules\.bin\prettier.CMD . --check  # passed
.\node_modules\.bin\eslint.CMD . --max-warnings=0  # passed
.\node_modules\.bin\vitest.CMD run  # passed, 4 files / 26 tests
.\node_modules\.bin\vue-tsc.CMD --noEmit  # passed
```

## 6. Testing

- Test framework: Vitest 2 with jsdom.
- Test command: `pnpm test`.
- Watch command: `pnpm test:watch`.
- Test files:
  - `src/services/documentModel.test.ts`
  - `src/services/pdf.test.ts`
  - `src/services/markdown.test.ts`
  - `src/composables/useMarkdownDocument.test.ts`
- Current coverage focus:
  - PDF file name conversion, PDF extension handling, default PDF path, and option normalization.
  - Document initial state, dirty transitions, saved document application, title formatting, word/character stats, whitespace-only stats, and CRLF character counting.
  - Markdown renderer configuration for tables, task lists, strikethrough, code highlighting, unknown-language fallback, raw HTML safety, unsafe links, and unsafe data links.
  - Regression checks that PDF export uses current unsaved content without saving Markdown or clearing dirty state, and that export failures set the error state while resetting the exporting flag.
- Still manual:
  - Native Open/Save/Save As dialogs.
  - Native unsaved-change dialog visual behavior.
  - Full Electron UI click-through.
  - Final PDF visual review after substantial print CSS changes.
  - Use `docs/qa/manual-smoke-test.md` for the manual checklist.
- Prompt 04.5 did not add tests; current count remains 4 files / 26 tests.
- Prompt 05 did not add unit tests; `pnpm package` generated the unpacked app in WSL, and Windows-native `pnpm dist` passed on 2026-08-21.

## 7. Known Issues

- Preview and Editor do not have synchronized scrolling.
- Markdown rendering is still intentionally basic beyond common GFM-style elements; advanced extensions are not implemented.
- PDF export uses Chromium's native print layout, so extremely wide tables and very long code blocks may still wrap or paginate imperfectly.
- Remote images in PDF depend on network availability and remote server behavior.
- Relative local images are supported for PDF when exporting a saved Markdown file with a known source path; unsaved documents have no source directory for relative image resolution.
- The production renderer bundle is large because dependencies are currently bundled without optimization work.
- Full native dialog flows in packaged builds still need broader dogfooding, but PDF Export Save Dialog was manually confirmed working by the user on 2026-08-21.
- Windows builds are unsigned; this is expected for local dogfooding and code signing is deferred to a future public release stage.
- The current `build/icon.ico` is a temporary Mora V0 icon and can be replaced by a polished brand icon later.

## 8. Next Steps

Recommended near-term order:

1. Continue installed-app QA beyond the confirmed PDF export path, especially Start Menu launch, uninstall, Open, Save As, and unsaved-change dialogs.
2. Launch the refined UI on Windows and run the visual QA checklist.
3. Install and use Mora for real-world dogfooding.
4. Fix issues discovered during daily Markdown editing and packaged PDF export.
5. Consider Focus Mode on top of the current app-shell structure.
6. Consider a real multi-tab document lifecycle only after single-document behavior remains stable.
7. Add Dark Mode on top of the CSS variable foundation.
8. Consider KaTeX / Mermaid / Outline / TOC in separate scoped prompts.
9. Investigate distribution/update improvements and production renderer bundle size when release optimization becomes a priority.

Keep scope tight. Do not start advanced systems such as plugins, sync, auth, or databases until the core local Markdown workflow is stable.

## 9. Development Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm test
pnpm test:watch
pnpm typecheck
pnpm build
pnpm package
pnpm dist
pnpm preview
```

Useful maintenance command after a fresh install if pnpm reports ignored build scripts:

```bash
pnpm rebuild
```

`pnpm-workspace.yaml` contains:

```yaml
allowBuilds:
  electron: true
  electron-winstaller: false
  esbuild: true
onlyBuiltDependencies:
  - electron
  - esbuild
ignoredBuiltDependencies:
  - electron-winstaller
```

This is required so Electron and esbuild can run their install scripts.

## 10. Notes for Next Agent

- Do not reinitialize the project.
- Start by reading `HandOff.md`, then inspect the relevant source files.
- Keep `E:\projects\Mora` as the project root.
- Preserve the Electron Main / Preload / Renderer responsibility boundaries.
- Do not expose raw `ipcRenderer` to the Renderer.
- Do not let Renderer code directly access Node.js APIs.
- Keep file system operations in Main and expose only narrow typed APIs through Preload.
- Keep generated artifacts such as `tmp/`, `output/`, and `review/` out of commits unless the user explicitly asks otherwise.
- Keep generated packaging artifacts such as `dist/`, `release/`, and `out/` out of commits.
- Keep `README.md`, `examples/`, and `docs/qa/manual-smoke-test.md` trackable.
- Keep `HandOff.md` and `res.txt` local-only and ignored by Git.
- Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before handing off meaningful changes.
- Keep PDF export using the dedicated hidden print window. Do not print the current app window.
- Keep packaged asset access going through `electron/main/paths.ts` rather than assuming `process.cwd()` points at the project root.
- Keep `print.css` independent from future UI themes so PDF output remains white-background by default.
- Do not expand scope into Mermaid, KaTeX, plugins, sync, auth, database, or AI features unless explicitly requested.
- Prefer simple, clear, local-first implementation choices.
- Keep CSS changes aligned with the current `src/styles/` split and token usage.
- After each meaningful phase, update at least these sections: Current Progress, Current State, Known Issues, Next Steps, and Important Files.
