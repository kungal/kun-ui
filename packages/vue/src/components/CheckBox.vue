<script setup lang="ts">
import { cn, kunSelectionSizeClasses, type KunUIColor } from '@kungal/ui-core'
import { computed } from 'vue'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunCheckBoxProps } from './types'

defineOptions({ name: 'KunCheckBox' })

const props = withDefaults(defineProps<KunCheckBoxProps>(), {
  color: 'default',
  type: 'multiple',
  label: undefined,
  id: undefined,
  name: undefined,
  value: undefined,
  disabled: false,
  className: '',
  size: 'md',
})

// Shared selection scale — a checkbox matches a radio of the same size.
const size = computed(() => kunSelectionSizeClasses[props.size])

const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  change: [value: boolean]
}>()

const kunUniqueId = useKunUniqueId('kun-checkbox')

const updateValue = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  modelValue.value = checked
  emit('change', checked)
}

const colorClasses: Record<KunUIColor, string> = {
  default:
    'border-default-300 checked:bg-default checked:border-default hover:border-default',
  primary:
    'border-primary-300 checked:bg-primary checked:border-primary hover:border-primary',
  secondary:
    'border-secondary-300 checked:bg-secondary checked:border-secondary hover:border-secondary',
  success:
    'border-success-300 checked:bg-success checked:border-success hover:border-success',
  warning:
    'border-warning-300 checked:bg-warning checked:border-warning hover:border-warning',
  danger:
    'border-danger-300 checked:bg-danger checked:border-danger hover:border-danger',
  info: 'border-info-300 checked:bg-info checked:border-info hover:border-info',
}
</script>

<template>
  <div :class="cn('flex cursor-pointer items-center', size.gap, className)">
    <div class="relative flex items-center">
      <input
        :id="kunUniqueId"
        type="checkbox"
        :name="name"
        :value="value"
        :checked="modelValue"
        :disabled="disabled"
        :class="
          cn(
            'peer cursor-pointer appearance-none border-2 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50',
            size.box,
            // A fixed % keeps the box a rounded square at every size — a token
            // radius (now 12px) would make the small boxes look circular.
            props.type === 'single' ? 'rounded-full' : 'rounded-[35%]',
            colorClasses[props.color]
          )
        "
        @change="updateValue"
      />
      <div
        class="pointer-events-none absolute inset-0 flex scale-50 items-center justify-center text-white opacity-0 transition-all duration-200 ease-out peer-checked:scale-100 peer-checked:opacity-100"
      >
        <KunIcon name="lucide:check" :class="size.check" />
      </div>
    </div>
    <slot />
    <label
      v-if="label"
      :for="kunUniqueId"
      :class="
        cn(
          'text-default-700 cursor-pointer select-none',
          size.text,
          disabled && 'cursor-not-allowed opacity-50'
        )
      "
    >
      {{ label }}
    </label>
  </div>
</template>
