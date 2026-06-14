<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('home')
// A single item can be disabled via `disabled: true`; the whole group can be
// disabled via the `disabled` prop on <KunTab>.
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home' },
  { value: 'docs', textValue: 'Docs' },
  { value: 'settings', textValue: 'Settings', disabled: true },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">item disabled</span>
      <KunTab v-model="active" :items="items" variant="solid" />
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-default-500 text-xs uppercase">group disabled</span>
      <KunTab v-model="active" :items="items" variant="solid" disabled />
    </div>
  </div>
</template>
