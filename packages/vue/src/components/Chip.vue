<script setup lang="ts">
import { cn, kunVariantClasses, type KunUISize } from '@kungal/ui-core'
import type { KunChipProps } from './types'

// Small rounded tag — labels, status pills, taxonomy markers. For dot /
// count overlays use KunBadge.
defineOptions({ name: 'KunChip' })

const props = withDefaults(defineProps<KunChipProps>(), {
  color: 'default',
  className: '',
  size: 'sm',
  variant: 'flat',
})

const sizeClasses: Record<KunUISize, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm',
  xl: 'px-6 py-3 text-base',
}
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex cursor-default items-center justify-center gap-1 rounded-full font-medium',
        sizeClasses[props.size],
        kunVariantClasses(props.variant, props.color),
        className
      )
    "
  >
    <slot />
  </span>
</template>
