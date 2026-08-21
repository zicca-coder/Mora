<script setup lang="ts">
import { computed } from 'vue'
import { FileDown, FilePlus2, FileText, FolderOpen, SquarePen } from '@lucide/vue'
import type { DocumentStats } from '@/types/document'

const props = defineProps<{
  fileName: string
  filePath: string | null
  dirty: boolean
  stats: DocumentStats
  exportingPdf: boolean
}>()

const emit = defineEmits<{
  new: []
  open: []
  save: []
  exportPdf: []
}>()

const folderLabel = computed(() => {
  if (!props.filePath) {
    return 'No folder selected'
  }

  const parts = props.filePath.split(/[\\/]/).filter(Boolean)
  return parts.length > 1 ? (parts.at(-2) ?? 'Local folder') : 'Local folder'
})

const fileLocation = computed(() => {
  if (!props.filePath) {
    return 'Open a Markdown file to anchor the workspace.'
  }

  const separatorIndex = Math.max(props.filePath.lastIndexOf('/'), props.filePath.lastIndexOf('\\'))
  return separatorIndex === -1 ? props.filePath : props.filePath.slice(0, separatorIndex)
})
</script>

<template>
  <aside class="app-sidebar" aria-label="Mora sidebar">
    <div class="sidebar-brand">
      <span class="brand-mark" aria-hidden="true">M</span>
      <div class="brand-copy">
        <span class="brand-name">Mora</span>
        <span class="brand-subtitle">Local Markdown</span>
      </div>
    </div>

    <button type="button" class="sidebar-search" title="Open Markdown file" @click="emit('open')">
      <FolderOpen :size="15" :stroke-width="1.75" aria-hidden="true" />
      <span>Open Markdown...</span>
    </button>

    <nav class="sidebar-nav" aria-label="Document actions">
      <button type="button" class="sidebar-nav-item" @click="emit('new')">
        <FilePlus2 :size="15" :stroke-width="1.75" aria-hidden="true" />
        <span>New Draft</span>
      </button>
      <button type="button" class="sidebar-nav-item" @click="emit('open')">
        <FolderOpen :size="15" :stroke-width="1.75" aria-hidden="true" />
        <span>Open File</span>
      </button>
      <button type="button" class="sidebar-nav-item" @click="emit('save')">
        <SquarePen :size="15" :stroke-width="1.75" aria-hidden="true" />
        <span>Save Current</span>
      </button>
    </nav>

    <section class="sidebar-section" aria-labelledby="current-file-heading">
      <h2 id="current-file-heading" class="sidebar-section-title">Current</h2>
      <div class="workspace-file is-selected">
        <FileText :size="15" :stroke-width="1.7" aria-hidden="true" />
        <span class="workspace-file-name">{{ fileName }}</span>
        <span v-if="dirty" class="dirty-dot" aria-label="Unsaved changes" />
      </div>
      <p class="workspace-file-path">{{ fileLocation }}</p>
    </section>

    <section class="sidebar-section" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" class="sidebar-section-title">Workspace</h2>
      <div class="workspace-folder">
        <FolderOpen :size="15" :stroke-width="1.7" aria-hidden="true" />
        <span>{{ folderLabel }}</span>
      </div>
      <div class="workspace-file workspace-file-child is-selected">
        <FileText :size="14" :stroke-width="1.7" aria-hidden="true" />
        <span class="workspace-file-name">{{ fileName }}</span>
      </div>
    </section>

    <div class="sidebar-footer">
      <span>{{ stats.words }} words</span>
      <button type="button" class="sidebar-footer-action" :disabled="exportingPdf" @click="emit('exportPdf')">
        <FileDown :size="14" :stroke-width="1.75" aria-hidden="true" />
        <span>{{ exportingPdf ? 'Exporting' : 'PDF' }}</span>
      </button>
    </div>
  </aside>
</template>
