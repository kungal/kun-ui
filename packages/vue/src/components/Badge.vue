<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn, kunBgClasses } from '@kungal/ui-core'
import type { KunBadgeProps } from './types'

// Dot / count overlay on the top corner of an anchor (avatar, icon, button).
// With no anchor slot it renders standalone (inline). For inline pills use
// KunChip.
defineOptions({ name: 'KunBadge' })

const props = withDefaults(defineProps<KunBadgeProps>(), {
  variant: 'count',
  count: 0,
  max: 99,
  showZero: false,
  show: true,
  color: 'danger',
  size: 'md',
  placement: 'top-right',
  className: '',
})

const visible = computed(() => {
  if (!props.show) return false
  if (props.variant === 'count' && props.count <= 0 && !props.showZero) {
    return false
  }
  return true
})

const displayText = computed(() => {
  if (props.variant === 'dot') return ''
  if (props.count > props.max) return `${props.max}+`
  return String(props.count)
})

const dotSize: Record<string, string> = {
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
}

const countSize: Record<string, string> = {
  sm: 'min-w-4 h-4 px-1 text-[10px]',
  md: 'min-w-5 h-5 px-1.5 text-xs',
  lg: 'min-w-6 h-6 px-2 text-sm',
}

const placementClasses: Record<string, string> = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
}

const slots = useSlots()
const standalone = computed(() => !slots.default)

const badgeClasses = computed(() =>
  cn(
    'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap text-white',
    kunBgClasses[props.color],
    props.variant === 'dot' ? dotSize[props.size] : countSize[props.size],
    // Anchored overlay: corner-positioned + ringed. Standalone: plain inline.
    standalone.value
      ? ''
      : cn('absolute z-10 ring-2 ring-background', placementClasses[props.placement]),
    props.className
  )
)
</script>

<template>
  <span v-if="standalone" class="inline-flex">
    <span
      v-if="visible"
      :class="badgeClasses"
      :role="ariaLabel ? 'status' : undefined"
      :aria-label="ariaLabel || undefined"
    >
      {{ displayText }}
    </span>
  </span>
  <span v-else class="relative inline-flex">
    <slot />
    <span
      v-if="visible"
      :class="badgeClasses"
      :role="ariaLabel ? 'status' : undefined"
      :aria-label="ariaLabel || undefined"
    >
      {{ displayText }}
    </span>
  </span>
</template>
