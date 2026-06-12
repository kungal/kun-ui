<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  cn,
  kunRingClasses,
  kunRoundedClasses,
  kunVariantClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type { KunTagInputInvalidReason, KunTagInputProps } from './types'

defineOptions({ name: 'KunTagInput' })

const props = withDefaults(defineProps<KunTagInputProps>(), {
  label: '',
  placeholder: '',
  helperText: '',
  error: '',
  maxTags: Number.POSITIVE_INFINITY,
  maxTagLength: 100,
  minTagLength: 1,
  allowDuplicates: false,
  caseSensitive: false,
  trim: true,
  transform: undefined,
  validate: undefined,
  splitChars: () => ['\n', ',', '，', ';'],
  splitOnPaste: true,
  confirmOnBlur: true,
  respectComposition: true,
  color: 'primary',
  size: 'md',
  variant: 'bordered',
  disabled: false,
  readonly: false,
  showCounter: false,
  rounded: undefined,
  className: '',
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const tags = defineModel<string[]>({ default: () => [] })

const emit = defineEmits<{
  add: [tag: string]
  remove: [tag: string, index: number]
  invalid: [reason: KunTagInputInvalidReason, raw: string, detail?: string]
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const chipRefs = ref<HTMLElement[]>([])
const inputValue = ref('')
const isComposing = ref(false)

const setChipRef = (el: Element | { $el?: Element } | null, idx: number) => {
  const node =
    el && typeof el === 'object' && '$el' in el
      ? ((el as { $el?: Element }).$el ?? null)
      : (el as Element | null)
  if (node instanceof HTMLElement) chipRefs.value[idx] = node
}

// Two-stage Backspace: first press on empty input arms delete, second pops.
const canDeleteByBackspace = ref(false)

const kunUniqueId = useKunUniqueId('kun-tag-input')

const normalize = (raw: string): string => {
  let v = raw
  if (props.trim) v = v.trim()
  if (props.transform) v = props.transform(v)
  return v
}

const isDuplicate = (candidate: string, against: string[]): boolean => {
  if (props.caseSensitive) return against.includes(candidate)
  const lower = candidate.toLowerCase()
  return against.some((t) => t.toLowerCase() === lower)
}

const tryAdd = (raw: string): boolean => {
  const v = normalize(raw)
  if (!v) return false
  if (v.length < props.minTagLength) {
    emit('invalid', 'too-short', raw)
    return false
  }
  if (v.length > props.maxTagLength) {
    emit('invalid', 'too-long', raw)
    return false
  }
  if (tags.value.length >= props.maxTags) {
    emit('invalid', 'max-reached', raw)
    return false
  }
  if (!props.allowDuplicates && isDuplicate(v, tags.value)) {
    emit('invalid', 'duplicate', raw)
    return false
  }
  if (props.validate) {
    const result = props.validate(v, tags.value)
    if (result !== true) {
      emit('invalid', 'custom', raw, result)
      return false
    }
  }
  tags.value = [...tags.value, v]
  emit('add', v)
  return true
}

const splitAndAdd = (chunk: string): number => {
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts: string[] = []
  for (const d of props.splitChars) {
    if (d instanceof RegExp) {
      if (d.source) parts.push(`(?:${d.source})`)
    } else if (d) {
      parts.push(escape(d))
    }
  }
  if (!parts.length) return tryAdd(chunk) ? 1 : 0
  const re = new RegExp(parts.join('|'))
  const fragments = chunk.split(re)
  let added = 0
  for (const f of fragments) {
    if (tryAdd(f)) added++
  }
  return added
}

const removeAt = (index: number) => {
  if (props.disabled || props.readonly) return
  const removed = tags.value[index]
  if (removed === undefined) return
  tags.value = tags.value.filter((_, i) => i !== index)
  chipRefs.value.length = tags.value.length
  emit('remove', removed, index)
}

const commitPendingInput = () => {
  if (!inputValue.value) return false
  const added = splitAndAdd(inputValue.value)
  if (added > 0) {
    inputValue.value = ''
    return true
  }
  return false
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return
  if (e.key === 'Enter') {
    if (props.respectComposition && isComposing.value) return
    e.preventDefault()
    commitPendingInput()
    canDeleteByBackspace.value = false
    return
  }
  if (e.key === 'Backspace' && !inputValue.value && tags.value.length > 0) {
    if (e.repeat) return
    if (canDeleteByBackspace.value) {
      removeAt(tags.value.length - 1)
      canDeleteByBackspace.value = false
    } else {
      canDeleteByBackspace.value = true
    }
    return
  }
  if (e.key === 'ArrowLeft' && !inputValue.value && tags.value.length > 0) {
    e.preventDefault()
    const lastIdx = tags.value.length - 1
    chipRefs.value[lastIdx]?.focus()
    return
  }
  if (e.key !== 'Backspace') {
    canDeleteByBackspace.value = false
  }
}

const onChipKeydown = (e: KeyboardEvent, idx: number) => {
  if (props.disabled || props.readonly) return
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      if (idx > 0) chipRefs.value[idx - 1]?.focus()
      break
    case 'ArrowRight':
      e.preventDefault()
      if (idx < tags.value.length - 1) chipRefs.value[idx + 1]?.focus()
      else inputEl.value?.focus()
      break
    case 'Delete':
    case 'Backspace':
      e.preventDefault()
      removeAt(idx)
      nextTick(() => {
        if (idx > 0) chipRefs.value[idx - 1]?.focus()
        else inputEl.value?.focus()
      })
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      removeAt(idx)
      break
  }
}

const onCompositionStart = () => {
  isComposing.value = true
}
const onCompositionEnd = () => {
  isComposing.value = false
}

const onPaste = (e: ClipboardEvent) => {
  if (!props.splitOnPaste || props.disabled || props.readonly) return
  const text = e.clipboardData?.getData('text') ?? ''
  if (!text) return
  const hasSplit = props.splitChars.some((d) =>
    d instanceof RegExp ? d.test(text) : text.includes(d)
  )
  if (!hasSplit) return
  e.preventDefault()
  splitAndAdd(text)
}

const onBlur = () => {
  if (!props.confirmOnBlur) return
  commitPendingInput()
}

const focusInput = () => {
  if (props.disabled || props.readonly) return
  inputEl.value?.focus()
}

const sizeMinH: Record<string, string> = {
  xs: 'min-h-[30px]',
  sm: 'min-h-[34px]',
  md: 'min-h-[40px]',
  lg: 'min-h-[48px]',
  xl: 'min-h-[56px]',
}
const sizePadding: Record<string, string> = {
  xs: 'px-2 py-1 gap-1',
  sm: 'px-2.5 py-1.5 gap-1.5',
  md: 'px-3 py-2 gap-2',
  lg: 'px-3.5 py-2.5 gap-2',
  xl: 'px-4 py-3 gap-2.5',
}
const sizeText: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

const containerClasses = computed(() =>
  cn(
    'flex flex-wrap items-center transition-shadow',
    // .value: this cn() runs in <script>, where refs are NOT auto-unwrapped
    // (unlike templates) — passing the bare ref leaks its internal keys as
    // class names and causes an SSR hydration mismatch.
    roundedClass.value,
    sizeMinH[props.size],
    sizePadding[props.size],
    sizeText[props.size],
    props.variant === 'bordered' && 'border border-default-200',
    props.variant === 'flat' && 'bg-content2',
    kunRingClasses[props.color],
    'focus-within:ring-2',
    props.error && 'border-danger',
    props.disabled && 'opacity-50 cursor-not-allowed bg-default-100',
    props.readonly && 'cursor-default',
    props.className
  )
)

const chipSizeClass: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-xs gap-0.5',
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2 py-1 text-sm gap-1',
  lg: 'px-2.5 py-1 text-sm gap-1.5',
  xl: 'px-3 py-1.5 text-base gap-1.5',
}

const chipClasses = computed(() =>
  cn(
    'inline-flex items-center rounded-kun-sm font-medium select-none',
    // Tint with the same flat variant every other KunUI chip uses, so a tag's
    // color matches the rest of the UI instead of a one-off shade.
    kunVariantClasses('flat', props.color),
    chipSizeClass[props.size],
    'focus:outline-none focus:ring-2',
    kunRingClasses[props.color]
  )
)

const isAtMax = computed(() => tags.value.length >= props.maxTags)
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="kunUniqueId"
      class="text-default-700 mb-1 block text-sm font-medium"
    >
      {{ label }}
    </label>

    <div
      role="group"
      :aria-label="label || 'tag input'"
      :aria-invalid="!!error"
      :aria-disabled="disabled"
      :class="containerClasses"
      @click="focusInput"
    >
      <span
        v-for="(tag, index) in tags"
        :key="`${index}-${tag}`"
        :ref="(el) => setChipRef(el as Element | null, index)"
        :class="chipClasses"
        :tabindex="disabled || readonly ? -1 : 0"
        :aria-label="`标签 ${tag}`"
        @keydown="onChipKeydown($event, index)"
        @click.stop
      >
        <slot name="tag" :tag="tag" :index="index" :remove="() => removeAt(index)">
          <span>{{ tag }}</span>
          <button
            v-if="!readonly && !disabled"
            type="button"
            tabindex="-1"
            :aria-label="`移除标签 ${tag}`"
            class="hover:text-danger -mr-0.5 ml-1 inline-flex cursor-pointer rounded-full p-0.5 transition-colors focus:outline-none"
            @click.stop="removeAt(index)"
          >
            <KunIcon name="lucide:x" class="size-3.5" />
          </button>
        </slot>
      </span>

      <input
        v-if="!readonly"
        :id="kunUniqueId"
        ref="inputEl"
        v-model="inputValue"
        type="text"
        :placeholder="tags.length === 0 ? placeholder : ''"
        :disabled="disabled"
        :readonly="isAtMax"
        :aria-describedby="error || helperText ? `${kunUniqueId}-msg` : undefined"
        class="placeholder-default-400 min-w-[80px] flex-1 bg-transparent outline-none disabled:cursor-not-allowed read-only:cursor-not-allowed"
        @keydown="onKeydown"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @paste="onPaste"
        @blur="onBlur"
      />

      <span
        v-if="showCounter && maxTags !== Number.POSITIVE_INFINITY"
        class="text-default-400 ml-auto text-xs tabular-nums"
      >
        {{ tags.length }}/{{ maxTags }}
      </span>
    </div>

    <p v-if="error" :id="`${kunUniqueId}-msg`" class="text-danger mt-1 text-sm">
      {{ error }}
    </p>
    <p
      v-else-if="helperText"
      :id="`${kunUniqueId}-msg`"
      class="text-default-500 mt-1 text-sm"
    >
      {{ helperText }}
    </p>
  </div>
</template>
