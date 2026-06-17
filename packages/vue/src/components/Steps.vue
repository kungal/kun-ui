<script setup lang="ts">
import { computed } from 'vue'
import {
  cn,
  kunSolidBgClasses,
  kunSolidFgClasses,
  kunTextClasses,
  type KunUIColor,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunStepsProps, KunStepsSize } from './types'

// Progress through a multi-step flow (registration, upload / submission wizard).
// Data-driven (`items` + `current`); state is derived from `current`, so it's
// SSR-safe with no measurement. Steps before `current` are done (✓), the one at
// `current` is active, the rest pending.
defineOptions({ name: 'KunSteps' })

const props = withDefaults(defineProps<KunStepsProps>(), {
  current: 0,
  color: 'primary',
  size: 'md',
  orientation: 'horizontal',
  className: '',
})

const isVertical = computed(() => props.orientation === 'vertical')

const sizes: Record<KunStepsSize, { circle: string; icon: string; title: string; gap: string }> = {
  sm: { circle: 'size-7 text-xs', icon: 'size-3.5', title: 'text-sm', gap: 'gap-2' },
  md: { circle: 'size-9 text-sm', icon: 'size-4', title: 'text-sm', gap: 'gap-3' },
  lg: { circle: 'size-11 text-base', icon: 'size-5', title: 'text-base', gap: 'gap-3' },
}
const sz = computed(() => sizes[props.size])

// Soft halo behind the active step (static literals for the JIT).
const activeRing: Record<KunUIColor, string> = {
  default: 'ring-default/25',
  primary: 'ring-primary/25',
  secondary: 'ring-secondary/25',
  success: 'ring-success/25',
  warning: 'ring-warning/25',
  danger: 'ring-danger/25',
  info: 'ring-info/25',
}

type State = 'done' | 'active' | 'pending'
const stateOf = (i: number): State =>
  i < props.current ? 'done' : i === props.current ? 'active' : 'pending'

const circleClass = (i: number) => {
  const state = stateOf(i)
  if (state === 'pending')
    return 'border-2 border-default-200 text-default-400 bg-transparent'
  const filled = cn(kunSolidBgClasses[props.color], kunSolidFgClasses[props.color])
  return state === 'active' ? cn(filled, 'ring-4', activeRing[props.color]) : filled
}

// The connector AFTER a done step is coloured; otherwise muted.
const connectorClass = (i: number) =>
  i < props.current ? kunSolidBgClasses[props.color] : 'bg-default-200'
</script>

<template>
  <ol
    :class="
      cn(isVertical ? 'flex flex-col' : 'flex w-full items-start', className)
    "
  >
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="
        isVertical
          ? cn('flex', sz.gap)
          : cn('relative flex-1 last:flex-none', i < items.length - 1 && 'pr-2')
      "
      :aria-current="stateOf(i) === 'active' ? 'step' : undefined"
    >
      <!-- Indicator column (circle + connector) -->
      <div
        :class="
          isVertical
            ? 'flex flex-col items-center'
            : 'flex w-full items-center'
        "
      >
        <span
          :class="
            cn(
              'relative z-10 inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-colors',
              sz.circle,
              circleClass(i)
            )
          "
        >
          <KunIcon v-if="stateOf(i) === 'done'" name="lucide:check" :class="sz.icon" />
          <KunIcon v-else-if="item.icon" :name="item.icon" :class="sz.icon" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <!-- connector -->
        <span
          v-if="i < items.length - 1"
          :class="
            cn(
              'transition-colors',
              isVertical ? 'mt-1 w-0.5 flex-1' : 'mx-2 h-0.5 flex-1',
              connectorClass(i)
            )
          "
        />
      </div>

      <!-- Label -->
      <div
        :class="
          isVertical
            ? 'pb-6'
            : cn('mt-2', i < items.length - 1 ? 'pr-2' : '')
        "
      >
        <p
          :class="
            cn(
              'font-medium',
              sz.title,
              stateOf(i) === 'pending'
                ? 'text-default-400'
                : stateOf(i) === 'active'
                  ? kunTextClasses[color]
                  : 'text-foreground'
            )
          "
        >
          {{ item.title }}
        </p>
        <p v-if="item.description" class="text-default-500 mt-0.5 text-xs">
          {{ item.description }}
        </p>
      </div>
    </li>
  </ol>
</template>
