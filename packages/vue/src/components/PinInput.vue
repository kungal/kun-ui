<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  cn,
  kunRoundedClasses,
  kunFocusRingClasses,
  type KunUISize,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import type { KunPinInputProps } from './types'

defineOptions({ name: 'KunPinInput' })

const props = withDefaults(defineProps<KunPinInputProps>(), {
  length: 6,
  type: 'numeric',
  mask: false,
  size: 'md',
  color: 'primary',
  disabled: false,
  isInvalid: false,
  autofocus: false,
  placeholder: '',
  rounded: undefined,
  name: undefined,
  ariaLabel: '验证码',
})

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  /** Fired once every cell is filled. */
  complete: [value: string]
}>()

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// Per-cell character buffer; the model is the joined string.
const chars = ref<string[]>(Array.from({ length: props.length }, () => ''))

const syncFromModel = (v: string) => {
  const next = Array.from({ length: props.length }, (_, i) => v[i] ?? '')
  // Only overwrite when it actually differs, so cursor/IME state is preserved.
  // '\u0000' as the escape, never a literal NUL byte: one in the source makes
  // ripgrep/grep classify this whole file as binary and skip it, which is how a
  // repo-wide `.focus()` audit walked straight past focusCell below.
  if (next.join('\u0000') !== chars.value.join('\u0000')) chars.value = next
}
watch(() => modelValue.value, syncFromModel, { immediate: true })
watch(
  () => props.length,
  () => {
    // Drop refs to cells that no longer exist when length shrinks (the
    // function-ref only writes truthy els, so it can't clear them itself).
    inputs.value.length = props.length
    syncFromModel(modelValue.value)
  }
)

const cellSize: Record<KunUISize, string> = {
  xs: 'size-8 text-sm',
  sm: 'size-9 text-base',
  md: 'size-11 text-lg',
  lg: 'size-12 text-xl',
  xl: 'size-14 text-2xl',
}

const inputs = ref<HTMLInputElement[]>([])
const setInput = (el: unknown, idx: number) => {
  if (el) inputs.value[idx] = el as HTMLInputElement
}

const focusCell = (idx: number) => {
  const el = inputs.value[idx]
  if (el) {
    el.focus({ preventScroll: true })
    el.select()
  }
}

const sanitize = (s: string) =>
  props.type === 'numeric' ? s.replace(/\D/g, '') : s

const commit = () => {
  modelValue.value = chars.value.join('')
  if (chars.value.every((c) => c !== '')) emit('complete', chars.value.join(''))
}

const onInput = (idx: number, e: Event) => {
  const target = e.target as HTMLInputElement
  let v = sanitize(target.value)
  // Keep only the last typed character (overwrite behavior).
  v = v.slice(-1)
  chars.value[idx] = v
  target.value = v
  commit()
  if (v && idx < props.length - 1) nextTick(() => focusCell(idx + 1))
}

const onKeydown = (idx: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace') {
    if (chars.value[idx]) {
      chars.value[idx] = ''
      commit()
    } else if (idx > 0) {
      e.preventDefault()
      chars.value[idx - 1] = ''
      commit()
      focusCell(idx - 1)
    }
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    e.preventDefault()
    focusCell(idx - 1)
  } else if (e.key === 'ArrowRight' && idx < props.length - 1) {
    e.preventDefault()
    focusCell(idx + 1)
  } else if (e.key === 'Home') {
    e.preventDefault()
    focusCell(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    focusCell(props.length - 1)
  }
}

const onPaste = (idx: number, e: ClipboardEvent) => {
  e.preventDefault()
  const text = sanitize(e.clipboardData?.getData('text') ?? '')
  if (!text) return
  let i = idx
  for (const ch of text) {
    if (i >= props.length) break
    chars.value[i] = ch
    i++
  }
  commit()
  nextTick(() => focusCell(Math.min(i, props.length - 1)))
}

onMounted(() => {
  if (props.autofocus) focusCell(0)
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2"
    role="group"
    :aria-label="ariaLabel"
  >
    <input
      v-for="(_, idx) in length"
      :key="idx"
      :ref="(el) => setInput(el, idx)"
      :value="mask && chars[idx] ? '•' : chars[idx]"
      :type="'text'"
      :inputmode="type === 'numeric' ? 'numeric' : 'text'"
      :autocomplete="idx === 0 ? 'one-time-code' : 'off'"
      maxlength="1"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-label="`${ariaLabel} 第 ${idx + 1} 位`"
      :aria-invalid="isInvalid || undefined"
      :class="
        cn(
          'bg-content1 shadow-kun-sm border text-foreground text-center font-medium tabular-nums transition-[color,box-shadow] outline-none',
          roundedClass,
          cellSize[size],
          isInvalid
            ? cn('border-danger-300', kunFocusRingClasses.danger)
            : cn('border-kun', kunFocusRingClasses[color]),
          disabled && 'cursor-not-allowed opacity-60'
        )
      "
      @input="(e) => onInput(idx, e)"
      @keydown="(e) => onKeydown(idx, e)"
      @paste="(e) => onPaste(idx, e)"
      @focus="(e) => (e.target as HTMLInputElement).select()"
    />
    <input v-if="name" type="hidden" :name="name" :value="modelValue" />
  </div>
</template>
