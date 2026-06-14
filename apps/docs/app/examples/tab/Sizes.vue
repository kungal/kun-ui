<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabSize } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const sizes: KunTabSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="s in sizes" :key="s" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ s }}</span>
      <KunTab v-model="active" :items="items" :size="s" variant="solid" />
    </div>
  </div>
</template>
