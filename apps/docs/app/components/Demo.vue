<script setup lang="ts">
import { ref } from 'vue'

// A live example + its source. The source is passed in (extracted at build time
// via Vite's `?raw` import on the example file), so the shown code can NEVER
// drift from the rendered demo. The chrome is built from KunUI components.
const props = withDefaults(defineProps<{ title?: string; source: string }>(), {
  title: '',
})

const show = ref(false)

// Hand this example's source to the Playground. sessionStorage (not a URL
// param) keeps the link clean and avoids encoding a whole SFC into the URL.
const editInPlayground = () => {
  sessionStorage.setItem('kun-playground-source', props.source)
  navigateTo('/playground')
}
</script>

<template>
  <div class="border-default-200 rounded-kun-lg my-5 overflow-hidden border">
    <!-- Live render — a soft panel (content1 @ 60% over the page) for the demo. -->
    <div class="bg-content1/60 flex flex-wrap items-center gap-3 p-6">
      <slot />
    </div>

    <!-- Toolbar -->
    <div
      class="border-default-200 bg-content1/60 flex items-center justify-between border-t px-3 py-1.5"
    >
      <span class="text-default-500 text-xs">{{ title }}</span>
      <div class="flex items-center gap-1">
        <KunButton size="sm" variant="light" @click="editInPlayground">
          在 Playground 中编辑
        </KunButton>
        <KunButton size="sm" variant="light" @click="show = !show">
          {{ show ? '隐藏代码' : '查看代码' }}
        </KunButton>
      </div>
    </div>

    <!-- Source (kept mounted so it prerenders; toggled with v-show) -->
    <div v-show="show" class="border-default-200 border-t">
      <Code :code="source" lang="vue" />
    </div>
  </div>
</template>
