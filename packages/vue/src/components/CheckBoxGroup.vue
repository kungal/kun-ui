<script setup lang="ts" generic="T extends KunCheckBoxGroupValue = KunCheckBoxGroupValue">
import { computed } from 'vue'
import {
  cn,
  kunBorderClasses,
  kunFocusRingClasses,
  kunSoftBgClasses,
  kunSolidBgClasses,
  kunSolidClasses,
  kunSolidFgClasses,
  kunTextClasses,
  kunRoundedClasses,
  kunSelectionSizeClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunIcon from './Icon.vue'
import type {
  KunCheckBoxGroupInvalidReason,
  KunCheckBoxGroupOption,
  KunCheckBoxGroupProps,
  KunCheckBoxGroupValue,
} from './types'

defineOptions({ name: 'KunCheckBoxGroup' })

const props = withDefaults(defineProps<KunCheckBoxGroupProps<T>>(), {
  variant: 'classic',
  orientation: 'vertical',
  color: 'primary',
  size: 'md',
  rounded: undefined,
  max: undefined,
  hideIndicator: false,
  disabled: false,
  error: '',
  ariaLabel: '',
  label: '',
  className: '',
})

// Array model — this is the whole point of the component: a multi-select FORM
// field whose value is a real array (vs a ToggleGroup, which is a toolbar).
const modelValue = defineModel<T[]>({ required: true })

const emits = defineEmits<{
  /**
   * The new selection, after a user toggle only — a programmatic `v-model`
   * write does not emit it.
   */
  change: [value: T[]]
  /** A click was blocked because it would exceed `max`. */
  invalid: [reason: KunCheckBoxGroupInvalidReason]
}>()

const rounded = useResolvedRounded(() => props.rounded)
const cardRoundedClass = computed(() => kunRoundedClasses[rounded.value])

const kunUniqueId = useKunUniqueId('kun-checkbox-group')
const labelId = computed(() => `${kunUniqueId.value}-label`)

// Selection scale shared with KunCheckBox/KunRadioGroup so equal `size` props
// render identically across the three.
const sizeClasses = computed(() => {
  const s = kunSelectionSizeClasses[props.size]
  return { box: s.box, check: s.check, text: s.text, gap: s.gap }
})

const selectedSet = computed(() => new Set<KunCheckBoxGroupValue>(modelValue.value))
const isSelected = (option: KunCheckBoxGroupOption<T>) =>
  selectedSet.value.has(option.value)

// At the cap, unselected options can no longer be added (already-selected ones
// still toggle off). Mirrors the disabled-when-full pattern apps hand-rolled.
const atMax = computed(
  () => props.max != null && modelValue.value.length >= props.max
)
const isOptionDisabled = (option: KunCheckBoxGroupOption<T>) =>
  props.disabled || option.disabled === true
const isBlocked = (option: KunCheckBoxGroupOption<T>) =>
  !isSelected(option) && atMax.value

const toggleOption = (option: KunCheckBoxGroupOption<T>) => {
  if (isOptionDisabled(option)) return
  // @change carries `next`, not a read-back of `modelValue`: with v-model bound
  // on the parent, a defineModel ref still reads as the pre-click array in the
  // same tick (vuejs/core#11832), so the payload was one click behind.
  if (selectedSet.value.has(option.value)) {
    const next = modelValue.value.filter((v) => v !== option.value)
    modelValue.value = next
    emits('change', next)
    return
  }
  if (props.max != null && modelValue.value.length >= props.max) {
    emits('invalid', 'max-reached')
    return
  }
  const next = [...modelValue.value, option.value]
  modelValue.value = next
  emits('change', next)
}

// WAI-ARIA checkbox pattern: each box is its own Tab stop; Space/Enter toggles.
// (No roving/arrow selection — that's the radio pattern, not checkboxes.)
const onKeydown = (event: KeyboardEvent, option: KunCheckBoxGroupOption<T>) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggleOption(option)
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
      role="group"
      :aria-label="label ? undefined : ariaLabel || 'checkbox group'"
      :aria-labelledby="label ? labelId : undefined"
      :aria-disabled="disabled || undefined"
      :class="
        cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-3'
        )
      "
    >
      <!-- classic: box + label -->
      <template v-if="variant === 'classic'">
        <label
          v-for="option in options"
          :key="String(option.value)"
          role="checkbox"
          :aria-checked="isSelected(option)"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="isOptionDisabled(option) ? -1 : 0"
          :class="
            cn(
              'group inline-flex cursor-pointer items-center rounded-kun-md p-1 transition-colors',
              kunFocusRingClasses[color],
              sizeClasses.gap,
              sizeClasses.text,
              isOptionDisabled(option)
                ? 'cursor-not-allowed opacity-50'
                : isBlocked(option) && 'opacity-60'
            )
          "
          @click="toggleOption(option)"
          @keydown="(e) => onKeydown(e, option)"
        >
          <span
            :class="
              cn(
                'inline-flex shrink-0 items-center justify-center rounded-[35%] border-2 transition-colors',
                sizeClasses.box,
                isSelected(option)
                  ? cn(kunSolidBgClasses[color], kunBorderClasses[color])
                  : 'border-default-300 group-hover:border-default-400'
              )
            "
          >
            <KunIcon
              v-if="isSelected(option)"
              name="lucide:check"
              :class="cn(sizeClasses.check, kunSolidFgClasses[color])"
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

      <!-- pill: filter chips (multi-select) -->
      <template v-else-if="variant === 'pill'">
        <button
          v-for="option in options"
          :key="String(option.value)"
          type="button"
          role="checkbox"
          :aria-checked="isSelected(option)"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="isOptionDisabled(option) ? -1 : 0"
          :class="
            cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 font-medium transition-colors',
              kunFocusRingClasses[color],
              sizeClasses.text,
              isSelected(option)
                ? kunSolidClasses[color]
                : 'bg-default/20 text-default-700 hover:bg-default/30',
              isOptionDisabled(option)
                ? 'cursor-not-allowed opacity-50'
                : isBlocked(option) && 'opacity-60'
            )
          "
          @click="toggleOption(option)"
          @keydown="(e) => onKeydown(e, option)"
        >
          <KunIcon v-if="option.icon" :name="option.icon" class="size-4 shrink-0" />
          {{ option.label }}
        </button>
      </template>

      <!-- card: bordered card with tint (+ optional icon) -->
      <template v-else>
        <div
          v-for="option in options"
          :key="String(option.value)"
          role="checkbox"
          :aria-checked="isSelected(option)"
          :aria-disabled="isOptionDisabled(option) || undefined"
          :tabindex="isOptionDisabled(option) ? -1 : 0"
          :class="
            cn(
              'relative flex cursor-pointer items-start border-2 p-3 transition-all',
              kunFocusRingClasses[color],
              sizeClasses.gap,
              sizeClasses.text,
              cardRoundedClass,
              orientation === 'horizontal' && 'flex-1 min-w-[8rem]',
              isSelected(option)
                ? cn(kunBorderClasses[color], kunSoftBgClasses[color])
                : 'border-kun hover:border-default-300 bg-content1',
              isOptionDisabled(option)
                ? 'cursor-not-allowed opacity-50'
                : isBlocked(option) && 'opacity-60'
            )
          "
          @click="toggleOption(option)"
          @keydown="(e) => onKeydown(e, option)"
        >
          <span
            v-if="!hideIndicator"
            :class="
              cn(
                'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-[35%] border-2 transition-colors',
                sizeClasses.box,
                isSelected(option)
                  ? cn(kunSolidBgClasses[color], kunBorderClasses[color])
                  : 'border-default-300'
              )
            "
          >
            <KunIcon
              v-if="isSelected(option)"
              name="lucide:check"
              :class="cn(sizeClasses.check, kunSolidFgClasses[color])"
            />
          </span>
          <KunIcon
            v-if="option.icon"
            :name="option.icon"
            :class="
              cn(
                'size-6 shrink-0 transition-colors',
                isSelected(option) ? kunTextClasses[color] : 'text-default-500'
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
