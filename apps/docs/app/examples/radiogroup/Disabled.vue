<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const groupValue = ref('react')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte（禁用）', disabled: true },
]
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <KunRadioGroup v-model="value" label="禁用单个选项" :options="options" />
    <KunRadioGroup v-model="groupValue" label="整组禁用" disabled :options="options" />
  </div>
</template>
