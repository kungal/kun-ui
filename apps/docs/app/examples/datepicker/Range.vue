<script setup lang="ts">
import { ref } from 'vue'
const range = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <div class="max-w-xs">
    <KunDatePicker v-model="range" mode="range" label="选择日期范围" />
    <p class="text-default-600 mt-2 text-sm">起始：{{ range[0] || '—' }}</p>
    <p class="text-default-600 text-sm">结束：{{ range[1] || '—' }}</p>
  </div>
</template>
