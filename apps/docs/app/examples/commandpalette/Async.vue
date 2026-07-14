<script setup lang="ts">
import { ref, watch } from 'vue'
import type { KunCommandItem } from '@kungal/ui-vue'

const open = ref(false)
const query = ref('')
const picked = ref('')
const items = ref<KunCommandItem[]>([])
const loading = ref(false)

// Pretend remote data — filter + delay to fake a network request.
const DB: KunCommandItem[] = [
  { value: 'tokyo', label: '東京 Tokyo', description: 'Japan · Kantō', icon: 'lucide:map-pin' },
  { value: 'osaka', label: '大阪 Osaka', description: 'Japan · Kansai', icon: 'lucide:map-pin' },
  { value: 'kyoto', label: '京都 Kyoto', description: 'Japan · Kansai', icon: 'lucide:map-pin' },
  { value: 'sapporo', label: '札幌 Sapporo', description: 'Japan · Hokkaidō', icon: 'lucide:map-pin' },
]

// A monotonic id so a slow response can't overwrite a newer query.
let reqId = 0
watch(query, async (q) => {
  const term = q.trim().toLowerCase()
  if (!term) {
    items.value = []
    loading.value = false
    return
  }
  const mine = ++reqId
  loading.value = true
  await new Promise((r) => setTimeout(r, 600)) // fake latency
  if (mine !== reqId) return // superseded
  items.value = DB.filter((c) => c.label.toLowerCase().includes(term))
  loading.value = false
})
</script>

<template>
  <div class="flex items-center gap-3">
    <KunCommandPalette
      v-model:open="open"
      v-model:query="query"
      :items="items"
      :loading="loading"
      :shortcut="false"
      placeholder="搜索城市…(远程)"
      empty-text="输入城市名开始搜索"
      @select="(i: KunCommandItem) => (picked = String(i.value))"
    >
      <template #trigger="{ open }">
        <KunButton variant="bordered" @click="open">远程搜索</KunButton>
      </template>
    </KunCommandPalette>
    <span class="text-default-500 text-sm">选中:{{ picked || '—' }}</span>
  </div>
</template>
