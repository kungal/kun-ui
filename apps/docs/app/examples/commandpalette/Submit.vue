<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KunCommandItem } from '@kungal/ui-vue'

const open = ref(false)
const query = ref('')
const last = ref('')

const PAGES: KunCommandItem[] = [
  {
    value: '/components/button',
    label: 'KunButton',
    section: '组件',
    description: '按钮:七种变体、五档尺寸、加载态与图标位',
    icon: 'lucide:book-open',
  },
  {
    value: '/components/modal',
    label: 'KunModal',
    section: '组件',
    description: '模态框:焦点陷阱、滚动锁、size 决定宽度',
    icon: 'lucide:book-open',
  },
  {
    value: '/guide/install',
    label: '安装与接入',
    section: '指南',
    description: 'Tailwind v4 @source 配置、Nuxt layer、按需引入',
    icon: 'lucide:file-plus',
  },
]

const items = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return PAGES
  return PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
  )
})

// Fires only when Enter has nothing to select — no results, or every result
// disabled. Here it stands in for "go to the full search page".
const onSubmit = (q: string) => {
  last.value = q
  open.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunCommandPalette
      v-model:open="open"
      v-model:query="query"
      :items="items"
      :shortcut="false"
      placeholder="搜索文档…"
      @select="(i: KunCommandItem) => (last = String(i.value))"
      @submit="onSubmit"
    >
      <template #trigger="{ open }">
        <KunButton variant="bordered" @click="open">搜索文档</KunButton>
      </template>

      <!-- Give the fallback an affordance: the shell only emits, the wording is
           yours. Try a query that matches nothing, then press Enter. -->
      <template #no-result="{ query: q }">
        <div class="px-3 py-6 text-center">
          <p class="text-default-500 text-sm">没有匹配的页面</p>
          <p class="text-default-400 mt-1.5 text-xs">
            按 <kbd class="text-default-600">↵</kbd> 全站搜索「{{ q }}」
          </p>
        </div>
      </template>
    </KunCommandPalette>

    <span class="text-default-500 text-sm">最近一次:{{ last || '—' }}</span>
  </div>
</template>
