<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <KunSelect v-model="value" :options="options" label="Framework" class-name="max-w-xs" />
</template>
