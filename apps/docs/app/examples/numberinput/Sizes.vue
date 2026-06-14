<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

const v = ref<number | null>(5)
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid max-w-xs gap-3">
    <KunNumberInput
      v-for="s in sizes"
      :key="s"
      v-model="v"
      :size="s"
      :label="s"
      :min="0"
    />
  </div>
</template>
