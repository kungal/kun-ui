<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

// A single option can be disabled (`disabled: true`), or the whole control.
const value = ref('vue')
const disabledValue = ref('react')
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular', disabled: true },
]
</script>

<template>
  <div class="flex max-w-xs flex-col gap-4">
    <KunSelect
      v-model="value"
      :options="options"
      label="禁用选项 (Angular)"
    />
    <KunSelect
      v-model="disabledValue"
      :options="options"
      label="禁用整个组件"
      :disabled="true"
    />
  </div>
</template>
