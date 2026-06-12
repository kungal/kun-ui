<script setup lang="ts">
import { computed, provide } from 'vue'
import { KUN_TAB_PANELS } from '../composables/tabPanelsContext'
import type { KunTabPanelsProps } from './types'

// Optional convenience wrapper around several <KunTabPanel>s: share the active
// value (v-model) and the mount / hiddenStrategy / name defaults, and auto-wire
// find-in-page reveal (a panel's `beforematch` flips this v-model). Panels also
// work standalone with explicit :active / @activate.
defineOptions({ name: 'KunTabPanels' })

const props = withDefaults(defineProps<KunTabPanelsProps>(), {
  mount: 'eager',
  hiddenStrategy: 'until-found',
  name: undefined,
})

const active = defineModel<string>()

provide(KUN_TAB_PANELS, {
  active: computed(() => active.value),
  activate: (value: string) => {
    active.value = value
  },
  mount: computed(() => props.mount),
  hiddenStrategy: computed(() => props.hiddenStrategy),
  name: computed(() => props.name),
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
