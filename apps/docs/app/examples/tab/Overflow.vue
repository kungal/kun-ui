<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('s1')
const items: KunTabItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: `s${i + 1}`,
  textValue: `分区 ${i + 1}`,
}))
</script>

<template>
  <!-- A horizontal strip that outgrows its container scrolls INSIDE it instead
       of widening the page — no `scrollable` flag, no manual overflow check. The
       overflowing edge fades to transparent (works on any background) and a
       chevron floats on each scrollable side. The active tab auto-scrolls into
       view, so ← / → keyboard nav always keeps the selection visible. -->
  <div class="flex max-w-sm flex-col gap-4">
    <KunTab v-model="active" :items="items" variant="underlined" />

    <!-- scroll-buttons=false keeps just the fade (Airbnb-style peek) -->
    <KunTab
      v-model="active"
      :items="items"
      variant="light"
      color="secondary"
      :scroll-buttons="false"
    />
  </div>
</template>
