<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useSlots } from 'vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunInputProps } from './types'

defineOptions({ name: 'KunInput', inheritAttrs: false })

const props = withDefaults(defineProps<KunInputProps>(), {
  type: 'text',
  color: 'default',
  className: '',
  label: '',
  placeholder: '',
  helperText: '',
  description: '',
  error: '',
  isInvalid: false,
  isClearable: false,
  revealPassword: false,
  size: 'md',
  required: false,
  disabled: false,
  darkBorder: true,
  autofocus: false,
  rounded: undefined,
})

const slots = useSlots()

// `description` is the canonical helper name; `helperText` is the deprecated alias.
const helper = computed(() => props.description || props.helperText)
// Invalid styling fires for an error message OR an explicit isInvalid flag.
const invalid = computed(() => !!props.error || props.isInvalid)

// Password reveal: swap the rendered type without mutating the prop.
const isPassword = computed(() => props.type === 'password')
const isRevealed = ref(false)
const resolvedType = computed(() =>
  isPassword.value && isRevealed.value ? 'text' : props.type
)

const hasValue = computed(
  () => modelValue.value != null && String(modelValue.value).length > 0
)
const showClear = computed(
  () => props.isClearable && !props.disabled && hasValue.value
)
const showReveal = computed(
  () => isPassword.value && props.revealPassword && !props.disabled
)
// Right padding grows with the number of trailing controls (suffix slot +
// clear + reveal) so text never slides under them.
const trailingCount = computed(
  () => (slots.suffix ? 1 : 0) + (showClear.value ? 1 : 0) + (showReveal.value ? 1 : 0)
)
const rightPadClass = computed(
  () => ['', 'pr-10', 'pr-[4.5rem]', 'pr-28'][Math.min(trailingCount.value, 3)]
)

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const modelValue = defineModel<string | number>({ default: '' })

const emits = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  clear: []
}>()

const input = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const kunUniqueId = useKunUniqueId('kun-input')

const sizeClasses = computed(() => {
  // Shared form-control scale, so a button + input in the same row line up.
  // See kunControlSizeClasses.
  return kunControlSizeClasses[props.size]
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

const clear = () => {
  modelValue.value = ''
  emits('clear')
  nextTick(() => input.value?.focus())
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
        :type="resolvedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-describedby="(helper || error) ? `${kunUniqueId}-desc` : undefined"
        :class="
          cn(
            'block w-full bg-content1 shadow-kun-sm transition-[color,box-shadow] duration-kun-fast ease-kun-standard',
            roundedClass,
            sizeClasses,
            $slots.prefix && 'pl-10',
            rightPadClass,
            disabled && 'cursor-not-allowed opacity-60',
            invalid
              ? cn('ring-2 ring-danger/60', kunFocusRingClasses.danger)
              : kunFocusRingClasses[color],
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
        v-if="$slots.suffix || showClear || showReveal"
        class="absolute inset-y-0 right-0 flex items-center gap-1 pr-3"
      >
        <slot name="suffix" />
        <button
          v-if="showClear"
          type="button"
          tabindex="-1"
          class="text-default-400 hover:text-default-600 flex items-center"
          aria-label="清除"
          @click="clear"
        >
          <KunIcon name="lucide:circle-x" class="size-4" />
        </button>
        <button
          v-if="showReveal"
          type="button"
          tabindex="-1"
          class="text-default-400 hover:text-default-600 flex items-center"
          :aria-label="isRevealed ? '隐藏密码' : '显示密码'"
          :aria-pressed="isRevealed"
          @click="isRevealed = !isRevealed"
        >
          <KunIcon :name="isRevealed ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
        </button>
      </div>
    </div>

    <p
      v-if="error"
      :id="`${kunUniqueId}-desc`"
      class="text-danger mt-1 text-sm"
    >
      {{ error }}
    </p>
    <p
      v-else-if="helper"
      :id="`${kunUniqueId}-desc`"
      class="text-default-500 mt-1 text-sm"
    >
      {{ helper }}
    </p>
  </div>
</template>
