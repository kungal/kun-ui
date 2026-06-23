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
  <div class="flex gap-10">
    <KunTab
      v-model="active"
      :items="items"
      orientation="vertical"
      variant="underlined"
      color="primary"
    />
    <KunTab
      v-model="active"
      :items="items"
      orientation="vertical"
      variant="light"
      color="secondary"
    />
  </div>
</template>
