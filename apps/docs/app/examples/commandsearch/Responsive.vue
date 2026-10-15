<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KunCommandItem } from '@kungal/ui-vue'

// One query and one item list feed both: the field from md up, the palette's
// icon button below it. Breakpoint classes pick which one is on screen, so the
// server renders the right one for every width.
const PAGES: KunCommandItem[] = [
  { value: 'senren', label: '千恋＊万花', description: 'ゆずソフト · 2016', icon: 'lucide:image' },
  { value: 'sabbat', label: '魔女的夜宴', description: 'ゆずソフト · 2015', icon: 'lucide:image' },
  { value: 'pockets', label: 'Summer Pockets', description: 'Key · 2018', icon: 'lucide:image' },
  { value: 'sakura', label: '樱之诗', description: '枕 · 2015', icon: 'lucide:image' },
]

const query = ref('')
const open = ref(false)
const last = ref('—')

const items = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? PAGES.filter((p) => `${p.label} ${p.description}`.toLowerCase().includes(q)) : []
})

const onSelect = (item: KunCommandItem) => (last.value = `打开:${item.label}`)
const onSubmit = (q: string) => {
  last.value = `前往搜索页:${q}`
  open.value = false
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div
      class="bg-content1 border-kun rounded-kun-lg flex items-center gap-4 border px-4 py-2.5"
    >
      <span class="text-foreground shrink-0 font-semibold">KunGalgame</span>
      <KunCommandSearch
        v-model:query="query"
        :items="items"
        :shortcut="false"
        placeholder="搜索 Galgame…"
        class-name="hidden max-w-80 md:block"
        @select="onSelect"
        @submit="onSubmit"
      />
      <KunCommandPalette
        v-model:open="open"
        v-model:query="query"
        :items="items"
        :shortcut="false"
        placeholder="搜索 Galgame…"
        @select="onSelect"
        @submit="onSubmit"
      >
        <template #trigger="{ open: openPalette }">
          <KunButton
            variant="light"
            size="sm"
            is-icon-only
            aria-label="搜索"
            class-name="ml-auto md:hidden"
            @click="openPalette"
          >
            <KunIcon name="lucide:search" />
          </KunButton>
        </template>
      </KunCommandPalette>
    </div>
    <p class="text-foreground-muted text-sm">最近一次:{{ last }}</p>
  </div>
</template>
