<script setup lang="ts">
import { ref } from 'vue'
import type { KunRadioOption } from '@kungal/ui-vue'

const value = ref('s')
const options: KunRadioOption[] = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <KunRadioGroup
      v-model="value"
      orientation="horizontal"
      label="水平排列（horizontal）"
      :options="options"
    />
    <KunRadioGroup
      v-model="value"
      orientation="vertical"
      label="垂直排列（vertical，默认）"
      :options="options"
    />
  </div>
</template>
