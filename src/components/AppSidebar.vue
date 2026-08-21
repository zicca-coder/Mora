<script setup lang="ts">
import { computed } from 'vue'
import { FilePlus2, FileText, FolderOpen } from '@lucide/vue'

const props = defineProps<{
  fileName: string
  filePath: string | null
  dirty: boolean
}>()

const emit = defineEmits<{
  new: []
}>()

const folderLabel = computed(() => {
  if (!props.filePath) {
    return 'No folder selected'
  }

  const parts = props.filePath.split(/[\\/]/).filter(Boolean)
  return parts.length > 1 ? (parts.at(-2) ?? 'Local folder') : 'Local folder'
})

const filePathLabel = computed(() => {
  if (!props.filePath) {
    return 'Local draft'
  }

  const separatorIndex = Math.max(props.filePath.lastIndexOf('/'), props.filePath.lastIndexOf('\\'))
  return separatorIndex === -1 ? props.filePath : props.filePath.slice(0, separatorIndex)
})
</script>

<template>
  <aside class="app-sidebar" aria-label="Mora sidebar">
    <div class="sidebar-brand">
      <span class="brand-mark" aria-hidden="true">M</span>
      <span class="brand-name">Mora</span>
    </div>

    <button type="button" class="sidebar-primary-action" @click="emit('new')">
      <FilePlus2 :size="15" :stroke-width="1.8" aria-hidden="true" />
      <span>New document</span>
    </button>

    <section class="sidebar-section" aria-labelledby="documents-heading">
      <h2 id="documents-heading" class="sidebar-section-title">Documents</h2>
      <div class="workspace-file is-selected">
        <FileText :size="15" :stroke-width="1.7" aria-hidden="true" />
        <span class="workspace-file-name">{{ fileName }}</span>
        <span v-if="dirty" class="dirty-dot" aria-label="Unsaved changes" />
      </div>
      <p class="workspace-file-path">{{ filePathLabel }}</p>
    </section>

    <section class="sidebar-section" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" class="sidebar-section-title">Workspace</h2>
      <div class="workspace-folder">
        <FolderOpen :size="15" :stroke-width="1.7" aria-hidden="true" />
        <span>{{ folderLabel }}</span>
      </div>
    </section>
  </aside>
</template>
