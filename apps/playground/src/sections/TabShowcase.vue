<script setup lang="ts">
import { reactive, ref } from 'vue'
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

// #tab slot — per-tab badge / dot (extra fields on the item, typed in the slot)
type BadgeTab = KunTabItem & { count?: number; dirty?: boolean }
const badgeTab = ref('inbox')
const badgeItems: BadgeTab[] = [
  { value: 'inbox', textValue: 'Inbox', icon: 'lucide:check', count: 3 },
  { value: 'drafts', textValue: 'Drafts', dirty: true },
  { value: 'sent', textValue: 'Sent' },
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

// lazy-loading / loading demo
const lazyTab = ref('overview')
const lazyItems: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]
type PanelState = { data: string | null; loading: boolean }
const lazyState = reactive<Record<string, PanelState>>({
  overview: { data: null, loading: false },
  specs: { data: null, loading: false },
  reviews: { data: null, loading: false },
})
// Long-ish latency so the dim (0.5 opacity) is easy to see on a refresh.
const fetchLazy = (value: string) => {
  const panel = lazyState[value]!
  panel.loading = true
  setTimeout(() => {
    panel.data = `Loaded "${value}" at ${new Date().toLocaleTimeString()}`
    panel.loading = false
  }, 1200)
}
const onLazyChange = (value: string) => {
  const panel = lazyState[value]!
  if (panel.data === null && !panel.loading) fetchLazy(value)
}
onLazyChange(lazyTab.value)
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

    <h3 class="mt-2 text-base font-medium">Per-tab badge / dot (#tab slot)</h3>
    <KunTab v-model="badgeTab" :items="badgeItems" variant="light">
      <template #tab="{ item }">
        <span>{{ item.textValue }}</span>
        <KunBadge v-if="item.count" variant="count" :count="item.count" color="primary" />
        <KunBadge v-else-if="item.dirty" variant="dot" color="danger" />
      </template>
    </KunTab>

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

    <h3 class="mt-2 text-base font-medium">
      Lazy loading + loading state (mount=lazy, :loading dim)
    </h3>
    <p class="text-default-500 text-sm">
      First open of a tab fetches (~1.2s) and shows a skeleton — nothing to dim
      yet. Once loaded, hit <em>Refresh</em>: the panel dims to 0.5 opacity and
      goes inert instead of flashing a skeleton. Fast tab switches never flicker
      (the dim has a 0.2s delay).
    </p>
    <KunTab
      v-model="lazyTab"
      :items="lazyItems"
      variant="light"
      color="secondary"
      name="lazy"
      @change="onLazyChange"
    />
    <KunTabPanels v-model="lazyTab" name="lazy" mount="lazy" class="mt-2">
      <KunTabPanel
        v-for="item in lazyItems"
        :key="item.value"
        :value="item.value"
        :loading="lazyState[item.value]!.loading && lazyState[item.value]!.data !== null"
      >
        <!-- First load: skeleton at full opacity — don't pass `loading` (it would
             dim the skeleton). The dim is only for revalidating existing content. -->
        <div
          v-if="lazyState[item.value]!.data === null"
          class="flex flex-col gap-2"
        >
          <KunSkeleton variant="text" width="70%" />
          <KunSkeleton variant="text" />
          <KunSkeleton variant="text" width="40%" />
        </div>
        <div v-else class="text-default-600 flex flex-col gap-3 text-sm">
          <p>{{ lazyState[item.value]!.data }}</p>
          <KunButton
            size="sm"
            variant="flat"
            class="self-start"
            @click="fetchLazy(item.value)"
          >
            Refresh
          </KunButton>
        </div>
      </KunTabPanel>
    </KunTabPanels>

    <h3 class="mt-2 text-base font-medium">Tab as route (href → real anchor)</h3>
    <KunTab v-model="routeTab" :items="routeItems" variant="pills" />
  </section>
</template>
