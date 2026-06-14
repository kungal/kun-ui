<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { cn, type KunUIColor, type KunUISize } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import type { KunSliderMark, KunSliderProps } from './types'

defineOptions({ name: 'KunSlider' })

const value = defineModel<number>({ required: true })
const props = withDefaults(defineProps<KunSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  color: 'primary',
  disabled: false,
  showTooltip: false,
  showValue: false,
})

const emit = defineEmits<{
  // Fired once on commit (pointer release / keyboard), for forms that only
  // care about the final value — `update:modelValue` still streams live.
  change: [value: number]
}>()

const kunUniqueId = useKunUniqueId('kun-slider')

// Track thickness + thumb scale on clean Tailwind steps; `md` is the original
// slider size. The thumb auto-centers (translate(-50%,-50%)), so only the
// dimensions change.
const sliderSizes: Record<KunUISize, { track: string; thumb: string }> = {
  xs: { track: 'h-1', thumb: 'size-3.5' },
  sm: { track: 'h-1.5', thumb: 'size-4' },
  md: { track: 'h-2', thumb: 'size-5' },
  lg: { track: 'h-2.5', thumb: 'size-6' },
  xl: { track: 'h-3', thumb: 'size-7' },
}
const sizeClass = computed(() => sliderSizes[props.size])

// Per-color fill + thumb border + focus/hover halo. The neutral `default`
// keeps the slider usable on tinted surfaces.
const colorClasses: Record<KunUIColor, { fill: string; thumb: string; halo: string }> = {
  default: { fill: 'bg-default-500', thumb: 'border-default-500', halo: 'ring-default-500/25' },
  primary: { fill: 'bg-primary', thumb: 'border-primary', halo: 'ring-primary/25' },
  secondary: { fill: 'bg-secondary', thumb: 'border-secondary', halo: 'ring-secondary/25' },
  success: { fill: 'bg-success', thumb: 'border-success', halo: 'ring-success/25' },
  warning: { fill: 'bg-warning', thumb: 'border-warning', halo: 'ring-warning/25' },
  danger: { fill: 'bg-danger', thumb: 'border-danger', halo: 'ring-danger/25' },
  info: { fill: 'bg-info', thumb: 'border-info', halo: 'ring-info/25' },
}
// An error turns the whole control danger-colored, matching the other controls.
const tone = computed(() => colorClasses[props.error ? 'danger' : props.color])

const sliderRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const interacting = ref(false)

const clamp = (v: number) =>
  Math.min(props.max, Math.max(props.min, v))

// Snap to the nearest step anchored at `min` (so step=25 over 0..100 lands on
// 0/25/50/75/100, not 0/25/50/75/100 off-by-one).
const snap = (v: number) => {
  const s = props.step || 1
  return clamp(Math.round((v - props.min) / s) * s + props.min)
}

const percent = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return ((clamp(value.value) - props.min) / span) * 100
})
const fillerWidth = computed(() => percent.value + '%')

const thumbStyle = computed(() => ({
  left: percent.value + '%',
  transform: 'translate(-50%, -50%)',
}))

const display = computed(() =>
  props.formatValue ? props.formatValue(value.value) : String(value.value)
)

// Normalize marks to {value,label} and pre-compute their track offset.
const normalizedMarks = computed(() => {
  const span = props.max - props.min
  return (props.marks ?? []).map((m): KunSliderMark & { percent: number } => {
    const mark = typeof m === 'number' ? { value: m } : m
    return {
      ...mark,
      percent: span > 0 ? ((mark.value - props.min) / span) * 100 : 0,
    }
  })
})

const commit = (v: number) => {
  const next = snap(v)
  if (next !== value.value) {
    value.value = next
    emit('change', next)
  }
}

const updateFromPointer = (e: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]!.clientX
  const ratio = (clientX - rect.left) / rect.width
  commit(ratio * (props.max - props.min) + props.min)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (props.disabled) return
  dragging.value = true
  interacting.value = true
  updateFromPointer(e)
  window.addEventListener('mousemove', updateFromPointer)
  window.addEventListener('touchmove', updateFromPointer)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
}

