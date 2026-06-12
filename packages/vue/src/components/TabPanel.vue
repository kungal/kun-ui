<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { cn } from '@kungal/ui-core'
import {
  KUN_TAB_PANELS,
  kunTabId,
  kunTabPanelId,
  type KunTabMount,
  type KunTabHiddenStrategy,
} from '../composables/tabPanelsContext'
import type { KunTabPanelProps } from './types'

// One tab's content. Pairs with <KunTab> (the bar). SEO-first by design:
//   mount="eager" (default) — every panel is server-rendered into the HTML so
//     search engines index ALL of it; inactive panels are hidden, not removed.
//   mount="lazy"  — render on first activation, then keep (huge data, accept the
//     SEO trade-off for the not-yet-opened panels).
//   mount="unmount" — only the active panel in the DOM (v-if). NOT crawlable for
//     the inactive panels — use only for heavy, non-SEO interactive widgets.
// Inactive panels default to hidden="until-found" (content-visibility): still in
// the DOM and indexed, but also reachable by in-page search, scroll-to-text
// fragments and deep links — on which the browser fires `beforematch`, so we
// flip the active tab to match what the user is about to see.
defineOptions({ name: 'KunTabPanel' })

const props = withDefaults(defineProps<KunTabPanelProps>(), {
  active: undefined,
  mount: undefined,
  forceMount: false,
  hiddenStrategy: undefined,
  name: undefined,
  className: '',
})

const emit = defineEmits<{ activate: [value: string] }>()

const ctx = inject(KUN_TAB_PANELS, null)

const activeValue = computed(() => props.active ?? ctx?.active.value)
const isActive = computed(() => activeValue.value === props.value)

const resolvedMount = computed<KunTabMount>(() =>
  props.forceMount ? 'eager' : (props.mount ?? ctx?.mount.value ?? 'eager')
)
const resolvedHidden = computed<KunTabHiddenStrategy>(
  () => props.hiddenStrategy ?? ctx?.hiddenStrategy.value ?? 'until-found'
)
const idName = computed(() => props.name ?? ctx?.name.value)
const panelId = computed(() => kunTabPanelId(idName.value, props.value))
const tabId = computed(() => kunTabId(idName.value, props.value))

// lazy: render once it first becomes active, then keep it mounted.
const hasBeenActive = ref(isActive.value)
watch(isActive, (a) => {
  if (a) hasBeenActive.value = true
})

const shouldRender = computed(() => {
  if (resolvedMount.value === 'unmount') return isActive.value
  if (resolvedMount.value === 'lazy') return hasBeenActive.value
  return true // eager
})

// Vue coerces the `hidden` attribute to a boolean, so it can't emit
// hidden="until-found" through a binding — we set it imperatively on the client.
// SSR / pre-hydration hides inactive panels via a content-visibility data-attr
// (no flash-of-all-panels); once mounted we drop that and let the real
// hidden="until-found" take over (find-in-page reveal + deep links).
const panelRef = ref<HTMLElement | null>(null)
const hydrated = ref(false)
const isHidden = computed(
  () => shouldRender.value && !isActive.value && resolvedMount.value !== 'unmount'
)

const syncHidden = () => {
  const el = panelRef.value
  if (!el) return
  if (!isHidden.value) {
    el.removeAttribute('hidden')
    return
  }
  el.setAttribute('hidden', resolvedHidden.value === 'until-found' ? 'until-found' : '')
}

onMounted(() => {
  syncHidden()
  hydrated.value = true
  watch([isActive, resolvedHidden, shouldRender], syncHidden)
})

// Browser is about to reveal this hidden panel (find-in-page / text fragment):
// flip the active tab so our state matches what the user now sees.
const onBeforeMatch = () => {
  emit('activate', props.value)
  ctx?.activate(props.value)
}
</script>

<template>
  <div
    v-if="shouldRender"
    ref="panelRef"
    role="tabpanel"
    :id="panelId"
    :aria-labelledby="tabId"
    :tabindex="isActive ? 0 : -1"
    :data-kun-tab-hidden="!hydrated && isHidden ? '' : undefined"
    :class="cn('focus:outline-none', className)"
    @beforematch="onBeforeMatch"
  >
    <slot />
  </div>
</template>

<style scoped>
/* SSR / pre-hydration placeholder hide so panels don't flash on first paint.
   content-visibility (not display:none) stays compatible with the
   hidden="until-found" the client swaps in. */
[data-kun-tab-hidden] {
  content-visibility: hidden;
}
</style>
