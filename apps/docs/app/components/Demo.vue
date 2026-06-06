<script setup lang="ts">
import { ref } from 'vue'

// A live example + its source. The source is passed in (extracted at build time
// via Vite's `?raw` import on the example file), so the shown code can NEVER
// drift from the rendered demo. The chrome is built from KunUI components.
withDefaults(defineProps<{ title?: string; source: string }>(), { title: '' })

const show = ref(false)
</script>

<template>
  <div class="border-default-200 rounded-kun-lg my-5 overflow-hidden border">
    <!-- Live render -->
    <div class="bg-background flex flex-wrap items-center gap-3 p-6">
      <slot />
    </div>

    <!-- Toolbar -->
    <div
      class="border-default-200 bg-content1/60 flex items-center justify-between border-t px-3 py-1.5"
    >
      <span class="text-default-500 text-xs">{{ title }}</span>
      <KunButton size="sm" variant="light" @click="show = !show">
        {{ show ? '隐藏代码' : '查看代码' }}
      </KunButton>
    </div>

    <!-- Source (kept mounted so it prerenders; toggled with v-show) -->
    <div v-show="show" class="border-default-200 border-t">
      <Code :code="source" lang="vue" />
    </div>
  </div>
</template>
