<script setup lang="ts">
import { ref } from 'vue'
import type { KunCheckBoxGroupOption, KunCheckBoxGroupInvalidReason } from '@kungal/ui-vue'

const tags = ref(['纯爱'])
const blocked = ref('')
const options: KunCheckBoxGroupOption[] = [
  { value: '纯爱', label: '纯爱' },
  { value: '治愈', label: '治愈' },
  { value: '悬疑', label: '悬疑' },
  { value: '喜剧', label: '喜剧' },
  { value: '奇幻', label: '奇幻' },
]

const onInvalid = (reason: KunCheckBoxGroupInvalidReason) => {
  blocked.value = reason === 'max-reached' ? '最多只能选 3 个标签' : ''
  window.setTimeout(() => (blocked.value = ''), 1600)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <KunCheckBoxGroup
      v-model="tags"
      :options="options"
      :max="3"
      variant="pill"
      orientation="horizontal"
      label="题材标签（最多 3 个）"
      @invalid="onInvalid"
    />
    <p class="text-warning h-5 text-sm">{{ blocked }}</p>
  </div>
</template>
