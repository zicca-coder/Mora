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
      <span class="save-state" :class="{ dirty }">{{ dirty ? 'Unsaved' : 'Saved' }}</span>
    </div>

    <div class="status-group status-group-right">
      <span>{{ stats.words }} words</span>
      <span class="cursor-position">Ln {{ cursor.line }}, Col {{ cursor.column }}</span>
    </div>
  </footer>
</template>
