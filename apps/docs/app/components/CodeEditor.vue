<script setup lang="ts">
// A thin CodeMirror 6 wrapper: v-model<string>, Vue-SFC syntax highlighting,
// and a light/dark theme that follows the site's `.kun-dark-mode` toggle. Used
// by the Playground. Mounted client-only (CodeMirror touches the DOM), so the
// editor packages stay out of the server bundle.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentOnInput,
} from '@codemirror/language'
import { closeBrackets } from '@codemirror/autocomplete'
import { vue } from '@codemirror/lang-vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const host = ref<HTMLElement | null>(null)
let view: EditorView | null = null
const themeComp = new Compartment()

// Token colors are inherited from Shiki's `github-light` palette (used by the
// read-only Code blocks) so the editor and the highlighted source match. Dark
// mode swaps a few surface colors; tokens stay readable on the dark surface.
const baseTheme = (dark: boolean) =>
  EditorView.theme(
    {
      '&': {
        fontSize: '13px',
        backgroundColor: dark ? '#0d1117' : '#ffffff',
        color: dark ? '#e6edf3' : '#1f2328',
        height: '100%',
      },
      '.cm-scroller': {
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
        lineHeight: '1.7',
      },
      '.cm-content': { padding: '14px 0' },
      '.cm-gutters': {
        backgroundColor: dark ? '#0d1117' : '#ffffff',
        color: dark ? '#484f58' : '#8c959f',
        border: 'none',
      },
      '.cm-activeLine': {
        backgroundColor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
      },
      '.cm-activeLineGutter': { backgroundColor: 'transparent' },
      '&.cm-focused': { outline: 'none' },
      '.cm-cursor': { borderLeftColor: dark ? '#e6edf3' : '#1f2328' },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
        { backgroundColor: dark ? '#264f78' : '#b3d4fc' },
    },
    { dark }
  )

const isDark = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('kun-dark-mode')

let observer: MutationObserver | null = null

onMounted(() => {
  if (!host.value) return

  view = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        lineNumbers(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        vue(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.lineWrapping,
        themeComp.of(baseTheme(isDark())),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) emit('update:modelValue', u.state.doc.toString())
        }),
      ],
    }),
  })

  // Follow the global dark-mode toggle (class on <html>).
  observer = new MutationObserver(() => {
    view?.dispatch({ effects: themeComp.reconfigure(baseTheme(isDark())) })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

// Keep the editor in sync when the parent replaces the source (reset, load
// example) — but ignore echoes of the user's own typing.
watch(
  () => props.modelValue,
  (val) => {
    if (view && val !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: val },
      })
    }
  }
)

onBeforeUnmount(() => {
  observer?.disconnect()
  view?.destroy()
  view = null
})
</script>

<template>
  <div ref="host" class="kun-code-editor h-full overflow-auto" />
</template>
