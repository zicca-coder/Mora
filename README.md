# Mora

Mora is a minimal, beautiful and local-first Markdown editor.

Mora 是一个简洁、美观、本地优先的 Markdown 桌面编辑器。当前项目仍处于早期开发阶段，重点先把本地 Markdown 编辑、阅读体验、文件保存和 PDF 导出打磨成可靠的基础版本，再逐步加入主题、数学公式、图表和更多文档能力。

## 功能特性

- 基于 Electron 的桌面应用架构
- 使用 CodeMirror 6 编辑 Markdown
- 实时 Markdown Preview
- Editor / Split / Preview 三种视图模式
- New / Open / Save / Save As 文件操作
- dirty 状态提示与窗口标题同步
- 未保存内容保护：New、Open、窗口关闭前会确认
- GitHub Flavored Markdown 基础能力：表格、删除线、任务列表
- fenced code block 代码高亮
- DOMPurify 清理预览 HTML
- 安全的 Main / Preload / Renderer IPC 边界
- 外部链接交给系统默认浏览器打开
- 系统化 Markdown Typography 与舒适编辑器样式
- Markdown 导出 PDF，使用独立 Print CSS
- Vitest 单元测试覆盖核心文档状态、Markdown 渲染和 PDF 文件名逻辑

## 技术栈

- Electron
- Vue 3
- TypeScript
- Vite / electron-vite
- CodeMirror 6
- markdown-it
- highlight.js
- DOMPurify
- Vitest
- pnpm

## 安装

```bash
pnpm install
```

如果 pnpm 提示 Electron 或 esbuild 的安装脚本被忽略，可以执行：

```bash
pnpm rebuild
```

## 开发运行

```bash
pnpm dev
```

## 测试与验证

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm typecheck
```

需要自动修复 lint 或格式问题时，可以使用：

```bash
pnpm lint:fix
pnpm format
```

Electron 原生对话框、窗口关闭和真实 PDF 导出等流程请参考 `docs/qa/manual-smoke-test.md` 手工验证。

## 构建

```bash
pnpm build
```

`pnpm build` 会先执行 TypeScript 类型检查，然后构建 Electron Main、Preload 和 Renderer。

## 项目结构

```text
Mora/
├── electron/
│   ├── main/          # Electron Main Process 与 PDF 导出
│   ├── preload/       # 安全 preload bridge
│   └── shared/        # IPC 与共享类型/工具
├── examples/          # Markdown 示例文档与本地图片 fixture
├── src/
│   ├── components/    # Vue UI 组件
│   ├── composables/   # 文档状态组合逻辑
│   ├── services/      # Markdown、PDF、文档模型等服务
│   ├── styles/        # tokens、app、markdown、codemirror、print CSS
│   └── types/         # Renderer 侧类型声明
├── HandOff.md         # Agent 协作交接文档
├── package.json
├── pnpm-lock.yaml
└── vitest.config.mts
```

## Markdown Showcase

`examples/showcase.md` 是开发和人工验证用的 Markdown 示例，覆盖标题、段落、列表、任务列表、表格、链接、图片、引用、代码块和中英文混排。

## Roadmap

- Dark Mode 与 Theme Foundation
- KaTeX 数学公式
- Mermaid 图表
- Outline / TOC
- Recent Files
- Image Paste
- Typora-like Live Mode

## License

`package.json` 当前声明为 MIT。正式开源发布前仍需要补充 `LICENSE` 文件。
