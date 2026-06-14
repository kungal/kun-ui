<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabVariant } from '@kungal/ui-vue'

const active = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings' },
]
const variants: KunTabVariant[] = [
  'underlined',
  'solid',
  'light',
  'bordered',
  'pills',
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="v in variants" :key="v" class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">{{ v }}</span>
      <KunTab v-model="active" :items="items" :variant="v" />
    </div>
  </div>
</template>
