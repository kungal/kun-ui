<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` tints the focus ring of each cell.
const pin = ref('')
const colors: KunUIColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
]
</script>

<template>
  <div class="grid gap-4">
    <div v-for="c in colors" :key="c">
      <p class="text-default-700 mb-1 text-sm font-medium">{{ c }}</p>
      <KunPinInput v-model="pin" :length="4" :color="c" />
    </div>
  </div>
</template>
