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

// SEO-friendly panels demo
const panelTab = ref('overview')
const panelItems: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]

// tab-as-route demo (href → real <a>)
const routeTab = ref('a')
const routeItems: KunTabItem[] = [
  { value: 'a', textValue: 'Section A', href: '#a' },
  { value: 'b', textValue: 'Section B', href: '#b' },
  { value: 'c', textValue: 'Section C', href: '#c' },
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

    <h3 class="mt-2 text-base font-medium">SEO-friendly panels (mount=eager)</h3>
    <KunTab v-model="panelTab" :items="panelItems" variant="light" name="demo" />
    <KunTabPanels v-model="panelTab" name="demo" class="mt-2">
      <KunTabPanel value="overview" class="text-default-600 text-sm">
        Overview — server-rendered into the HTML, indexable even when not active.
      </KunTabPanel>
      <KunTabPanel value="specs" class="text-default-600 text-sm">
        Specs — hidden="until-found" while inactive (findable via Ctrl+F).
      </KunTabPanel>
      <KunTabPanel value="reviews" class="text-default-600 text-sm">
        Reviews — also server-rendered; deep-linkable via text fragments.
      </KunTabPanel>
    </KunTabPanels>

    <h3 class="mt-2 text-base font-medium">Tab as route (href → real anchor)</h3>
    <KunTab v-model="routeTab" :items="routeItems" variant="pills" />
  </section>
</template>
