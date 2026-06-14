<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Passing `error` marks the field invalid and shows the message below it.
const value = ref<string | null>(null)
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <KunSelect
    v-model="value"
    :options="options"
    label="Framework"
    placeholder="请选择"
    error="此项为必填项"
    class-name="max-w-xs"
  />
</template>
