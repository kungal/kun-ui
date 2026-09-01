<script setup lang="ts" generic="T extends KunRadioValue = KunRadioValue">
import { computed, nextTick, ref } from 'vue'
import {
  cn,
  kunBgClasses,
  kunBorderClasses,
  kunFocusRingClasses,
  kunSoftBgClasses,
  kunSolidClasses,
  kunTextClasses,
  kunRoundedClasses,
  kunSelectionSizeClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type {
  KunRadioGroupProps,
  KunRadioOption,
  KunRadioValue,
} from './types'

defineOptions({ name: 'KunRadioGroup' })

const props = withDefaults(defineProps<KunRadioGroupProps<T>>(), {
  variant: 'classic',
  orientation: 'vertical',
  color: 'primary',
  size: 'md',
  rounded: undefined,
  hideIndicator: false,
  disabled: false,
  error: '',
  ariaLabel: '',
  label: '',
  className: '',
})

const modelValue = defineModel<T>({ required: true })

const emits = defineEmits<{
  change: [value: T, index: number]
}>()

const rounded = useResolvedRounded(() => props.rounded)
const cardRoundedClass = computed(() => kunRoundedClasses[rounded.value])

const kunUniqueId = useKunUniqueId('kun-radio-group')
const labelId = computed(() => `${kunUniqueId.value}-label`)
const itemRefs = ref<Array<HTMLElement | null>>([])

const isOptionDisabled = (option: KunRadioOption<T>) =>
  props.disabled || option.disabled === true

// Roving tabindex — only one item is Tab-reachable: the selected option,
// else the first non-disabled option.
const focusableIndex = computed(() => {
  const selectedIdx = props.options.findIndex((o) => o.value === modelValue.value)
  if (selectedIdx >= 0 && !isOptionDisabled(props.options[selectedIdx]!)) {
    return selectedIdx
  }
  return props.options.findIndex((o) => !isOptionDisabled(o))
})

// Radio shares the selection scale with KunCheckBox (identical box sizes), so a
// radio and a checkbox of the same size match. `indicator` is the shared box.
const sizeClasses = computed(() => {
  const s = kunSelectionSizeClasses[props.size]
  return { indicator: s.box, dot: s.dot, text: s.text, gap: s.gap }
})

const selectOption = (option: KunRadioOption<T>, index: number) => {
  if (isOptionDisabled(option)) return
  if (modelValue.value === option.value) return
  modelValue.value = option.value
  emits('change', option.value, index)
}

// WAI-ARIA radio pattern: arrows move focus AND activate, skipping disabled.
const focusSibling = (from: number, delta: number) => {
  const total = props.options.length
  if (total === 0) return
  let cursor = from
  for (let step = 0; step < total; step++) {
    cursor = (cursor + delta + total) % total
    const candidate = props.options[cursor]
    if (candidate && !isOptionDisabled(candidate)) {
      selectOption(candidate, cursor)
      nextTick(() => itemRefs.value[cursor]?.focus({ preventScroll: true }))
      return
    }
  }
}

const onKeydown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault()
      focusSibling(index, 1)
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault()
      focusSibling(index, -1)
      break
    case ' ':
    case 'Enter': {
      event.preventDefault()
      const option = props.options[index]
      if (option) selectOption(option, index)
      break
    }
  }
}
</script>

