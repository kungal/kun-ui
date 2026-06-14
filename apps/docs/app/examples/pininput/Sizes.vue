<script setup lang="ts">
import { ref } from 'vue'
import type { KunUISize } from '@kungal/ui-core'

const pin = ref('')
const sizes: KunUISize[] = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="grid gap-4">
    <div v-for="s in sizes" :key="s">
      <p class="text-default-700 mb-1 text-sm font-medium">{{ s }}</p>
      <KunPinInput v-model="pin" :length="4" :size="s" />
    </div>
  </div>
</template>
