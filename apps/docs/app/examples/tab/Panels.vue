<script setup lang="ts">
import { ref } from 'vue'
import type { KunTabItem } from '@kungal/ui-vue'

const active = ref('overview')
const items: KunTabItem[] = [
  { value: 'overview', textValue: 'Overview' },
  { value: 'specs', textValue: 'Specs' },
  { value: 'reviews', textValue: 'Reviews' },
]
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Share `name` between <KunTab> and <KunTabPanels> to wire ARIA ids. -->
    <KunTab v-model="active" :items="items" variant="light" name="demo" />
    <KunTabPanels v-model="active" name="demo" class="mt-3">
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
  </div>
</template>
