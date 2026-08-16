<script setup lang="ts">
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import StatusBar from '@/components/StatusBar.vue'
import TitleBar from '@/components/TitleBar.vue'
import { useMarkdownDocument } from '@/composables/useMarkdownDocument'
import { onBeforeUnmount, onMounted } from 'vue'

const {
  documentState,
  title,
  documentStats,
  viewMode,
  cursorPosition,
  lastError,
  isExportingPdf,
  setContent,
  setCursorPosition,
  newDocument,
  openDocument,
  saveDocument,
  saveDocumentAs,
  exportPdfDocument
} = useMarkdownDocument()

function handleGlobalKeydown(event: KeyboardEvent): void {
  if (event.defaultPrevented || !(event.ctrlKey || event.metaKey) || event.altKey) {
    return
  }

  const key = event.key.toLowerCase()

  if (key === 'n') {
    event.preventDefault()
    void newDocument()
    return
  }

  if (key === 'o') {
    event.preventDefault()
    void openDocument()
    return
  }

  if (key === 's' && event.shiftKey) {
    event.preventDefault()
    void saveDocumentAs()
    return
  }

  if (key === 'e' && event.shiftKey) {
    event.preventDefault()
    void exportPdfDocument()
    return
  }

  if (key === 's') {
    event.preventDefault()
    void saveDocument()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="app-shell">
    <TitleBar
      :title="title"
      :view-mode="viewMode"
      @new="newDocument"
      @open="openDocument"
      @save="saveDocument"
      @save-as="saveDocumentAs"
      @export-pdf="exportPdfDocument"
      :exporting-pdf="isExportingPdf"
      @change-view-mode="viewMode = $event"
    />

    <main class="workspace" :class="`mode-${viewMode}`">
      <section v-if="viewMode !== 'preview'" class="pane editor-pane" aria-label="Markdown Editor">
        <MarkdownEditor
          :content="documentState.content"
          @update:content="setContent"
          @cursor-change="setCursorPosition"
          @save="saveDocument"
        />
      </section>

      <section v-if="viewMode !== 'editor'" class="pane preview-pane" aria-label="Markdown Preview">
        <MarkdownPreview :content="documentState.content" />
      </section>
    </main>

    <p v-if="lastError" class="error-message">{{ lastError }}</p>

    <StatusBar :dirty="documentState.dirty" :cursor="cursorPosition" :stats="documentStats" />
  </div>
</template>
