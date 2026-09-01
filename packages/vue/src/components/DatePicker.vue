<script setup lang="ts">
import { ref, computed, toRefs, nextTick, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useTransformOrigin } from '../composables/useTransformOrigin'
import { useCalendar } from '../composables/useCalendar'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunDatePickerProps } from './types'

// Nuxt-decoupled date picker (single + range), @floating-ui positioned,
// date-fns powered. All icons bundled; no Nuxt coupling.
defineOptions({ name: 'KunDatePicker' })

const props = withDefaults(defineProps<KunDatePickerProps>(), {
  modelValue: '',
  mode: 'single',
  label: '',
  placeholder: '请选择日期',
  error: '',
  disabled: false,
  darkBorder: true,
  clearable: true,
  format: 'yyyy-MM-dd',
  valueFormat: 'yyyy-MM-dd',
  rounded: undefined,
  size: 'md',
  color: 'default',
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const emit = defineEmits<{
  'update:modelValue': [value: string | null | [string | null, string | null]]
}>()

const isOpen = ref(false)
const datePickerRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(dropdownRef, { trigger: triggerRef })
const hoveredDate = ref<Date | null>(null)

const kunUniqueId = useKunUniqueId('kun-datepicker')
const panelId = computed(() => `${kunUniqueId.value}-panel`)
const dayId = (key: string) => `${kunUniqueId.value}-${key}`

// The calendar panel is teleported to <body>, so it is NOT a DOM descendant of
// datePickerRef — without this guard every tap inside it (month/year nav, etc.)
// counts as an outside click and closes the picker. Mirrors Select/Autocomplete.
onClickOutside(datePickerRef, (event) => {
  if (dropdownRef.value?.contains(event.target as Node)) return
  isOpen.value = false
})

const { floatingStyles, placement } = useFloating(datePickerRef, dropdownRef, {
  placement: 'bottom-start',
  open: isOpen,
  whileElementsMounted: autoUpdate,
  transform: false,
  middleware: [
    offset(4),
    flip(),
    shift({ padding: 8 }),
    // Last resort on a very short viewport: cap to the available height + scroll
    // so the calendar stays reachable instead of overflowing off-screen.
    size({
      padding: 8,
      apply({ availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxHeight: `${Math.max(0, Math.floor(availableHeight))}px`,
          overflowY: 'auto',
        })
      },
    }),
  ],
})
// Grow the calendar out of the trigger edge (post-flip aware).
const transformOrigin = useTransformOrigin(placement)

const {
  modelValue,
  mode,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  weekdays,
  months,
  valueFormat,
} = toRefs(props)
const {
  viewingDate,
  i18n,
  parseDate,
  calendarGrid,
  navigateMonth,
  navigateYear,
  selectDate,
  formatDate,
  tempRangeStart,
} = useCalendar({
  modelValue,
  mode,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  weekdays,
  months,
  valueFormat,
})

const activeDate = ref<Date>(new Date(viewingDate.value))
watch(viewingDate, (val) => {
  activeDate.value = new Date(val)
})

const moveActiveDate = (days: number) => {
  const d = new Date(activeDate.value)
  d.setDate(d.getDate() + days)
  activeDate.value = d
  if (
    d.getMonth() !== viewingDate.value.getMonth() ||
    d.getFullYear() !== viewingDate.value.getFullYear()
  ) {
    viewingDate.value = new Date(d)
  }
}

// preventDefault only on the keys handled here. The blanket `@keydown.prevent`
// this replaced also cancelled Tab (focus could never leave the picker) and
// Enter (the trigger's own activation), leaving the calendar unopenable.
const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      isOpen.value = true
    }
    return
  }
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      moveActiveDate(-1)
      break
    case 'ArrowRight':
      e.preventDefault()
      moveActiveDate(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      moveActiveDate(-7)
      break
    case 'ArrowDown':
      e.preventDefault()
      moveActiveDate(7)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      handleDateSelect(activeDate.value)
      break
    case 'Escape':
      e.preventDefault()
      isOpen.value = false
      break
  }
}

const displayValue = computed(() => {
  if (props.mode === 'single') {
    const d = parseDate(props.modelValue as string)
    return d ? formatDate(d, props.format) : ''
  }
  if (Array.isArray(props.modelValue) && props.modelValue.every((d) => d)) {
    const start = parseDate(props.modelValue[0])
    const end = parseDate(props.modelValue[1])
    if (!start || !end) return ''
    return `${formatDate(start, props.format)} - ${formatDate(end, props.format)}`
  }
  return ''
})

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // preventScroll: focusing on open must never scroll the page (the portaled
    // panel + a non-preventScroll focus is the classic "jumps to top" bug).
    nextTick(() => triggerRef.value?.focus({ preventScroll: true }))
  }
}

const handleDateSelect = (date: Date) => {
  const newValue = selectDate(date)
  emit('update:modelValue', newValue)
  if (props.mode === 'single' || (Array.isArray(newValue) && newValue[1])) {
    isOpen.value = false
  }
}

const clearDate = () => {
  if (props.disabled) return
  const newValue: string | null | [string | null, string | null] =
    props.mode === 'single' ? null : [null, null]
  emit('update:modelValue', newValue)
}

const isInPreviewRange = (date: Date) => {
  if (!tempRangeStart.value || !hoveredDate.value) return false
  const start = tempRangeStart.value
  const end = hoveredDate.value
  if (!start || !end) return false
  return (date > start && date < end) || (date < start && date > end)
}
</script>

