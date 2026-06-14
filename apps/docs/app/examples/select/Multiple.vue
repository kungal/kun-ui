<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// Multiple selection: v-model is an array. Pair with `searchable` to filter.
const value = ref<string[]>(['vue', 'solid'])
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
]
</script>

<template>
  <div class="max-w-xs">
    <KunSelect
      v-model="value"
      :options="options"
      label="Frameworks"
      :multiple="true"
      :searchable="true"
    />
    <p class="text-default-500 mt-2 text-sm">值: {{ value.join(', ') || '—' }}</p>
  </div>
</template>
