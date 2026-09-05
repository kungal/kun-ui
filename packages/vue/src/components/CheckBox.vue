<script setup lang="ts">
import {
  cn,
  kunSelectionSizeClasses,
  kunFocusRingClasses,
  kunSolidFgClasses,
  type KunUIColor,
  type KunUISize,
} from '@kungal/ui-core'
import { computed, ref, watchEffect } from 'vue'
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
  indeterminate: false,
  error: '',
  description: '',
  className: '',
  size: 'md',
})

// Shared selection scale — a checkbox matches a radio of the same size.
const size = computed(() => kunSelectionSizeClasses[props.size])
// The indeterminate dash: a thin white bar ~60% of the box, scaled per size.
const dashWidth: Record<KunUISize, string> = {
  xs: 'w-2',
  sm: 'w-2.5',
  md: 'w-2.5',
  lg: 'w-3',
  xl: 'w-3.5',
}

const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** The new checked state, from a user toggle. */
  change: [value: boolean]
}>()

const kunUniqueId = useKunUniqueId('kun-checkbox')

// `indeterminate` is a DOM property, not an attribute — it can't be bound in
// the template, so mirror the prop onto the element directly.
const inputRef = ref<HTMLInputElement | null>(null)
watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
})

const updateValue = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  modelValue.value = checked
  emit('change', checked)
}

// The filled box uses the semantic accent (`bg-{c}`) — mode-correct by token, no
// `dark:` pin — and its mark colour is the generated on-color (kunSolidFgClasses,
// white on medium hues, a dark tint on the bright ones), so the check/dash stays
// legible on every fill in both modes.
const colorClasses: Record<KunUIColor, string> = {
  default: 'border-default-300 checked:bg-default checked:border-default hover:border-default',
  primary: 'border-primary-300 checked:bg-primary checked:border-primary hover:border-primary',
  secondary: 'border-secondary-300 checked:bg-secondary checked:border-secondary hover:border-secondary',
  success: 'border-success-300 checked:bg-success checked:border-success hover:border-success',
  warning: 'border-warning-300 checked:bg-warning checked:border-warning hover:border-warning',
  danger: 'border-danger-300 checked:bg-danger checked:border-danger hover:border-danger',
  info: 'border-info-300 checked:bg-info checked:border-info hover:border-info',
}
// Filled look for the indeterminate state (no :checked pseudo to lean on).
const indeterminateColor: Record<KunUIColor, string> = {
  default: 'bg-default border-default',
  primary: 'bg-primary border-primary',
  secondary: 'bg-secondary border-secondary',
  success: 'bg-success border-success',
  warning: 'bg-warning border-warning',
  danger: 'bg-danger border-danger',
  info: 'bg-info border-info',
}

// The check / dash mark colour — the fill's generated on-color. The dash is drawn
// with `bg-current` so it inherits this same color without needing its own map.
const markFg = computed(() => kunSolidFgClasses[props.color])
</script>

<template>
  <div>
    <div :class="cn('flex cursor-pointer items-center', size.gap, className)">
      <div class="relative flex items-center">
        <input
          :id="kunUniqueId"
          ref="inputRef"
          type="checkbox"
          :name="name"
          :value="value"
          :checked="modelValue"
          :disabled="disabled"
          :aria-describedby="error || description ? `${kunUniqueId}-desc` : undefined"
          :class="
            cn(
              'peer cursor-pointer appearance-none border-2 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50',
              kunFocusRingClasses[props.color],
              size.box,
              // A fixed % keeps the box a rounded square at every size — a token
              // radius (now 12px) would make the small boxes look circular.
              props.type === 'single' ? 'rounded-full' : 'rounded-[35%]',
              indeterminate ? indeterminateColor[props.color] : colorClasses[props.color]
            )
          "
          @change="updateValue"
        />
        <!-- Check glyph (checked, not indeterminate) -->
        <div
          v-show="!indeterminate"
          :class="
            cn(
              'pointer-events-none absolute inset-0 flex scale-50 items-center justify-center opacity-0 transition-all duration-kun-fast ease-kun-emphasized peer-checked:scale-100 peer-checked:opacity-100',
              markFg
            )
          "
        >
          <KunIcon name="lucide:check" :class="size.check" />
        </div>
        <!-- Indeterminate dash -->
        <div
          v-show="indeterminate"
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            class="h-0.5 rounded-full bg-current"
            :class="[dashWidth[props.size], markFg]"
          />
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

    <p
      v-if="error"
      :id="`${kunUniqueId}-desc`"
      class="text-danger mt-1 text-sm"
    >
      {{ error }}
    </p>
    <p
      v-else-if="description"
      :id="`${kunUniqueId}-desc`"
      class="text-default-500 mt-1 text-sm"
    >
      {{ description }}
    </p>
  </div>
</template>
