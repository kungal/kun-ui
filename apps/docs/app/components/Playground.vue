<script setup lang="ts">
// The live KunUI playground: edit a single-file component on the left, see it
// rendered on the right. The whole thing is client-only — it compiles the SFC
// in the browser (compileSfc lazy-loads @vue/compiler-sfc) and mounts the result
// via `<component :is>` inside this app tree, so every <KunButton> resolves
// against the globally-registered KunUI set and overlays/teleports work exactly
// as they do in a real app.
import {
  markRaw,
  onBeforeUnmount,
  onErrorCaptured,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import type { Component } from 'vue'
import { compileSfc } from '~/utils/compileSfc'

const props = withDefaults(
  defineProps<{ modelValue: string; height?: string }>(),
  { height: '460px' }
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const code = ref(props.modelValue)
// Let the parent swap the whole document (load an example / template) without
// fighting the user's keystrokes.
watch(
  () => props.modelValue,
  (val) => {
    if (val !== code.value) code.value = val
  }
)
watch(code, (val) => emit('update:modelValue', val))

const rendered = shallowRef<Component | null>(null)
const renderKey = ref(0)
const compileError = ref<string | null>(null)
const runtimeError = ref<string | null>(null)
const compiling = ref(false)

// A dedicated <style> element holds the SFC's compiled (scoped) CSS.
let styleEl: HTMLStyleElement | null = null

// Runtime render errors from the compiled component bubble up here. Returning
// false stops them from crashing the docs app; the next successful compile
// remounts a fresh subtree (renderKey bump) and clears the message.
onErrorCaptured((err) => {
  runtimeError.value = err instanceof Error ? err.message : String(err)
  return false
})

let token = 0
let timer: ReturnType<typeof setTimeout> | null = null

const run = async () => {
  const mine = ++token
  compiling.value = true
  const { component, css, error } = await compileSfc(code.value)
  if (mine !== token) return // a newer edit superseded this run
  compiling.value = false

  if (error) {
    compileError.value = error
    return
  }
  compileError.value = null
  runtimeError.value = null
  if (styleEl) styleEl.textContent = css
  rendered.value = component ? markRaw(component) : null
  renderKey.value++
}

const schedule = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(run, 280)
}

watch(code, schedule)

onMounted(() => {
  styleEl = document.createElement('style')
  styleEl.setAttribute('data-kun-playground', '')
  document.head.appendChild(styleEl)
  run()
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  token++ // invalidate any in-flight compile
  styleEl?.remove()
})

const reset = () => {
  code.value = props.modelValue
}
</script>

<template>
  <div
    class="border-default-200 rounded-kun-lg bg-background overflow-hidden border"
  >
    <!-- Toolbar -->
    <div
      class="border-default-200 bg-content1/60 flex items-center justify-between gap-2 border-b px-3 py-1.5"
    >
      <div class="flex items-center gap-2">
        <span class="text-default-500 text-xs">Playground.vue</span>
        <span
          v-if="compiling"
          class="text-default-400 text-xs"
          aria-live="polite"
          >编译中…</span
        >
      </div>
      <div class="flex items-center gap-1.5">
        <KunButton size="sm" variant="light" @click="reset">重置</KunButton>
        <KunCopy :text="code" name="复制代码" variant="flat" color="default" />
      </div>
    </div>

    <!-- Editor + preview -->
    <div
      class="divide-default-200 grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0"
      :style="{ minHeight: height }"
    >
      <!-- Editor -->
      <div class="min-w-0" :style="{ height }">
        <CodeEditor v-model="code" />
      </div>

      <!-- Preview -->
      <div class="relative min-w-0" :style="{ height }">
        <div class="h-full overflow-auto p-6">
          <component
            :is="rendered"
            v-if="rendered && !compileError"
            :key="renderKey"
          />
        </div>

        <!-- Compile / runtime error overlay -->
        <div
          v-if="compileError || runtimeError"
          class="absolute inset-x-0 bottom-0 max-h-[55%] overflow-auto border-t border-red-300/60 bg-red-50/95 p-4 text-sm dark:border-red-500/30 dark:bg-red-950/80"
        >
          <p class="mb-1 font-semibold text-red-600 dark:text-red-400">
            {{ compileError ? '编译错误' : '运行时错误' }}
          </p>
          <pre
            class="text-red-700 dark:text-red-300"
            style="white-space: pre-wrap; word-break: break-word"
            >{{ compileError || runtimeError }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>
