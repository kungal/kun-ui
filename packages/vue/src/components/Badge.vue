<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunBgClasses } from '@kungal/ui-core'
import type { KunBadgeProps } from './types'

// Dot / count overlay on the top corner of an anchor (avatar, icon,
// button). For inline pills use KunChip.
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

const badgeClasses = computed(() =>
  cn(
    'absolute z-10 inline-flex items-center justify-center rounded-full font-medium text-white ring-2 ring-background',
    kunBgClasses[props.color],
    props.variant === 'dot' ? dotSize[props.size] : countSize[props.size],
    placementClasses[props.placement],
    props.className
  )
)
</script>

<template>
  <span class="relative inline-flex">
    <slot />
    <span v-if="visible" :class="badgeClasses">
      {{ displayText }}
    </span>
  </span>
</template>
