<script setup lang="ts">
import { ref } from 'vue'
import type { KunUIColor } from '@kungal/ui-core'

// `color` sets the fill + thumb + halo tone.
const v = ref(60)
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
  <div class="grid w-full max-w-md gap-5">
    <div v-for="c in colors" :key="c">
      <p class="text-default-600 mb-1 text-sm">{{ c }}</p>
      <KunSlider v-model="v" :color="c" />
    </div>
  </div>
</template>
