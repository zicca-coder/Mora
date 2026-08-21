<script setup lang="ts">
import { Columns2, Eye, FileDown, FilePlus2, FileText, MoreHorizontal, Save, SquarePen } from '@lucide/vue'
import type { Component } from 'vue'
import type { ViewMode } from '@/types/document'

defineProps<{
  title: string
  dirty: boolean
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
  <header class="title-bar">
    <div class="tab-strip" aria-label="Open documents">
      <div class="editor-tab active" :class="{ dirty }">
        <FileText :size="15" :stroke-width="1.75" aria-hidden="true" />
        <span class="editor-tab-title">{{ title }}</span>
        <span v-if="dirty" class="tab-dirty-dot" aria-label="Unsaved changes" />
      </div>

      <button type="button" class="tab-add-button" title="New document" @click="emit('new')">
        <FilePlus2 :size="15" :stroke-width="1.75" aria-hidden="true" />
        <span class="sr-only">New document</span>
      </button>
    </div>

    <div class="top-actions" aria-label="Document toolbar">
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
        <button type="button" class="icon-button primary-action" title="Save" @click="emit('save')">
          <Save :size="15" :stroke-width="1.8" aria-hidden="true" />
          <span class="sr-only">Save</span>
        </button>
        <button
          type="button"
          class="icon-button"
          title="Export PDF"
          :disabled="exportingPdf"
          @click="emit('exportPdf')"
        >
          <FileDown :size="15" :stroke-width="1.8" aria-hidden="true" />
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
