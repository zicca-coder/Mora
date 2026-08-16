<script setup lang="ts">
import type { CursorPosition } from '@/types/document'
import type { DocumentStats } from '@/types/document'

defineProps<{
  dirty: boolean
  cursor: CursorPosition
  stats: DocumentStats
}>()
</script>

<template>
  <footer class="status-bar">
    <div class="status-group">
      <span>Markdown</span>
      <span>UTF-8</span>
      <span>{{ dirty ? 'Unsaved' : 'Saved' }}</span>
    </div>

    <div class="status-group status-group-right">
      <span>{{ stats.words }} words</span>
      <span>{{ stats.characters }} chars</span>
      <span class="cursor-position">Ln {{ cursor.line }}, Col {{ cursor.column }}</span>
    </div>
  </footer>
</template>
