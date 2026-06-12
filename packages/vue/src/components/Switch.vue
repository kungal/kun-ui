<script setup lang="ts">
import { computed } from 'vue'
import { cn, type KunUISize } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import type { KunSwitchProps } from './types'

defineOptions({ name: 'KunSwitch' })

const props = withDefaults(defineProps<KunSwitchProps>(), {
  label: '',
  className: '',
  disabled: false,
  labelClassName: '',
  size: 'md',
})

const modelValue = defineModel<boolean>({ required: true })
const kunUniqueId = useKunUniqueId('kun-switch')

// Clean-step scale: thumb = track height − 4 (2px inset all round); the on-state
// translate = trackWidth − thumb − 4, so every value lands on a real Tailwind
// step. `md` is the original switch size (unchanged).
interface SwitchSize {
  track: string
  thumb: string
  translate: string
  text: string
  gap: string
}
const switchSizes: Record<KunUISize, SwitchSize> = {
  xs: { track: 'h-4 w-7', thumb: 'size-3', translate: 'translate-x-3', text: 'text-xs', gap: 'ml-2' },
  sm: { track: 'h-5 w-9', thumb: 'size-4', translate: 'translate-x-4', text: 'text-sm', gap: 'ml-2.5' },
  md: { track: 'h-6 w-11', thumb: 'size-5', translate: 'translate-x-5', text: 'text-sm', gap: 'ml-3' },
  lg: { track: 'h-7 w-14', thumb: 'size-6', translate: 'translate-x-7', text: 'text-base', gap: 'ml-3' },
  xl: { track: 'h-8 w-16', thumb: 'size-7', translate: 'translate-x-8', text: 'text-lg', gap: 'ml-3.5' },
}
const size = computed(() => switchSizes[props.size])
</script>

<template>
  <label
    :class="
      cn(
        'inline-flex cursor-pointer items-center',
        disabled ? 'cursor-not-allowed' : '',
        className
      )
    "
  >
    <input
      :id="kunUniqueId"
      type="checkbox"
      class="peer sr-only"
      :checked="modelValue"
      :disabled="disabled"
      @change="(event) => (modelValue = (event.target as HTMLInputElement).checked)"
    />

    <div class="relative">
      <div
        class="rounded-full transition-colors duration-200 ease-in-out"
        :class="[
          size.track,
          modelValue ? 'bg-primary-500' : 'bg-default-500',
          disabled ? 'opacity-50' : '',
          modelValue && disabled ? 'bg-primary-300' : '',
        ]"
      />
      <div
        :class="
          cn(
            'absolute top-0.5 left-0.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
            size.thumb,
            modelValue ? size.translate : 'translate-x-0'
          )
        "
      />
    </div>

    <span
      v-if="label"
      :class="
        cn(
          'font-medium',
          size.gap,
          size.text,
          disabled ? 'text-default-400' : '',
          labelClassName
        )
      "
    >
      {{ label }}
    </span>
  </label>
</template>
