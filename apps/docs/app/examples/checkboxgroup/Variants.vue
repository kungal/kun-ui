<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const a = ref(['galgame'])
const b = ref(['galgame', 'anime'])
const c = ref(['anime'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'galgame', label: 'Galgame' },
  { value: 'anime', label: '动画' },
  { value: 'manga', label: '漫画' },
  { value: 'novel', label: '轻小说' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunCheckBoxGroup v-model="a" :options="options" label="classic" />
    <KunCheckBoxGroup v-model="b" :options="options" label="pill" variant="pill" orientation="horizontal" />
    <KunCheckBoxGroup v-model="c" :options="options" label="card" variant="card" orientation="horizontal" />
  </div>
</template>
