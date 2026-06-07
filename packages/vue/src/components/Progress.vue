<script setup lang="ts">
import { computed } from 'vue'
import { cn, kunBgClasses, kunRoundedClasses, type KunUIColor } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import type { KunProgressProps } from './types'

defineOptions({ name: 'KunProgress' })

const props = withDefaults(defineProps<KunProgressProps>(), {
  value: 0,
  max: 100,
  variant: 'solid',
  color: 'primary',
  size: 'md',
  rounded: undefined,
  showLabel: false,
  indeterminate: false,
  className: '',
})

const percentage = computed(() => {
  const safeMax = props.max || 100
  const safeValue = Math.min(Math.max(props.value, 0), safeMax)
  return Math.round((safeValue / safeMax) * 100)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-1'
    case 'sm':
      return 'h-2'
    case 'lg':
      return 'h-4'
    case 'xl':
      return 'h-5'
    case 'md':
    default:
      return 'h-3'
  }
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// SVG <circle stroke="currentColor"> needs a text-* class. (Note: default
// maps to text-default here, NOT core's text-foreground, so it's local.)
const strokeColorClasses: Record<KunUIColor, string> = {
  default: 'text-default',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}

// Static gradient map — Tailwind JIT can't resolve dynamic
// `from-${color}-400` strings. Source of truth for the gradient variant.
const gradientClasses: Record<KunUIColor, string> = {
  default: 'bg-gradient-to-r from-default-400 to-default-600',
  primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
  secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-600',
  success: 'bg-gradient-to-r from-success-400 to-success-600',
  warning: 'bg-gradient-to-r from-warning-400 to-warning-600',
  danger: 'bg-gradient-to-r from-danger-400 to-danger-600',
  info: 'bg-gradient-to-r from-info-400 to-info-600',
}

const barClasses = computed(() => {
  const base = kunBgClasses[props.color]
  switch (props.variant) {
    case 'gradient':
      return gradientClasses[props.color]
    case 'striped':
      return `${base} bg-[length:1rem_1rem] bg-gradient-to-r from-white/20 to-transparent animate-[progress-stripes_1s_linear_infinite]`
    case 'solid':
    default:
      return base
  }
})

const circleRadius = 45
const circleCircumference = 2 * Math.PI * circleRadius
const circleOffset = computed(
  () => circleCircumference - (percentage.value / 100) * circleCircumference
)
</script>

<template>
  <div class="contents">
    <div
      v-if="variant === 'circle'"
      class="relative inline-flex items-center justify-center"
    >
      <svg class="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          class="text-default-300"
          stroke="currentColor"
          stroke-width="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          :class="strokeColorClasses[color]"
          stroke="currentColor"
          stroke-width="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          stroke-linecap="round"
          :stroke-dasharray="circleCircumference"
          :stroke-dashoffset="circleOffset"
          style="transition: stroke-dashoffset 0.35s ease"
        />
      </svg>
      <span v-if="showLabel" class="absolute text-sm font-medium">
        {{ percentage }}%
      </span>
    </div>

    <div
      v-else
      class="bg-default-300 w-full overflow-hidden"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : percentage"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :class="[sizeClasses, roundedClass, className]"
    >
      <div
        :class="
          cn(
            'flex h-full items-center transition-all duration-500 ease-out',
            barClasses
          )
        "
        :style="indeterminate ? 'width:100%' : `width:${percentage}%`"
      >
        <span
          v-if="showLabel && !indeterminate"
          class="px-2 text-xs font-medium text-white"
        >
          {{ percentage }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>
