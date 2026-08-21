<script setup lang="ts">
import { Columns2, Eye, FileDown, FilePlus2, FileText, FolderOpen, MoreHorizontal, Save, SquarePen } from '@lucide/vue'
import type { Component } from 'vue'
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

const viewModes: Array<{ label: string; value: ViewMode; title: string; icon: Component }> = [
  { label: 'Editor', value: 'editor', title: 'Editor only', icon: SquarePen },
  { label: 'Split', value: 'split', title: 'Editor and preview', icon: Columns2 },
  { label: 'Preview', value: 'preview', title: 'Preview only', icon: Eye }
]
</script>

<template>
  <header class="workspace-header">
    <div class="document-heading" aria-label="Current document">
      <div class="document-title-row">
        <FileText :size="16" :stroke-width="1.75" aria-hidden="true" />
        <h1 class="document-title">{{ title }}</h1>
      </div>
    </div>

    <div class="header-actions" aria-label="Document toolbar">
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
          <component :is="mode.icon" :size="15" :stroke-width="1.75" aria-hidden="true" />
          <span>{{ mode.label }}</span>
        </button>
      </div>

      <div class="toolbar" aria-label="File actions">
        <button type="button" class="icon-button" title="New document" @click="emit('new')">
          <FilePlus2 :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span class="sr-only">New document</span>
        </button>
        <button type="button" class="icon-button" title="Open File" @click="emit('open')">
          <FolderOpen :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span class="sr-only">Open File</span>
        </button>
        <button type="button" class="icon-button" title="Save" @click="emit('save')">
          <Save :size="16" :stroke-width="1.8" aria-hidden="true" />
          <span class="sr-only">Save</span>
        </button>
        <button
          type="button"
          class="icon-button"
          title="Export PDF"
          :disabled="exportingPdf"
          @click="emit('exportPdf')"
        >
          <FileDown :size="16" :stroke-width="1.8" aria-hidden="true" />
          <span class="sr-only">Export PDF</span>
        </button>
        <details class="more-menu">
          <summary class="icon-button more-menu-trigger" title="More document actions">
            <MoreHorizontal :size="16" :stroke-width="1.8" aria-hidden="true" />
            <span class="sr-only">More document actions</span>
          </summary>
          <div class="more-menu-content">
            <button type="button" class="menu-item" title="Open File" @click="emit('open')">Open File</button>
            <button type="button" class="menu-item" title="Save As" @click="emit('saveAs')">Save As</button>
            <button type="button" class="menu-item" title="New document" @click="emit('new')">New Document</button>
            <button
              type="button"
              class="menu-item"
              title="Export PDF"
              :disabled="exportingPdf"
              @click="emit('exportPdf')"
            >
              {{ exportingPdf ? 'Exporting PDF' : 'Export PDF' }}
            </button>
          </div>
        </details>
      </div>
    </div>
  </header>
</template>
