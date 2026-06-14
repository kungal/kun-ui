<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// `color` themes the focus ring / accent. Added in 0.22.0.
const value = ref('vue')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunSelect v-model="value" :options="options" color="primary" label="primary" />
    <KunSelect v-model="value" :options="options" color="secondary" label="secondary" />
    <KunSelect v-model="value" :options="options" color="success" label="success" />
    <KunSelect v-model="value" :options="options" color="warning" label="warning" />
    <KunSelect v-model="value" :options="options" color="danger" label="danger" />
    <KunSelect v-model="value" :options="options" color="info" label="info" />
  </div>
</template>
