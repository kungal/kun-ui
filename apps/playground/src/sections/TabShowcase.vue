<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem, KunTabVariant } from '@kungal/ui-vue'

const tab = ref('home')
const items: KunTabItem[] = [
  { value: 'home', textValue: 'Home', icon: 'lucide:check' },
  { value: 'docs', textValue: 'Docs', icon: 'lucide:copy' },
  { value: 'settings', textValue: 'Settings' },
  { value: 'off', textValue: 'Disabled', disabled: true },
]
const variants: KunTabVariant[] = [
  'underlined',
  'solid',
  'bordered',
  'light',
  'pills',
]
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Tab</h2>
    <p class="text-default-500 text-sm">
      Sliding indicator, full keyboard nav (arrows / Home / End). Icons render
      from the bundled set.
    </p>

    <div class="flex flex-col gap-3">
      <div v-for="v in variants" :key="v" class="flex flex-col gap-1">
        <span class="text-default-500 text-xs uppercase">{{ v }}</span>
        <KunTab v-model="tab" :items="items" :variant="v" />
      </div>
    </div>

    <h3 class="mt-2 text-base font-medium">Vertical</h3>
    <KunTab
      v-model="tab"
      :items="items"
      orientation="vertical"
      variant="light"
      color="secondary"
    />
  </section>
</template>
