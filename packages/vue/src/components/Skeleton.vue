<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import type { KunSkeletonProps } from './types'

// Content loading placeholder. Render a pulsing block while data is in flight,
// then flip `loaded` to swap in the real content (the default slot). Prefer this
// over a spinner for lists / cards / media grids — it preserves layout and reads
// as faster. Pure CSS, SSR-safe, and the pulse respects `prefers-reduced-motion`.
defineOptions({ name: 'KunSkeleton' })

const props = withDefaults(defineProps<KunSkeletonProps>(), {
  variant: 'rect',
  width: '',
  height: '',
  rounded: undefined,
  loaded: false,
  animation: 'pulse',
  className: '',
})

const rounded = useResolvedRounded(() => props.rounded)

// circle is always fully round; text uses a small radius; rect follows config.
const roundedClass = computed(() => {
  if (props.variant === 'circle') return 'rounded-full'
  if (props.variant === 'text') return 'rounded-md'
  return kunRoundedClasses[rounded.value]
})

const style = computed(() => {
  const height =
    props.height ||
    (props.variant === 'text'
      ? '1em'
      : props.variant === 'circle'
        ? '2.5rem'
        : '1.25rem')
  const width = props.width || (props.variant === 'circle' ? height : '100%')
  return { width, height }
})
</script>

<template>
  <slot v-if="loaded" />
  <span
    v-else
    aria-hidden="true"
    :class="
      cn(
        'bg-default-200 dark:bg-default-100 block shrink-0',
        animation === 'pulse' && 'motion-safe:animate-pulse',
        roundedClass,
        className
      )
    "
    :style="style"
  />
</template>
