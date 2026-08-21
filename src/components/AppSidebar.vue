<script setup lang="ts">
import { FilePlus2, FileText } from '@lucide/vue'

defineProps<{
  fileName: string
  dirty: boolean
}>()

const emit = defineEmits<{
  new: []
}>()
</script>

<template>
  <aside class="app-sidebar" aria-label="Mora sidebar">
    <div class="sidebar-brand">
      <span class="brand-mark" aria-hidden="true">M</span>
      <span class="brand-name">Mora</span>
    </div>

    <button type="button" class="sidebar-new-document" @click="emit('new')">
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
    </section>
  </aside>
</template>
