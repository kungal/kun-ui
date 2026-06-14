<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('b')
const options: KunRadioOption[] = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <KunRadioGroup v-model="value" color="primary" label="primary" :options="options" />
    <KunRadioGroup v-model="value" color="secondary" label="secondary" :options="options" />
    <KunRadioGroup v-model="value" color="success" label="success" :options="options" />
    <KunRadioGroup v-model="value" color="warning" label="warning" :options="options" />
    <KunRadioGroup v-model="value" color="danger" label="danger" :options="options" />
  </div>
</template>
