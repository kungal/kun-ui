<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

// `size` scales the track thickness and thumb diameter.
const v = ref(50)
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid w-full max-w-md gap-6">
    <div v-for="s in sizes" :key="s">
      <p class="text-default-600 mb-1 text-sm">{{ s }}</p>
      <KunSlider v-model="v" :size="s" />
    </div>
  </div>
</template>
