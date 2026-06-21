<script setup lang="ts">
import { computed } from 'vue'
import {
  cn,
  kunRoundedClasses,
  kunSolidClasses,
  type KunUIVariant,
  type KunUIColor,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import KunIcon from './Icon.vue'
import type { KunInfoProps } from './types'

// Callout / alert block. Has its own variant×color table (softer tints +
// *-800 text) distinct from the standard button matrix, so it stays local.
defineOptions({ name: 'KunInfo' })

const props = withDefaults(defineProps<KunInfoProps>(), {
  title: '',
  description: '',
  color: 'default',
  className: '',
  variant: 'flat',
  icon: '',
  rounded: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// Every variant carries the SAME 1.5px border width — `bordered` colours it,
// the others keep it transparent — so switching variants never changes the
// box's outer size (the filled / light / ghost variants would otherwise be 3px
// smaller than `bordered`). Mirrors how Button reserves a transparent border.
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'solid':
    case 'shadow':
      // Fill + foreground come from kunSolidClasses (see colorClasses) — it
      // picks white or dark text per colour for legibility in both modes.
      return 'border-[1.5px] border-transparent'
    case 'bordered':
      return 'border-[1.5px]'
    case 'light':
      return 'bg-opacity-20 border-[1.5px] border-transparent'
    case 'flat':
      return 'bg-opacity-20 border-[1.5px] border-transparent shadow-none'
    case 'ghost':
      return 'bg-transparent border-[1.5px] border-transparent shadow-none hover:bg-opacity-10'
    default:
      return 'border-[1.5px] border-transparent'
  }
})

// solid / shadow are handled by kunSolidClasses in colorClasses (one source of
// truth for fill + contrast-correct foreground). The remaining variants use
// soft tints with dark colored text, so they keep their own table.
const colorVariants: Partial<Record<KunUIVariant, Record<KunUIColor, string>>> = {
  bordered: {
    default: 'bg-transparent bg-default/15 border-default',
    primary: 'bg-transparent bg-primary/15 border-primary text-primary',
    secondary: 'bg-transparent bg-secondary/15 border-secondary text-secondary',
    success: 'bg-transparent bg-success/15 border-success-600 text-success',
    warning: 'bg-transparent bg-warning/15 border-warning-600 text-warning',
    danger: 'bg-transparent bg-danger/15 border-danger text-danger',
    info: 'bg-transparent bg-info/15 border-info text-info',
  },
  light: {
    default: 'bg-transparent hover:bg-default/40',
    primary: 'bg-transparent text-primary-800 hover:bg-primary/20',
    secondary: 'bg-transparent text-secondary-800 hover:bg-secondary/20',
    success: 'bg-transparent text-success-800 hover:bg-success/20',
    warning: 'bg-transparent text-warning-800 hover:bg-warning/20',
    danger: 'bg-transparent text-danger-800 hover:bg-danger/20',
    info: 'bg-transparent text-info-800 hover:bg-info/20',
  },
  flat: {
    default: 'bg-default/15 text-default-800',
    primary: 'bg-primary/15 text-primary-800',
    secondary: 'bg-secondary/15 text-secondary-800',
    success: 'bg-success/15 text-success-800 dark:text-success',
    warning: 'bg-warning/15 text-warning-800 dark:text-warning',
    danger: 'bg-danger/15 text-danger-800 dark:text-danger-500',
    info: 'bg-info/15 text-info-800 dark:text-info-500',
  },
  ghost: {
    default: 'border-default',
    primary: 'border-primary text-primary',
    secondary: 'border-secondary text-secondary',
    success: 'border-success text-success',
    warning: 'border-warning text-warning',
    danger: 'border-danger text-danger',
    info: 'border-info text-info',
  },
}

// Colored glow for the shadow variant (size + tint); the fill + foreground come
// from kunSolidClasses.
const shadowGlow: Record<KunUIColor, string> = {
  default: 'shadow-lg shadow-default/40',
  primary: 'shadow-lg shadow-primary/40',
  secondary: 'shadow-lg shadow-secondary/40',
  success: 'shadow-lg shadow-success/40',
  warning: 'shadow-lg shadow-warning/40',
  danger: 'shadow-lg shadow-danger/40',
  info: 'shadow-lg shadow-info/40',
}

const colorClasses = computed(() => {
  if (props.variant === 'solid') return kunSolidClasses[props.color]
  if (props.variant === 'shadow')
    return cn(shadowGlow[props.color], kunSolidClasses[props.color])
  return colorVariants[props.variant]?.[props.color] || ''
})

// Title colour. The soft-tint variants use a dark colored title; solid / shadow
// inherit the box's contrast-correct foreground (kunSolidClasses) — overriding
// it with `text-{color}-900` is what made the solid title unreadable.
const titleColor = computed(() => {
  if (props.variant === 'solid' || props.variant === 'shadow') return ''
  switch (props.color) {
    case 'primary':
      return 'text-primary-900'
    case 'secondary':
      return 'text-secondary-900'
    case 'danger':
      return 'text-danger-900'
    case 'info':
      return 'text-info-900'
    case 'success':
      return 'text-success-900'
    case 'warning':
      return 'text-warning-900'
    default:
      return 'text-default-900'
  }
})
</script>

<template>
  <div
    :class="
      cn('space-y-2 p-4', roundedClass, variantClasses, colorClasses, className)
    "
  >
    <h3 :class="cn('flex items-center gap-2 font-medium', titleColor)">
      <KunIcon v-if="icon" :name="icon" :class-name="'h-5 w-5 flex-shrink-0'" />
      <span v-if="title">{{ title }}</span>
      <slot name="title" />
    </h3>

    <div v-if="description || $slots.default" class="text-sm opacity-90">
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
