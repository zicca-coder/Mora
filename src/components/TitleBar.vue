<script setup lang="ts">
import type { ViewMode } from '@/types/document'

defineProps<{
  title: string
  viewMode: ViewMode
  exportingPdf: boolean
}>()

const emit = defineEmits<{
  new: []
  open: []
  save: []
  saveAs: []
  exportPdf: []
  changeViewMode: [mode: ViewMode]
}>()

const viewModes: Array<{ label: string; value: ViewMode; title: string }> = [
  { label: 'Editor', value: 'editor', title: 'Editor only' },
  { label: 'Split', value: 'split', title: 'Editor and preview' },
  { label: 'Preview', value: 'preview', title: 'Preview only' }
]
</script>

<template>
  <header class="title-bar">
    <div class="title-identity">
      <span class="app-name">Mora</span>
      <span class="document-title">{{ title }}</span>
    </div>

    <div class="toolbar" aria-label="Document actions">
      <button type="button" class="tool-button" title="New document (Ctrl/Cmd+N)" @click="emit('new')">New</button>
      <button type="button" class="tool-button" title="Open Markdown file (Ctrl/Cmd+O)" @click="emit('open')">Open</button>
      <button type="button" class="tool-button primary-action" title="Save (Ctrl/Cmd+S)" @click="emit('save')">Save</button>
      <details class="more-menu">
        <summary class="tool-button more-menu-trigger" title="More document actions">More</summary>
        <div class="more-menu-content">
          <button type="button" class="menu-item" title="Save As (Ctrl/Cmd+Shift+S)" @click="emit('saveAs')">Save As</button>
          <button
            type="button"
            class="menu-item"
            title="Export PDF (Ctrl/Cmd+Shift+E)"
            :disabled="exportingPdf"
            @click="emit('exportPdf')"
          >
            {{ exportingPdf ? 'Exporting...' : 'Export PDF' }}
          </button>
        </div>
      </details>
    </div>

    <div class="segmented-control" aria-label="View mode">
      <button
        v-for="mode in viewModes"
        :key="mode.value"
        type="button"
        :class="{ active: viewMode === mode.value }"
        :aria-pressed="viewMode === mode.value"
        :title="mode.title"
        @click="emit('changeViewMode', mode.value)"
      >
        {{ mode.label }}
      </button>
    </div>
  </header>
</template>
