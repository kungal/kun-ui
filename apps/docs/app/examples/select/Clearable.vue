<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// `clearable` adds a button to reset the value back to null.
const value = ref<string | null>('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <KunSelect
    v-model="value"
    :options="options"
    label="Framework"
    :clearable="true"
    placeholder="None selected"
    class-name="max-w-xs"
  />
</template>
