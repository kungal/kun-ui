<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunRadioOption[] = [
  { value: 'vue', label: 'Vue', description: 'The progressive framework' },
  { value: 'react', label: 'React', description: 'A library for web UIs' },
  { value: 'svelte', label: 'Svelte', description: 'A compile-time framework' },
]
</script>

<template>
  <KunRadioGroup v-model="value" :options="options" label="Framework" />
</template>
