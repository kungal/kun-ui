<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:home' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:book-open' },
  { value: 'settings', textValue: 'Settings', icon: 'lucide:settings' },
]
</script>

<template>
  <KunTab
    v-model="active"
    :items="items"
    orientation="vertical"
    variant="light"
    color="secondary"
  />
</template>
