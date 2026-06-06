<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const tab = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'features', textValue: 'Features' },
  { value: 'pricing', textValue: 'Pricing' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <KunTab v-model="tab" :items="items" />
    <p class="text-default-600 mt-3 text-sm">Active tab: {{ tab }}</p>
  </div>
</template>
