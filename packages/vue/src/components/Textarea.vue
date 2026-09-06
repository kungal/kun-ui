<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import type { KunTextareaProps } from './types'

defineOptions({ name: 'KunTextarea' })

const props = withDefaults(defineProps<KunTextareaProps>(), {
  placeholder: '',
  label: '',
  name: '',
  hint: '',
  description: '',
  error: '',
  maxHeight: '',
  disabled: false,
  readonly: false,
  required: false,
  autofocus: false,
  showCharCount: false,
  autoGrow: false,
  rows: 4,
  maxlength: 100007,
  minlength: 1,
  resize: 'none',
  darkBorder: true,
  rounded: undefined,
  size: 'md',
  color: 'default',
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// `description` is the canonical helper name; `hint` is the deprecated alias.
const helper = computed(() => props.description || props.hint)

/** The textarea's text, two-way bound with `v-model`. */
const modelValue = defineModel<string>({ default: '' })

const kunUniqueId = useKunUniqueId('kun-textarea')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const emits = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()

watch(modelValue, () => {
  if (props.autoGrow) {
    nextTick(() => adjustHeight())
  }
})

const onInput = (event: Event) => {
  emits('input', event)
  if (props.autoGrow) {
    adjustHeight()
  }
}

const adjustHeight = () => {
  if (!textareaRef.value) return
  textareaRef.value.style.height = 'auto'
  let newHeight = textareaRef.value.scrollHeight + 'px'
  if (props.maxHeight && parseInt(newHeight) > parseInt(props.maxHeight)) {
    newHeight = props.maxHeight
  }
  textareaRef.value.style.height = newHeight
}

onMounted(() => {
  // Defer the first auto-grow measurement to the next frame. Measuring
  // scrollHeight synchronously here can read a too-tall value before the
  // textarea is laid out (notably a chat input that first appears on mobile),
  // which only self-corrected on the first keystroke. rAF runs after layout.
  if (props.autoGrow && textareaRef.value) {
    requestAnimationFrame(() => adjustHeight())
  }
  if (props.autofocus && textareaRef.value)
    textareaRef.value.focus({ preventScroll: true })
})

const insertAtCaret = (text: string) => {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  modelValue.value = el.value.slice(0, start) + text + el.value.slice(end)
  nextTick(() => {
    if (!textareaRef.value) return
    const pos = start + text.length
    textareaRef.value.setSelectionRange(pos, pos)
    textareaRef.value.focus({ preventScroll: true })
  })
}

defineExpose({
  focus: (options?: FocusOptions) => textareaRef.value?.focus(options),
  blur: () => textareaRef.value?.blur(),
  select: () => textareaRef.value?.select(),
  insertAtCaret,
  textareaRef,
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
      <span v-if="required" class="text-danger ml-1">*</span>
    </label>

    <div class="relative">
      <textarea
        :id="kunUniqueId"
        ref="textareaRef"
        v-model="modelValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :rows="rows"
        :autofocus="autofocus"
        :class="
          cn(
            'scrollbar-hide w-full bg-content1 shadow-kun-sm border transition-[color,box-shadow] duration-kun-fast ease-kun-standard',
            kunControlSizeClasses[props.size],
            roundedClass,
            error
              ? cn('border-danger-300', kunFocusRingClasses.danger)
              : cn('border-kun', kunFocusRingClasses[color]),
            disabled ? 'text-default-500 cursor-not-allowed opacity-60 shadow-none' : '',
            resize === 'none'
              ? 'resize-none'
              : resize === 'vertical'
                ? 'resize-y'
                : resize === 'horizontal'
                  ? 'resize-x'
                  : 'resize'
          )
        "
        @input="onInput"
        @blur="(event) => emits('blur', event)"
        @focus="(event) => emits('focus', event)"
      />

      <div
        v-if="maxlength && showCharCount"
        class="text-default-500 absolute right-2 bottom-2 text-xs"
      >
        {{ modelValue.length }}/{{ maxlength }}
      </div>
    </div>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
    <p v-else-if="helper" class="text-default-500 mt-1 text-sm">{{ helper }}</p>
  </div>
</template>
