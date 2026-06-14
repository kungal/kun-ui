<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` tints the focus ring. Click into each field to see the difference.
const v = ref<number | null>(5)
const colors: KunUIColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
</script>

<template>
  <div class="grid max-w-xs gap-3">
    <KunNumberInput
      v-for="c in colors"
      :key="c"
      v-model="v"
      :color="c"
      :label="c"
      :min="0"
    />
  </div>
</template>