const stopDrag = () => {
  dragging.value = false
  interacting.value = false
  window.removeEventListener('mousemove', updateFromPointer)
  window.removeEventListener('touchmove', updateFromPointer)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
}

// Keyboard support (WCAG 2.1.1): arrows / Home / End / PageUp / PageDown.
const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  const s = props.step || 1
  let next = value.value
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next += s
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next -= s
      break
    case 'PageUp':
      next += s * 10
      break
    case 'PageDown':
      next -= s * 10
      break
    case 'Home':
      next = props.min
      break
    case 'End':
      next = props.max
      break
    default:
      return
  }
  e.preventDefault()
  commit(next)
}

const tooltipVisible = computed(
  () => props.showTooltip && interacting.value && !props.disabled
)

onUnmounted(() => {
  stopDrag()
})
</script>

<template>
  <div :class="cn('w-full', disabled && 'opacity-50')">
    <div
      v-if="label || showValue"
      class="mb-1.5 flex items-center justify-between gap-2"
    >
      <label
        v-if="label"
        :id="`${kunUniqueId}-label`"
        class="text-default-700 block text-sm font-medium"
      >
        {{ label }}
      </label>
      <span v-if="showValue" class="text-default-500 text-sm tabular-nums">
        {{ display }}
      </span>
    </div>

    <div
      class="kun-slider relative py-2"
      ref="sliderRef"
      :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      @mousedown.passive="startDrag"
      @touchstart.passive.stop="startDrag"
    >
      <div class="bg-default relative w-full rounded-full" :class="sizeClass.track">
        <div
          class="absolute h-full rounded-full"
          :class="tone.fill"
          :style="{ width: fillerWidth }"
        />

        <!-- Tick marks -->
        <span
          v-for="(mark, i) in normalizedMarks"
          :key="i"
          class="pointer-events-none absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
          :class="mark.percent <= percent ? 'bg-content1/70' : 'bg-default-400'"
          :style="{ left: mark.percent + '%' }"
        />

        <div
          class="absolute top-1/2"
          :style="thumbStyle"
          @mouseenter="interacting = true"
          @mouseleave="!dragging && (interacting = false)"
        >
          <!-- Value tooltip -->
          <Transition
            enter-active-class="transition duration-kun-base ease-kun-out"
            enter-from-class="opacity-0 translate-y-1"
            leave-active-class="transition duration-kun-exit ease-kun-in"
            leave-to-class="opacity-0 translate-y-1"
          >
            <span
              v-if="tooltipVisible"
              class="bg-content1 text-foreground border-kun pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-kun-sm border px-2 py-0.5 text-xs font-medium tabular-nums shadow-kun-sm"
            >
              {{ display }}
            </span>
          </Transition>

          <div
            class="bg-content1 rounded-full border-2 transition-shadow duration-kun-fast hover:ring-4 focus-visible:ring-4 focus-visible:outline-none active:ring-4"
            :class="[
              sizeClass.thumb,
              tone.thumb,
              tone.halo,
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
            ]"
            role="slider"
            :tabindex="disabled ? -1 : 0"
            :aria-label="ariaLabel || (label ? undefined : 'slider')"
            :aria-labelledby="label ? `${kunUniqueId}-label` : undefined"
            :aria-valuenow="value"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuetext="formatValue ? display : undefined"
            :aria-disabled="disabled || undefined"
            aria-orientation="horizontal"
            @mousedown.passive="startDrag"
            @touchstart.passive.stop="startDrag"
            @keydown="onKeydown"
            @focus="interacting = true"
            @blur="!dragging && (interacting = false)"
          />
        </div>
      </div>

      <!-- Mark labels -->
      <div v-if="normalizedMarks.some((m) => m.label)" class="relative mt-1 h-4">
        <span
          v-for="(mark, i) in normalizedMarks"
          v-show="mark.label"
          :key="i"
          class="text-default-500 absolute -translate-x-1/2 text-xs whitespace-nowrap"
          :style="{ left: mark.percent + '%' }"
        >
          {{ mark.label }}
        </span>
      </div>
    </div>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
    <p v-else-if="description" class="text-default-500 mt-1 text-sm">
      {{ description }}
    </p>
  </div>
</template>
