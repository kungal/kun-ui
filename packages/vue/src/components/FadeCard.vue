<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  type VNode,
  computed,
  onMounted,
  ref,
  useSlots,
} from 'vue'

// Fade + expand transition wrapper. The original used Nuxt's <ClientOnly>;
// here a `mounted` gate replicates it framework-neutrally — the content only
// renders on the client, so there's no SSR/hydration flash.
//
// Height animates via the grid `0fr → 1fr` trick (the wrapper is a grid whose
// single row collapses), not `max-height`: it never thrashes a fixed cap and
// never clips tall content the way the old `max-h-96` did.
//
// The Transition's direct child carries the `v-if` (bound to whether the slot
// actually has content) so a `v-if` on the *slotted* element — the common usage
// `<KunFadeCard><Foo v-if="show" /></KunFadeCard>` — drives enter/leave. Wrapping
// an always-present div (the previous shape) meant the Transition never saw the
// toggle and so never animated.
defineOptions({ name: 'KunFadeCard' })

const slots = useSlots()

// A falsy `v-if` in the slot renders a Comment placeholder; whitespace-only Text
// and empty Fragments are likewise "no content". Anything else counts as present.
const isEmpty = (nodes?: VNode[]): boolean =>
  !nodes ||
  nodes.every((n) => {
    if (n.type === Comment) return true
    if (n.type === Text) return !String(n.children).trim()
    if (n.type === Fragment) return isEmpty(n.children as VNode[])
    return false
  })

const hasContent = computed(() => !isEmpty(slots.default?.()))

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <Transition
    enter-active-class="kun-fade-expand"
    leave-active-class="kun-fade-expand"
    enter-from-class="kun-fade-collapsed"
    leave-to-class="kun-fade-collapsed"
  >
    <div v-if="isMounted && hasContent" class="grid grid-rows-[1fr] opacity-100">
      <div class="min-h-0 overflow-hidden">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.kun-fade-expand {
  transition:
    grid-template-rows var(--kun-dur-slow) var(--ease-kun-standard),
    opacity var(--kun-dur-slow) var(--ease-kun-standard);
}
.kun-fade-collapsed {
  grid-template-rows: 0fr !important;
  opacity: 0;
}
</style>
