<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Remote source: `manualFilter` hands filtering to you, `@search` carries the
// query (debounced by `debounce`), and `loading` keeps the list showing a
// spinner instead of "无匹配项" while the request is in flight.
const CATALOG: KunSelectOption[] = [
  { value: 'clannad', label: 'CLANNAD' },
  { value: 'kanon', label: 'Kanon' },
  { value: 'air', label: 'AIR' },
  { value: 'little-busters', label: 'Little Busters!' },
  { value: 'rewrite', label: 'Rewrite' },
  { value: 'summer-pockets', label: 'Summer Pockets' },
  { value: 'steins-gate', label: 'STEINS;GATE' },
  { value: 'chaos-head', label: 'CHAOS;HEAD' },
  { value: 'robotics-notes', label: 'ROBOTICS;NOTES' },
  { value: 'muv-luv', label: 'Muv-Luv' },
  { value: 'fate-stay-night', label: 'Fate/stay night' },
  { value: 'tsukihime', label: '月姫' },
]

const selected = ref<string[]>([])
const options = ref<KunSelectOption[]>([])
const loading = ref(false)

// A stale response must never overwrite a newer one — the last query wins, and
// `loading` stays true until the newest request lands.
let seq = 0
const onSearch = async (query: string) => {
  const mine = ++seq
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 450))
  if (mine !== seq) return
  const q = query.trim().toLowerCase()
  options.value = CATALOG.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 6)
  loading.value = false
}
</script>

<template>
  <div class="max-w-sm">
    <KunSelect
      v-model="selected"
      :options="options"
      label="收录作品"
      placeholder="搜索作品名"
      :multiple="true"
      :searchable="true"
      :manual-filter="true"
      :loading="loading"
      :debounce="300"
      search-placeholder="输入至少一个字…"
      no-result-text="没有匹配的作品"
      @search="onSearch"
    />
    <p class="text-default-500 mt-2 text-sm">
      已选 {{ selected.length }} 项：{{ selected.join('、') || '—' }}
    </p>
    <p class="text-default-500 mt-1 text-xs">
      选中一项后再搜别的词——标签不会丢，组件为当前选中的值保留了最后一次见到的 option。
    </p>
  </div>
</template>
