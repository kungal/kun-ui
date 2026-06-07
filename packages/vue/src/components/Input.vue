<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { cn, kunRoundedClasses, type KunUIColor } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import type { KunInputProps } from './types'

defineOptions({ name: 'KunInput', inheritAttrs: false })

const props = withDefaults(defineProps<KunInputProps>(), {
  type: 'text',
  color: 'default',
  className: '',
  label: '',
  placeholder: '',
  helperText: '',
  error: '',
  size: 'md',
  required: false,
  disabled: false,
  darkBorder: true,
  autofocus: false,
  rounded: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const modelValue = defineModel<string | number>({ default: '' })

const emits = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const input = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const kunUniqueId = useKunUniqueId('kun-input')

const colorClass: Record<KunUIColor, string> = {
  default: 'focus:ring-default',
  primary: 'focus:ring-primary',
  secondary: 'focus:ring-secondary',
  success: 'focus:ring-success',
  warning: 'focus:ring-warning',
  danger: 'focus:ring-danger',
  info: 'focus:ring-info',
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs px-2 py-1'
    case 'sm':
      return 'text-sm px-3 py-1.5'
    case 'lg':
      return 'text-base px-5 py-2.5'
    case 'xl':
      return 'text-lg px-6 py-3'
    case 'md':
    default:
      return 'text-sm px-4 py-2'
  }
})

const handleInput = (event: Event) => {
  modelValue.value = (event.target as HTMLInputElement).value
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emits('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emits('focus', event)
}

onMounted(() => {
  if (props.autofocus) {
    isFocused.value = true
    input.value?.focus()
  }
})

// Insert text at the caret (or replace the selection) and move the caret to
// the end of the inserted text. Symmetrical with KunTextarea.insertAtCaret.
const insertAtCaret = (text: string) => {
  const el = input.value
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  modelValue.value = el.value.slice(0, start) + text + el.value.slice(end)
  nextTick(() => {
    if (!input.value) return
    const pos = start + text.length
    input.value.setSelectionRange(pos, pos)
    input.value.focus()
  })
}

defineExpose({
  focus: () => input.value?.focus(),
  blur: () => input.value?.blur(),
  select: () => input.value?.select(),
  insertAtCaret,
  inputRef: input,
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

    <div class="relative">
      <input
        :id="kunUniqueId"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="
          cn(
            'border-default/20 block w-full border transition duration-150 ease-in-out focus:border-transparent focus:ring-2',
            roundedClass,
            colorClass[color],
            sizeClasses,
            darkBorder && 'dark:border-default-200',
            $slots.prefix && 'pl-10',
            $slots.suffix && 'pr-10',
            disabled && 'bg-default-100 cursor-not-allowed',
            error ? 'border-danger-300 focus:border-danger focus:ring-danger' : '',
            className
          )
        "
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <div
        v-if="$slots.prefix"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <slot name="prefix" />
      </div>

      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="helperText && !error" class="text-default-500 mt-1 text-sm">
      {{ helperText }}
    </p>

    <p v-if="error" class="text-danger mt-1 text-sm">
      {{ error }}
    </p>
  </div>
</template>
