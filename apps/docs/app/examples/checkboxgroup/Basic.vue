<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption } from '@kungal/ui-vue'

const platforms = ref(['windows'])
const options: KunCheckBoxGroupOption[] = [
  { value: 'windows', label: 'Windows', description: '原生 exe，最常见的发布形式' },
  { value: 'android', label: 'Android', description: '移植版 apk' },
  { value: 'ios', label: 'iOS', description: '需要自签或 TestFlight' },
  { value: 'linux', label: 'Linux', description: '多数需要 Wine' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunCheckBoxGroup v-model="platforms" :options="options" label="支持平台" />
    <p class="text-default-500 text-sm">已选：{{ platforms.join('、') || '（无）' }}</p>
  </div>
</template>
