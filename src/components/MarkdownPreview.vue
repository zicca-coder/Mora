<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/services/markdown'

const props = defineProps<{
  content: string
}>()

const renderedHtml = computed(() => renderMarkdown(props.content))
</script>

<template>
  <article class="markdown-preview" v-html="renderedHtml" />
</template>
