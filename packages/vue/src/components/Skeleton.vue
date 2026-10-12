<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// A text placeholder is one line box tall (1lh) with a 1em bar centred in it,
// the way a line of text occupies its box: at 1em the content below jumped by
// the leading when the words arrived (+8px measured on the HoverCard demo).
// Safari < 16.4 drops `1lh` and would collapse the box to 0; min-height keeps
// the old 1em bar there.
const style = computed(() => {
  if (props.variant === 'text' && !props.height) {
    return {
      width: props.width || '100%',
      height: '1lh',
      minHeight: '1em',
      clipPath: 'inset(calc((1lh - 1em) / 2) 0 round var(--radius-md))',
    }
  }
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

// A CSS animation starts when its element is inserted, so placeholders mounted
// at different times pulse out of step. Pinning each pulse to the document
// timeline's origin puts every one of them on the same phase.
const placeholder = ref<HTMLElement | null>(null)
watch(
  placeholder,
  (el) => {
    for (const animation of el?.getAnimations?.() ?? []) animation.startTime = 0
  },
  { flush: 'post' }
)
</script>

<template>
  <slot v-if="loaded" />
  <span
    v-else
    ref="placeholder"
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
