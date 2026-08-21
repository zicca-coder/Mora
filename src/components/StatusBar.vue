<script setup lang="ts">
import { computed } from 'vue'
import type { CursorPosition } from '@/types/document'
import type { DocumentStats } from '@/types/document'

const props = defineProps<{
  dirty: boolean
  cursor: CursorPosition
  stats: DocumentStats
}>()

const readingMinutes = computed(() => {
  if (props.stats.words === 0) {
    return 0
  }

  return Math.max(1, Math.ceil(props.stats.words / 220))
})
</script>

<template>
  <footer class="status-bar">
    <div class="status-group">
      <span>Markdown</span>
      <span>Local</span>
      <span class="save-state" :class="{ dirty }">{{ dirty ? 'Unsaved' : 'Saved' }}</span>
    </div>

    <div class="status-group status-group-right">
      <span>{{ stats.words }} words</span>
      <span>{{ readingMinutes }} min read</span>
      <span>{{ stats.characters }} chars</span>
      <span class="cursor-position">Ln {{ cursor.line }}, Col {{ cursor.column }}</span>
    </div>
  </footer>
</template>
