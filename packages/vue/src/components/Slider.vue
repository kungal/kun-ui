<script lang="ts" setup>
import { computed, onUnmounted, reactive, ref } from 'vue'
import { type KunUISize } from '@kungal/ui-core'
import type { KunSliderProps } from './types'

defineOptions({ name: 'KunSlider' })

const value = defineModel<number>({ required: true })
const props = withDefaults(defineProps<KunSliderProps>(), {
  min: 17,
  max: 77,
  step: 1,
  size: 'md',
})

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
const size = computed(() => sliderSizes[props.size])

const sliderRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const state = reactive({
  min: props.min,
  max: props.max,
  step: props.step,
})

const fillerWidth = computed(
  () => ((value.value - state.min) / (state.max - state.min)) * 100 + '%'
)

const thumbStyle = computed(() => ({
  left: fillerWidth.value,
  transform: 'translate(-50%, -50%)',
}))

const startDrag = (e: MouseEvent | TouchEvent) => {
  dragging.value = true
  updateSliderValue(e)
  window.addEventListener('mousemove', updateSliderValue)
  window.addEventListener('touchmove', updateSliderValue)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
}

const stopDrag = () => {
  dragging.value = false
  window.removeEventListener('mousemove', updateSliderValue)
  window.removeEventListener('touchmove', updateSliderValue)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
}

const updateSliderValue = (e: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]!.clientX
  const newValue =
    ((clientX - rect.left) / rect.width) * (state.max - state.min) + state.min
  value.value = Math.min(
    state.max,
    Math.max(state.min, Math.round(newValue / state.step) * state.step)
  )
}

// Keyboard support (WCAG 2.1.1): arrows / Home / End / PageUp / PageDown.
const onKeydown = (e: KeyboardEvent) => {
  const s = state.step || 1
  let next = value.value
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = value.value + s
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = value.value - s
      break
    case 'PageUp':
      next = value.value + s * 10
      break
    case 'PageDown':
      next = value.value - s * 10
      break
    case 'Home':
      next = state.min
      break
    case 'End':
      next = state.max
      break
    default:
      return
  }
  e.preventDefault()
  value.value = Math.min(state.max, Math.max(state.min, next))
}

onUnmounted(() => {
  stopDrag()
})
</script>

<template>
  <div
    class="kun-slider"
    ref="sliderRef"
    @mousedown.passive="startDrag"
    @touchstart.passive.stop="startDrag"
  >
    <div class="bg-default relative w-full rounded-full" :class="size.track">
      <div
        class="bg-primary absolute h-full rounded-full"
        :style="{ width: fillerWidth }"
      />
      <div
        class="border-primary bg-content1 absolute top-[50%] cursor-grab rounded-full border-2 transition-shadow duration-150 hover:ring-4 hover:ring-primary/20 focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none active:cursor-grabbing active:border-3 active:ring-4 active:ring-primary/25"
        :class="size.thumb"
        role="slider"
        :style="thumbStyle"
        @mousedown.passive="startDrag"
        @touchstart.passive.stop="startDrag"
        @keydown="onKeydown"
        :tabindex="0"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
        aria-orientation="horizontal"
      />
    </div>
  </div>
</template>
