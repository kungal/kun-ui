<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  cn,
  kunRoundedClasses,
  kunFocusRingWithinClasses,
  type KunUISize,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunNumberInputProps } from './types'

defineOptions({ name: 'KunNumberInput', inheritAttrs: false })

const props = withDefaults(defineProps<KunNumberInputProps>(), {
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  size: 'md',
  color: 'primary',
  label: '',
  placeholder: '',
  error: '',
  description: '',
  isInvalid: false,
  disabled: false,
  readonly: false,
  required: false,
  controls: true,
  precision: undefined,
  darkBorder: true,
  rounded: undefined,
  name: undefined,
  ariaLabel: '',
})

const modelValue = defineModel<number | null>({ default: null })

const emit = defineEmits<{
  change: [value: number | null]
}>()

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])
const kunUniqueId = useKunUniqueId('kun-number')

const invalid = computed(() => !!props.error || props.isInvalid)

// Vertical padding + text size mirror kunControlSizeClasses so a NumberInput
// lines up in a row with a Button/Input of the same size; the stepper buttons
// supply the horizontal inset.
const sizeMap: Record<KunUISize, { text: string; py: string; btn: string }> = {
  xs: { text: 'text-xs', py: 'py-1', btn: 'px-2' },
  sm: { text: 'text-sm', py: 'py-1.5', btn: 'px-2.5' },
  md: { text: 'text-sm', py: 'py-2', btn: 'px-3' },
  lg: { text: 'text-base', py: 'py-2.5', btn: 'px-3.5' },
  xl: { text: 'text-lg', py: 'py-3', btn: 'px-4' },
}
const sz = computed(() => sizeMap[props.size])

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const display = ref('')

const format = (n: number | null): string => {
  if (n === null || Number.isNaN(n)) return ''
  return props.precision != null ? n.toFixed(props.precision) : String(n)
}

const round = (n: number) =>
  props.precision != null ? Number(n.toFixed(props.precision)) : n
const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n))

// Keep the visible string in sync with the model unless the user is typing.
watch(
  modelValue,
  (v) => {
    if (!focused.value) display.value = format(v)
  },
  { immediate: true }
)

const setValue = (n: number | null) => {
  const next = n === null ? null : round(clamp(n))
  // Sync the display from the freshly-computed value, NOT from modelValue.value:
  // defineModel propagation lags a tick, so reading it back here would show the
  // previous value (off-by-one). This also snaps "999 over a max of 100" → 100.
  display.value = format(next)
  if (next !== modelValue.value) {
    modelValue.value = next
    emit('change', next)
  }
}

const onInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  display.value = raw
  if (raw === '' ) {
    if (modelValue.value !== null) {
      modelValue.value = null
      emit('change', null)
    }
    return
  }
  // Allow a lone '-' / partial decimal mid-type without committing.
  if (raw === '-' || raw === '.' || raw === '-.') return
  const n = Number(raw)
  if (!Number.isNaN(n) && modelValue.value !== n) {
    modelValue.value = n
    emit('change', n)
  }
}

const commit = () => {
  focused.value = false
  if (display.value === '' || display.value === '-' || display.value === '.') {
    setValue(null)
    return
  }
  const n = Number(display.value)
  setValue(Number.isNaN(n) ? null : n)
}

const stepBy = (dir: 1 | -1) => {
  if (props.disabled || props.readonly) return
  const base =
    modelValue.value ?? (Number.isFinite(props.min) ? props.min : 0)
  setValue(base + dir * props.step)
  inputRef.value?.focus()
}

// A null (empty) value can always step (it resolves to a base in stepBy); only
// a concrete value at the bound disables the stepper. The previous `?? min`
// form wrongly disabled "−" for an empty field with no min (−∞ > −∞ === false).
const canDecrement = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (modelValue.value === null || modelValue.value > props.min)
)
const canIncrement = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (modelValue.value === null || modelValue.value < props.max)
)

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      stepBy(1)
      break
    case 'ArrowDown':
      e.preventDefault()
      stepBy(-1)
      break
    case 'PageUp':
      e.preventDefault()
      setValue((modelValue.value ?? 0) + props.step * 10)
      break
    case 'PageDown':
      e.preventDefault()
      setValue((modelValue.value ?? 0) - props.step * 10)
      break
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="kunUniqueId"
      class="text-default-700 mb-1 block text-sm font-medium"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div
      :class="
        cn(
          'flex w-full items-stretch overflow-hidden border transition-[color,box-shadow]',
          roundedClass,
          sz.text,
          invalid
            ? cn('border-danger-300', kunFocusRingWithinClasses.danger)
            : cn('border-kun', kunFocusRingWithinClasses[color]),
          disabled && 'bg-default-100 cursor-not-allowed'
        )
      "
    >
      <button
        v-if="controls"
        type="button"
        tabindex="-1"
        :disabled="!canDecrement"
        :class="
          cn(
            'text-default-600 hover:bg-default-100 flex items-center disabled:cursor-not-allowed disabled:opacity-40',
            sz.btn
          )
        "
        aria-label="减少"
        @click="stepBy(-1)"
      >
        <KunIcon name="lucide:minus" class="size-4" />
      </button>

      <input
        :id="kunUniqueId"
        ref="inputRef"
        v-bind="$attrs"
        :value="display"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        :aria-label="ariaLabel || (label ? undefined : 'number input')"
        :aria-valuenow="modelValue ?? undefined"
        :aria-valuemin="Number.isFinite(min) ? min : undefined"
        :aria-valuemax="Number.isFinite(max) ? max : undefined"
        :aria-invalid="invalid || undefined"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="
          cn(
            'min-w-0 flex-1 bg-transparent tabular-nums outline-none disabled:cursor-not-allowed',
            sz.py,
            controls ? 'px-2 text-center' : 'px-3.5'
          )
        "
        @input="onInput"
        @focus="focused = true"
        @blur="commit"
        @keydown="onKeydown"
      />

      <button
        v-if="controls"
        type="button"
        tabindex="-1"
        :disabled="!canIncrement"
        :class="
          cn(
            'text-default-600 hover:bg-default-100 flex items-center disabled:cursor-not-allowed disabled:opacity-40',
            sz.btn
          )
        "
        aria-label="增加"
        @click="stepBy(1)"
      >
        <KunIcon name="lucide:plus" class="size-4" />
      </button>
    </div>

    <input v-if="name" type="hidden" :name="name" :value="modelValue ?? ''" />

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
    <p v-else-if="description" class="text-default-500 mt-1 text-sm">
      {{ description }}
    </p>
  </div>
</template>
