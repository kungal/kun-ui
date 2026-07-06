<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]

// Per-tab async state: `data` is null until the first fetch resolves; `loading`
// is true while any fetch (first load OR a refresh) is in flight.
type PanelState = { data: string | null; loading: boolean }
const state = reactive<Record<string, PanelState>>({
  overview: { data: null, loading: false },
  specs: { data: null, loading: false },
  reviews: { data: null, loading: false },
})

const fetchPanel = (value: string) => {
  const panel = state[value]!
  panel.loading = true
  // Simulated latency — swap for your real request.
  setTimeout(() => {
    panel.data = `Loaded content for "${value}" at ${new Date().toLocaleTimeString()}`
    panel.loading = false
  }, 900)
}

// Fetch a panel the first time it becomes active (pairs with mount="lazy").
const onChange = (value: string) => {
  if (state[value]!.data === null && !state[value]!.loading) fetchPanel(value)
}
// Kick off the initially-active panel too.
onChange(active.value)
</script>

<template>
  <div class="w-full max-w-md">
    <KunTab
      v-model="active"
      :items="items"
      variant="light"
      name="lazy"
      @change="onChange"
    />

    <!-- mount="lazy": a panel renders on first activation, then stays mounted. -->
    <KunTabPanels v-model="active" name="lazy" mount="lazy" class="mt-3">
      <KunTabPanel
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :loading="state[item.value]!.loading && state[item.value]!.data !== null"
      >
        <!-- First load: nothing to dim yet, so show a skeleton (at full opacity
             — DON'T pass `loading` here, or the dim would fade the skeleton too). -->
        <div v-if="state[item.value]!.data === null" class="flex flex-col gap-2">
          <KunSkeleton variant="text" width="70%" />
          <KunSkeleton variant="text" />
          <KunSkeleton variant="text" width="40%" />
        </div>

        <!-- Loaded: real content. A refresh re-sets `loading`, which DIMS this
             (the stale-while-revalidate mechanism) instead of flashing a skeleton. -->
        <div v-else class="text-default-600 flex flex-col gap-3 text-sm">
          <p>{{ state[item.value]!.data }}</p>
          <KunButton
            size="sm"
            variant="flat"
            class="self-start"
            @click="fetchPanel(item.value)"
          >
            Refresh
          </KunButton>
        </div>
      </KunTabPanel>
    </KunTabPanels>
  </div>
</template>
