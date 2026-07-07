<script setup lang="ts">
import { ref } from 'vue'
import type { KunAutocompleteOption } from '@kungal/ui-vue'

// Pretend this lives on a server; we filter + delay it to fake a network call.
const DB: KunAutocompleteOption[] = [
  { value: 'tokyo', label: '東京 Tokyo' },
  { value: 'osaka', label: '大阪 Osaka' },
  { value: 'kyoto', label: '京都 Kyoto' },
  { value: 'sapporo', label: '札幌 Sapporo' },
  { value: 'nagoya', label: '名古屋 Nagoya' },
  { value: 'fukuoka', label: '福岡 Fukuoka' },
  { value: 'kobe', label: '神戸 Kobe' },
]

const text = ref('') // v-model = the input text
const picked = ref<string | number | null>(null) // the confirmed value (kept by us)
const options = ref<KunAutocompleteOption[]>([])
const loading = ref(false)

// A monotonically increasing id so a slow response can't overwrite a newer one.
let reqId = 0
const onSearch = async (q: string) => {
  const query = q.trim().toLowerCase()
  if (!query) {
    options.value = []
    loading.value = false
    return
  }
  const mine = ++reqId
  loading.value = true
  await new Promise((r) => setTimeout(r, 700)) // fake latency
  if (mine !== reqId) return // a newer search superseded this one — drop it
  options.value = DB.filter((o) => o.label.toLowerCase().includes(query))
  loading.value = false
}

const onSelect = (opt: KunAutocompleteOption) => {
  picked.value = opt.value // click / Enter confirms → we get the value here
}
</script>

<template>
  <div class="max-w-xs">
    <KunAutocomplete
      v-model="text"
      :options="options"
      :loading="loading"
      :debounce="300"
      manual-filter
      :allow-custom-value="false"
      label="搜索城市（远程）"
      placeholder="输入城市名…"
      @search="onSearch"
      @select="onSelect"
    />
    <p class="text-default-500 mt-2 text-sm">
      confirmed value: <code>{{ picked ?? '—' }}</code>
    </p>
  </div>
</template>
