<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { KunTabItem } from '@kungal/ui-vue'

const route = useRoute()

const items: KunTabItem[] = [
  { value: 'topic', textValue: '话题榜', href: '?rank=topic' },
  { value: 'galgame', textValue: 'Galgame 榜', href: '?rank=galgame' },
  { value: 'user', textValue: '用户榜', href: '?rank=user' },
]

// The URL is the source of truth: each tab is a page, so the active one is read
// back from the route and the setter is a no-op.
const active = computed({
  get: () => (route.query.rank as string) ?? 'topic',
  set: () => {},
})
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Every item has an href, so each tab is a real <a>: crawlable, works
         without JS, and ⌘/Ctrl-click opens it in a new tab. A strip that is
         entirely links is navigation rather than a tablist — the current page
         is marked with aria-current="page". -->
    <KunTab v-model="active" :items="items" variant="underlined" />

    <p class="text-default-500 mt-3 text-sm">
      当前:<code>?rank={{ active }}</code>
    </p>
  </div>
</template>
