<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import {
  cn,
  initialKunSkeletonSwap,
  nextKunSkeletonSwap,
  type KunSkeletonSwapStep,
} from '@kungal/ui-core'
import type { KunSkeletonSwapProps } from './types'

defineOptions({ name: 'KunSkeletonSwap' })

const props = withDefaults(defineProps<KunSkeletonSwapProps>(), {
  delay: 150,
  minDuration: 300,
  className: '',
})

defineSlots<{
  /** The real content. Also rendered while a reload waits out `delay`, so it
   *  must render from the previous data. */
  default?: () => unknown
  /** The placeholder layout, built from KunSkeleton, in the content's shape. */
  skeleton?: () => unknown
}>()

const timing = () => ({ delay: props.delay, minDuration: props.minDuration })

// A server render cannot wait out the delay, and blank HTML is worse than a
// skeleton, so it shows one at once; the hydrating client must match it. Vue
// assigns vnode.el before setup only when hydrating (runtime-core 3.5.35).
const showNow = typeof window === 'undefined' || !!getCurrentInstance()?.vnode.el

const initial = initialKunSkeletonSwap(props.loading, performance.now(), timing(), showNow)
const state = shallowRef(initial.state)
// The layers fade only when a shown skeleton arrives or leaves; a load that
// ended inside the delay swaps without one.
const fade = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const apply = (step: KunSkeletonSwapStep) => {
  clearTimeout(timer)
  fade.value = state.value.view === 'skeleton' || step.state.view === 'skeleton'
  state.value = step.state
  if (step.wakeAt === null) return
  timer = setTimeout(
    () => apply(nextKunSkeletonSwap(state.value, props.loading, performance.now(), timing())),
    step.wakeAt - performance.now()
  )
}

if (initial.wakeAt !== null) apply(initial)

watch(
  () => props.loading,
  (loading) => apply(nextKunSkeletonSwap(state.value, loading, performance.now(), timing()))
)

onBeforeUnmount(() => clearTimeout(timer))

// Stale content stays interactive through the delay: making it inert would
// drop the focus of whatever control started the load, on every fast refetch.
const onBeforeLeave = (el: Element) => {
  ;(el as HTMLElement).inert = true
}
</script>

<template>
  <div
    :class="cn(className)"
    :style="{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' }"
    :aria-busy="loading || undefined"
  >
    <Transition name="kun-skeleton-swap" :css="fade" @before-leave="onBeforeLeave">
      <div
        v-if="state.view !== 'content'"
        aria-hidden="true"
        inert
        class="kun-skeleton-swap-layer"
        :style="{ gridArea: '1 / 1', opacity: state.view === 'pending' ? 0 : undefined }"
      >
        <slot name="skeleton" />
      </div>
    </Transition>
    <Transition name="kun-skeleton-swap" :css="fade" @before-leave="onBeforeLeave">
      <div v-if="state.view === 'content'" class="kun-skeleton-swap-layer" :style="{ gridArea: '1 / 1' }">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .kun-skeleton-swap-layer {
    transition: opacity var(--kun-dur-fast) var(--ease-kun-standard);
  }
}
.kun-skeleton-swap-enter-from,
.kun-skeleton-swap-leave-to {
  opacity: 0;
}
</style>
