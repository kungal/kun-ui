<script setup lang="ts">
import { computed, getCurrentInstance, useId, type CSSProperties } from 'vue'
import {
  cn,
  kunSolidBgClasses,
  kunSolidFgClasses,
  kunTextClasses,
  type KunMessagePath,
  type KunUIColor,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunStepsProps, KunStepsSize } from './types'

// Progress through a multi-step flow (registration, upload / submission wizard).
// Data-driven (`items` + `current`); state is derived from `current`, so it's
// SSR-safe with no measurement. Steps before `current` are done (✓), the one at
// `current` is active, the rest pending. Bound with `v-model:current`, each
// indicator becomes a button whose hit area stretches over its whole step.
defineOptions({ name: 'KunSteps' })

const props = withDefaults(defineProps<KunStepsProps>(), {
  current: 0,
  linear: true,
  color: 'primary',
  size: 'md',
  orientation: 'horizontal',
  className: '',
})

const emit = defineEmits<{
  /** A step was clicked; carries its 0-based index. Never fires for the current
   *  step, a `disabled` one, or — while `linear` — one after `current`. */
  'update:current': [index: number]
}>()

const { t } = useKunLocale()
const instance = getCurrentInstance()
const baseId = `kun-steps-${useId()}`

// Clickable only when someone listens. KunSteps shipped display-only, and the
// forum's creator-application flow renders review status through a one-way
// `:current`; it must not grow buttons that do nothing. Read at render time —
// declaring `onUpdate:current` as a prop would publish it as API.
const isInteractive = () => !!instance?.vnode.props?.['onUpdate:current']

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

// A fainter halo on hover, previewing the one the step gets once current.
const hoverRing: Record<KunUIColor, string> = {
  default: 'hover:ring-4 hover:ring-default/15',
  primary: 'hover:ring-4 hover:ring-primary/15',
  secondary: 'hover:ring-4 hover:ring-secondary/15',
  success: 'hover:ring-4 hover:ring-success/15',
  warning: 'hover:ring-4 hover:ring-warning/15',
  danger: 'hover:ring-4 hover:ring-danger/15',
  info: 'hover:ring-4 hover:ring-info/15',
}

// Inline, not `sr-only`: that class comes from the consumer's Tailwind, and a
// miss would print the state prefix next to every title.
const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
}

type State = 'done' | 'active' | 'pending' | 'error'
const stateOf = (i: number): State =>
  props.items[i]?.status === 'error'
    ? 'error'
    : i < props.current
      ? 'done'
      : i === props.current
        ? 'active'
        : 'pending'

const stateMessage: Record<State, KunMessagePath> = {
  done: 'steps.completed',
  active: 'steps.current',
  pending: 'steps.pending',
  error: 'steps.error',
}

const toneOf = (i: number): KunUIColor => (stateOf(i) === 'error' ? 'danger' : props.color)

const isReachable = (i: number) =>
  !props.items[i]?.disabled && (!props.linear || i <= props.current)

const isClickable = (i: number) =>
  isInteractive() && i !== props.current && isReachable(i)

const select = (i: number) => {
  if (i !== props.current && isReachable(i)) emit('update:current', i)
}

const circleClass = (i: number) => {
  const state = stateOf(i)
  const tone = toneOf(i)
  return cn(
    'z-10 inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-colors',
    sz.value.circle,
    state === 'pending'
      ? 'border-2 border-default-200 text-default-400 bg-transparent'
      : cn(kunSolidBgClasses[tone], kunSolidFgClasses[tone]),
    i === props.current && cn('ring-4', activeRing[tone]),
    isClickable(i) &&
      cn('cursor-pointer transition after:absolute after:inset-0', hoverRing[tone])
  )
}

const indicatorAttrs = (i: number) => {
  if (!isInteractive()) return { 'aria-hidden': 'true' as const }
  const item = props.items[i]
  return {
    type: 'button' as const,
    disabled: !isReachable(i),
    'aria-current': i === props.current ? ('step' as const) : undefined,
    'aria-labelledby': `${baseId}-${i}-title`,
    'aria-describedby': item?.description ? `${baseId}-${i}-desc` : undefined,
    onClick: () => select(i),
  }
}

const titleClass = (i: number) => {
  const state = stateOf(i)
  return cn(
    'font-medium',
    sz.value.title,
    state === 'pending'
      ? 'text-default-400'
      : state === 'error'
        ? kunTextClasses.danger
        : state === 'active'
          ? kunTextClasses[props.color]
          : 'text-foreground'
  )
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
          ? cn('relative flex', sz.gap)
          : cn('relative flex-1 last:flex-none', i < items.length - 1 && 'pr-2')
      "
      :aria-current="
        !isInteractive() && i === current ? 'step' : undefined
      "
    >
      <!-- Indicator column (circle + connector) -->
      <div
        :class="
          isVertical
            ? 'flex flex-col items-center'
            : 'flex w-full items-center'
        "
      >
        <component
          :is="isInteractive() ? 'button' : 'span'"
          :class="circleClass(i)"
          v-bind="indicatorAttrs(i)"
        >
          <KunIcon v-if="stateOf(i) === 'error'" name="lucide:x" :class="sz.icon" />
          <KunIcon v-else-if="stateOf(i) === 'done'" name="lucide:check" :class="sz.icon" />
          <KunIcon v-else-if="item.icon" :name="item.icon" :class="sz.icon" />
          <template v-else>{{ i + 1 }}</template>
        </component>
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
        <p :id="`${baseId}-${i}-title`" :class="titleClass(i)">
          <span :style="visuallyHidden">
            {{ t(stateMessage[stateOf(i)], { title: item.title }) }}
          </span>
          <span aria-hidden="true">{{ item.title }}</span>
        </p>
        <p
          v-if="item.description"
          :id="`${baseId}-${i}-desc`"
          class="text-default-500 mt-0.5 text-xs"
        >
          {{ item.description }}
        </p>
      </div>
    </li>
  </ol>
</template>