<template>
  <div ref="datePickerRef" class="relative w-full">
    <label
      v-if="label"
      :id="`${kunUniqueId}-label`"
      class="text-default-700 mb-1 block text-sm font-medium"
    >{{ label }}</label>

    <div class="relative">
      <!-- A div, not a <button>, because the clear control inside it IS a
           button: a nested <button> start tag makes the parser emit an implied
           </button>, so the browser hoists the clear button and the calendar
           icon out of the trigger and hydration mismatches. Same shape as
           KunSelect's trigger. -->
      <div
        :id="kunUniqueId"
        ref="triggerRef"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        :aria-labelledby="label ? `${kunUniqueId}-label` : undefined"
        :aria-label="label ? undefined : placeholder"
        :aria-disabled="disabled || undefined"
        :aria-activedescendant="isOpen ? dayId(formatDate(activeDate)) : undefined"
        :class="
          cn(
            'flex w-full cursor-pointer items-center justify-between gap-2 text-left transition-[color,box-shadow]',
            kunControlSizeClasses[props.size],
            roundedClass,
            'bg-content1 shadow-kun-sm border',
            error
              ? cn('border-danger-300', kunFocusRingClasses.danger)
              : cn('border-kun', kunFocusRingClasses[color]),
            disabled && 'cursor-not-allowed opacity-60'
          )
        "
        @click="toggle"
        @keydown="onKeydown"
      >
        <span class="block min-w-0 flex-1 truncate" :class="{ 'text-default-400': !displayValue }">
          {{ displayValue || placeholder }}
        </span>
        <div class="flex shrink-0 items-center">
          <button
            v-if="clearable && displayValue && !disabled"
            type="button"
            class="text-default-500 hover:text-default-800 mr-2 p-1"
            aria-label="Clear date"
            @click.stop="clearDate"
            @mousedown.stop.prevent
          >
            <KunIcon name="lucide:x" class="h-4 w-4" />
          </button>
          <KunIcon name="lucide:calendar" class="text-default-500" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-kun-base ease-kun-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-kun-exit ease-kun-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          :id="panelId"
          ref="dropdownRef"
          data-kun-overlay
          :class="
            cn(
              'bg-content1 z-kun-popover p-3 shadow-kun-md',
              roundedClass
            )
          "
          :style="[floatingStyles, { minWidth: '260px', transformOrigin }]"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <KunButton variant="light" :is-icon-only="true" size="sm" aria-label="Previous year" @click="navigateYear(-1)">
                <KunIcon name="lucide:chevrons-left" />
              </KunButton>
              <KunButton variant="light" :is-icon-only="true" size="sm" aria-label="Previous month" @click="navigateMonth(-1)">
                <KunIcon name="lucide:chevron-left" />
              </KunButton>
            </div>
            <div class="font-semibold">
              {{ viewingDate.getFullYear() }} / {{ viewingDate.getMonth() + 1 }}
            </div>
            <div class="flex items-center gap-2">
              <KunButton variant="light" :is-icon-only="true" size="sm" aria-label="Next month" @click="navigateMonth(1)">
                <KunIcon name="lucide:chevron-right" />
              </KunButton>
              <KunButton variant="light" :is-icon-only="true" size="sm" aria-label="Next year" @click="navigateYear(1)">
                <KunIcon name="lucide:chevrons-right" />
              </KunButton>
            </div>
          </div>

          <div class="text-default-600 mt-3 grid grid-cols-7 text-center text-xs">
            <div v-for="day in i18n.weekdays" :key="day" class="p-1 font-medium">
              {{ day }}
            </div>
          </div>

          <div class="mt-1 grid grid-cols-7" role="grid">
            <div v-for="day in calendarGrid" :key="day.key" class="p-0.5" role="gridcell">
              <button
                :id="dayId(day.key)"
                type="button"
                :disabled="day.isDisabled"
                :class="
                  cn(
                    cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
                      kunFocusRingClasses[color]
                    ),
                    !day.isCurrentMonth && 'text-default-400',
                    day.isToday && 'border-primary bg-primary/20 border',
                    !day.isSelected && !day.isDisabled && 'hover:bg-default/20',
                    day.isDisabled && 'cursor-not-allowed opacity-50',
                    // bg-primary + its generated on-color (mode-correct token,
                    // no dark: pin needed).
                    day.isSelected &&
                      'bg-primary text-primary-foreground hover:bg-primary/90',
                    (day.isInRange || isInPreviewRange(day.date)) &&
                      !day.isSelected &&
                      'bg-primary/10 rounded-none',
                    day.isRangeStart && 'rounded-r-none',
                    day.isRangeEnd && 'rounded-l-none'
                  )
                "
                :aria-label="day.date.toDateString()"
                :aria-selected="day.isSelected"
                :tabindex="day.date.toDateString() === activeDate.toDateString() ? 0 : -1"
                @click="handleDateSelect(day.date)"
                @mouseenter="hoveredDate = day.date"
                @mouseleave="hoveredDate = null"
              >
                {{ day.dayOfMonth }}
              </button>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <KunButton size="sm" variant="light" @click="handleDateSelect(new Date())">
              今天
            </KunButton>
            <div class="flex gap-2">
              <KunButton v-if="clearable" size="sm" variant="light" @click="clearDate">
                清空
              </KunButton>
              <KunButton size="sm" variant="light" @click="isOpen = false">
                关闭
              </KunButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
  </div>
</template>
