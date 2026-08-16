<script setup lang="ts">
import { indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { EditorState, Transaction } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CursorPosition } from '@/types/document'

const props = defineProps<{
  content: string
}>()

const emit = defineEmits<{
  'update:content': [content: string]
  cursorChange: [position: CursorPosition]
  save: []
}>()

const editorHost = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

function currentCursorPosition(view: EditorView): CursorPosition {
  const head = view.state.selection.main.head
  const line = view.state.doc.lineAt(head)

  return {
    line: line.number,
    column: head - line.from + 1
  }
}

onMounted(() => {
  if (!editorHost.value) {
    return
  }

  const state = EditorState.create({
    doc: props.content,
    extensions: [
      keymap.of([
        {
          key: 'Mod-s',
          preventDefault: true,
          run() {
            emit('save')
            return true
          }
        },
        indentWithTab
      ]),
      basicSetup,
      markdown(),
      placeholder('Start writing...'),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:content', update.state.doc.toString())
        }

        if (update.docChanged || update.selectionSet) {
          emit('cursorChange', currentCursorPosition(update.view))
        }
      })
    ]
  })

  editorView = new EditorView({
    state,
    parent: editorHost.value
  })

  emit('cursorChange', currentCursorPosition(editorView))
})

watch(
  () => props.content,
  (content) => {
    if (!editorView || editorView.state.doc.toString() === content) {
      return
    }

    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: content
      },
      annotations: Transaction.addToHistory.of(false)
    })
  }
)

onBeforeUnmount(() => {
  editorView?.destroy()
  editorView = null
})
</script>

<template>
  <div ref="editorHost" class="markdown-editor" />
</template>