<template>
  <div :class="cn('w-full', className)">
    <div
      v-if="label"
      :id="labelId"
      class="text-default-700 mb-2 block text-sm font-medium"
    >
      {{ label }}
    </div>

    <div
      role="radiogroup"
      :aria-label="label ? undefined : ariaLabel || 'radio group'"
      :aria-labelledby="label ? labelId : undefined"
      :aria-disabled="disabled || undefined"
      :class="
        cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-3'
        )
      "
    >
      <!-- classic: dot + label -->
      <template v-if="variant === 'classic'">
        <label
          v-for="(option, index) in options"
          :key="String(option.value)"
          :ref="(el) => (itemRefs[index] = el as HTMLElement | null)"
          role="radio"
          :aria-checked="modelValue === option.value"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="focusableIndex === index && !isOptionDisabled(option) ? 0 : -1"
          :class="
            cn(
              'group inline-flex cursor-pointer items-center rounded-kun-md p-1 transition-colors',
              kunFocusRingClasses[color],
              sizeClasses.gap,
              sizeClasses.text,
              isOptionDisabled(option) && 'cursor-not-allowed opacity-50'
            )
          "
          @click="selectOption(option, index)"
          @keydown="(e) => onKeydown(e, index)"
        >
          <span
            :class="
              cn(
                'inline-flex shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                sizeClasses.indicator,
                modelValue === option.value
                  ? kunBorderClasses[color]
                  : 'border-default-300 group-hover:border-default-400'
              )
            "
          >
            <span
              v-if="modelValue === option.value"
              :class="cn('block rounded-full', sizeClasses.dot, kunBgClasses[color])"
            />
          </span>
          <span class="flex flex-col">
            <span class="text-foreground">{{ option.label }}</span>
            <span v-if="option.description" class="text-default-500 text-xs">
              {{ option.description }}
            </span>
          </span>
        </label>
      </template>

      <!-- pill: choice chips (single-select) -->
      <template v-else-if="variant === 'pill'">
        <button
          v-for="(option, index) in options"
          :key="String(option.value)"
          :ref="(el) => (itemRefs[index] = el as HTMLElement | null)"
          type="button"
          role="radio"
          :aria-checked="modelValue === option.value"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="focusableIndex === index && !isOptionDisabled(option) ? 0 : -1"
          :class="
            cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 font-medium transition-colors',
              kunFocusRingClasses[color],
              sizeClasses.text,
              modelValue === option.value
                ? kunSolidClasses[color]
                : 'bg-default/20 text-default-700 hover:bg-default/30',
              isOptionDisabled(option) && 'cursor-not-allowed opacity-50'
            )
          "
          @click="selectOption(option, index)"
          @keydown="(e) => onKeydown(e, index)"
        >
          <KunIcon v-if="option.icon" :name="option.icon" class="size-4 shrink-0" />
          {{ option.label }}
        </button>
      </template>

      <!-- card: bordered card with tint (+ optional icon) -->
      <template v-else>
        <div
          v-for="(option, index) in options"
          :key="String(option.value)"
          :ref="(el) => (itemRefs[index] = el as HTMLElement | null)"
          role="radio"
          :aria-checked="modelValue === option.value"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="focusableIndex === index && !isOptionDisabled(option) ? 0 : -1"
          :class="
            cn(
              'relative flex cursor-pointer items-start border-2 p-3 transition-all',
              kunFocusRingClasses[color],
              sizeClasses.gap,
              sizeClasses.text,
              cardRoundedClass,
              orientation === 'horizontal' && 'flex-1 min-w-[8rem]',
              modelValue === option.value
                ? cn(kunBorderClasses[color], kunSoftBgClasses[color])
                : 'border-kun hover:border-default-300 bg-content1',
              isOptionDisabled(option) && 'cursor-not-allowed opacity-50'
            )
          "
          @click="selectOption(option, index)"
          @keydown="(e) => onKeydown(e, index)"
        >
          <span
            v-if="!hideIndicator"
            :class="
              cn(
                'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                sizeClasses.indicator,
                modelValue === option.value
                  ? kunBorderClasses[color]
                  : 'border-default-300'
              )
            "
          >
            <span
              v-if="modelValue === option.value"
              :class="cn('block rounded-full', sizeClasses.dot, kunBgClasses[color])"
            />
          </span>
          <KunIcon
            v-if="option.icon"
            :name="option.icon"
            :class="
              cn(
                'size-6 shrink-0 transition-colors',
                modelValue === option.value ? kunTextClasses[color] : 'text-default-500'
              )
            "
          />
          <div class="flex flex-col">
            <span class="text-foreground font-medium">{{ option.label }}</span>
            <span v-if="option.description" class="text-default-500 mt-0.5 text-xs">
              {{ option.description }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
  </div>
</template>
