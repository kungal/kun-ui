<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:home' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:book-open' },
  { value: 'settings', textValue: 'Settings', icon: 'lucide:settings' },
]
const aligns = ['start', 'center', 'end'] as const
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row">
    <div v-for="a in aligns" :key="a" class="flex w-40 flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ a }}</span>
      <KunTab
        v-model="active"
        :items="items"
        orientation="vertical"
        variant="light"
        full-width
        :align="a"
      />
    </div>
  </div>
</template>
