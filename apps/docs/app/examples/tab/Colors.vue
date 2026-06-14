<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabColor } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const colors: KunTabColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'default',
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="c in colors" :key="c" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ c }}</span>
      <KunTab v-model="active" :items="items" :color="c" variant="pills" />
    </div>
  </div>
</template>
