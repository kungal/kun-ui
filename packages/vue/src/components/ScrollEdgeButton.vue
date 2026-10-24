<script setup lang="ts">
import { cn } from '@kungal/ui-core'
import KunIcon from './Icon.vue'

// Internal: the floating chevron KunTab and KunScrollShadow put on a scrollable
// edge. A redundant affordance (swipe / wheel / keyboard also scroll, and a
// screen reader reads the off-screen content anyway), so it stays out of the
// a11y tree and the tab order.
defineOptions({ name: 'KunScrollEdgeButton' })

const props = defineProps<{
  side: 'left' | 'right'
  target: HTMLElement | null
}>()

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ~80% of the viewport — a page-turn that leaves some overlap for context.
const scrollByStep = () => {
  const el = props.target
  if (!el) return
  el.scrollBy({
    left: (props.side === 'left' ? -1 : 1) * el.clientWidth * 0.8,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <button
    type="button"
    tabindex="-1"
    aria-hidden="true"
    :class="
      cn(
        'absolute top-1/2 z-20 inline-flex size-7 -translate-y-1/2 items-center justify-center',
        'rounded-full border border-kun bg-background/80 text-default-600 shadow-kun-sm backdrop-blur-sm',
        'opacity-80 transition-[color,opacity] hover:text-foreground hover:opacity-100',
        side === 'left' ? 'left-0.5' : 'right-0.5'
      )
    "
    @click="scrollByStep"
  >
    <KunIcon :name="side === 'left' ? 'lucide:chevron-left' : 'lucide:chevron-right'" />
  </button>
</template>
