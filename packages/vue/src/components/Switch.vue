<script setup lang="ts">
import { cn } from '@kungal/core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import type { KunSwitchProps } from './types'

defineOptions({ name: 'KunSwitch' })

withDefaults(defineProps<KunSwitchProps>(), {
  label: '',
  className: '',
  disabled: false,
  labelClassName: '',
})

const modelValue = defineModel<boolean>({ required: true })
const kunUniqueId = useKunUniqueId('kun-switch')
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
        class="h-6 w-11 rounded-full transition-colors duration-200 ease-in-out"
        :class="[
          modelValue ? 'bg-primary-500' : 'bg-default-500',
          disabled ? 'opacity-50' : '',
          modelValue && disabled ? 'bg-primary-300' : '',
        ]"
      />
      <div
        :class="
          cn(
            'absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
            modelValue ? 'translate-x-5' : 'translate-x-0'
          )
        "
      />
    </div>

    <span
      v-if="label"
      :class="
        cn(
          'ml-3 text-sm font-medium',
          disabled ? 'text-default-400' : '',
          labelClassName
        )
      "
    >
      {{ label }}
    </span>
  </label>
</template>
