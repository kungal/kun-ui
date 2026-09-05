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
import {
  useCalendar,
  stepPeriod,
  KUN_CALENDAR_VALUE_FORMATS,
} from '../composables/useCalendar'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunDatePickerPrecision, KunDatePickerProps } from './types'

// Nuxt-decoupled date picker (single + range), @floating-ui positioned,
// date-fns powered. All icons bundled; no Nuxt coupling.
defineOptions({ name: 'KunDatePicker' })

const props = withDefaults(defineProps<KunDatePickerProps>(), {
  modelValue: '',
  mode: 'single',
  precision: 'day',
  label: '',
  placeholder: undefined,
  error: '',
  disabled: false,
  darkBorder: true,
  clearable: true,
  format: undefined,
  valueFormat: undefined,
  rounded: undefined,
  size: 'md',
  color: 'default',
  icon: '',
  fullWidth: true,
  className: '',
  classNames: undefined,
})

// `format`, `valueFormat` and `placeholder` all default off `precision`, so they
// cannot be withDefaults literals. A month picker that emitted 'yyyy-MM-dd'
// would round-trip the day it happened to be opened on.
// `||`, not `??`: date-fns throws on an empty pattern ("Cannot read properties
// of null"), which aborts the render and freezes the trigger text. `valueFormat`
// already fell back through `formatValue`'s `||`; these two now agree.
const resolvedValueFormat = computed<string | undefined>(
  () => props.valueFormat || KUN_CALENDAR_VALUE_FORMATS[props.precision]
)
const resolvedFormat = computed(
  () => props.format || KUN_CALENDAR_VALUE_FORMATS[props.precision]
)
const PLACEHOLDERS: Record<KunDatePickerPrecision, string> = {
  day: '请选择日期',
  month: '请选择月份',
  year: '请选择年份',
}
const resolvedPlaceholder = computed(
  () => props.placeholder ?? PLACEHOLDERS[props.precision]
)

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
// The trigger's `aria-controls` names the GRID, not the panel around it. ARIA
// 1.2 lets a combobox keep DOM focus and point `aria-activedescendant` into its
// popup only when "aria-controls refers to an element that supports
// aria-activedescendant" — `dialog` is not in that list, `grid` is. The panel
// was `role="dialog" aria-modal="true"` with focus outside it, which claimed the
// rest of the page was inert while the focused element sat on it.
const gridId = computed(() => `${kunUniqueId.value}-grid`)


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
  precision,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  weekdays,
  months,
} = toRefs(props)
const {
  viewingDate,
  i18n,
  parseDate,
  calendarGrid,
  monthGrid,
  yearGrid,
  isTodayDisabled,
  decadeLabel,
  navigateMonth,
  navigateYear,
  navigateDecade,
  selectDate,
  formatDate,
  tempRangeStart,
} = useCalendar({
  modelValue,
  mode,
  precision,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  weekdays,
  months,
  valueFormat: resolvedValueFormat,
})

// ── zoom ─────────────────────────────────────────────────────────────────
// Views coarsest-last. The panel opens on `precision`; the header title zooms
// OUT from there and a pick in a coarser view drills back in instead of
// committing, so `precision` is both the entry point and the commit level.
const VIEWS = ['day', 'month', 'year'] as const
const view = ref<KunDatePickerPrecision>(props.precision)
watch(
  () => props.precision,
  (p) => {
    view.value = p
    // The page has to follow the view. Without this the grid rendered whatever
    // page `viewingDate` was left on while `activeDate` pointed at a cell that
    // page does not contain — measured as `aria-activedescendant` naming a
    // missing id AND zero cells carrying `tabindex="0"`, i.e. a grid with no
    // active cell at all, healed only by the next arrow press.
    viewingDate.value = new Date(activeDate.value)
  }
)
watch(isOpen, (open) => {
  if (!open) return
  view.value = props.precision
  // Re-anchor on the value, not on wherever the last session wandered to.
  // `viewingDate` is seeded once at setup, so without this a programmatic model
  // change — or just navigating away and closing without picking — reopened the
  // panel on a page the value is not even on, which at year precision means a
  // different decade.
  const mv = props.modelValue
  const anchor = parseDate(Array.isArray(mv) ? mv[0] : (mv as string))
  if (anchor) viewingDate.value = anchor
})
const canZoomOut = computed(() => view.value !== 'year')
const zoomOut = () => {
  const i = VIEWS.indexOf(view.value)
  if (i < VIEWS.length - 1) view.value = VIEWS[i + 1]!
}

const headerLabel = computed(() => {
  if (view.value === 'year') return decadeLabel.value
  if (view.value === 'month') return String(viewingDate.value.getFullYear())
  return `${viewingDate.value.getFullYear()} / ${viewingDate.value.getMonth() + 1}`
})
// The single chevrons step one level COARSER than the grid on screen, so the
// label has to name the step, not the view: in the month grid that button moves
// a year, and reading "Previous month" out loud there is simply wrong.
const stepLabel = computed(() =>
  view.value === 'day' ? 'month' : view.value === 'month' ? 'year' : 'decade'
)
const stepPage = (dir: number) => {
  if (view.value === 'day') navigateMonth(dir)
  else if (view.value === 'month') navigateYear(dir)
  else navigateDecade(dir)
}

const activeDate = ref<Date>(new Date(viewingDate.value))
watch(viewingDate, (val) => {
  activeDate.value = new Date(val)
})

// The active cell is always a full Date; which of its fields a key moves
// depends on the view. Both coarse grids are 3 columns wide, so a vertical step
// is 3 cells there and 7 (a week) in the day grid.
const moveActive = (step: number, axis: 'x' | 'y') => {
  const rows = view.value === 'day' ? 7 : 3
  const d = stepPeriod(activeDate.value, view.value, axis === 'x' ? step : step * rows)
  activeDate.value = d
  const leftPage =
    view.value === 'day'
      ? d.getMonth() !== viewingDate.value.getMonth() ||
        d.getFullYear() !== viewingDate.value.getFullYear()
      : view.value === 'month'
        ? d.getFullYear() !== viewingDate.value.getFullYear()
        : Math.floor(d.getFullYear() / 10) !==
          Math.floor(viewingDate.value.getFullYear() / 10)
  if (leftPage) viewingDate.value = new Date(d)
}

// Cell ids carry the view: the same day can be addressed by three grids, and a
// stale `aria-activedescendant` pointing at an id that no longer exists makes
// the panel read as having no active cell at all.
const cellId = (key: string) => `${kunUniqueId.value}-${view.value}-${key}`
const activeKey = computed(() => {
  if (view.value === 'year') return String(activeDate.value.getFullYear())
  return formatDate(activeDate.value, view.value === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd')
})

// The `disabled` attribute on a cell stops the mouse and nothing else, so the
// keyboard path has to look the cell up itself. Committing a greyed-out date was
// measurable at every precision, and in a coarse grid Enter on a disabled month
// drilled into a page whose every day is disabled — somewhere a mouse cannot go.
const activeCellDisabled = computed(() => {
  const grid =
    view.value === 'day'
      ? calendarGrid.value
      : view.value === 'month'
        ? monthGrid.value
        : yearGrid.value
  return grid.find((c) => c.key === activeKey.value)?.isDisabled ?? false
})

// preventDefault only on the keys handled here. The blanket `@keydown.prevent`
// this replaced also cancelled Tab (focus could never leave the picker) and
// Enter (the trigger's own activation), leaving the calendar unopenable.
// The panel is teleported to <body>, so a keydown inside it does not bubble to
// the trigger's handler: measured, clicking a chevron or the zoom header left
// the panel open with every arrow key and Escape dead. Enter and Space stay with
// whatever button holds focus — a native button activates on them by itself, and
// stealing them here would page the calendar AND commit a date.
const onPanelKeydown = (e: KeyboardEvent) => {
  if (e.target !== dropdownRef.value && (e.key === 'Enter' || e.key === ' ')) return
  onKeydown(e)
}

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
      moveActive(-1, 'x')
      break
    case 'ArrowRight':
      e.preventDefault()
      moveActive(1, 'x')
      break
    case 'ArrowUp':
      e.preventDefault()
      moveActive(-1, 'y')
      break
    case 'ArrowDown':
      e.preventDefault()
      moveActive(1, 'y')
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!activeCellDisabled.value) handleCellSelect(activeDate.value)
      break
    case 'Escape':
      e.preventDefault()
      isOpen.value = false
      break
  }
}

const displayValue = computed(() => {
  if (props.mode === 'single') {
    // The prop type allows an array in either mode, and `mode` can be flipped at
    // runtime with a range still in the model — `[null, null]` is exactly what
    // `clearDate` emits. Handing that to parseISO threw out of the render
    // function and froze the component on its last good DOM.
    const mv = props.modelValue
    const d = parseDate(Array.isArray(mv) ? mv[0] : mv)
    return d ? formatDate(d, resolvedFormat.value) : ''
  }
  if (!Array.isArray(props.modelValue)) return ''
  const start = parseDate(props.modelValue[0])
  const end = parseDate(props.modelValue[1])
  const fmt = (d: Date) => formatDate(d, resolvedFormat.value)
  if (start && end) return `${fmt(start)} - ${fmt(end)}`
  // A half-open range is not hypothetical: `selectDate` emits `[start, null]` on
  // the FIRST click of every range selection. Rendering '' for it left the
  // trigger reading "nothing selected" while the consumer's model already held
  // ['2021', null], and `clearable`'s `&& displayValue` took the clear button
  // away with it — click outside at that point and the value was both invisible
  // and unclearable. The dangling dash is the point: it says which end is set.
  if (start) return `${fmt(start)} -`
  if (end) return `- ${fmt(end)}`
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

// A pick in a view coarser than `precision` is navigation, not a value.
const handleCellSelect = (date: Date) => {
  if (view.value !== props.precision) {
    viewingDate.value = new Date(date)
    view.value = view.value === 'year' ? 'month' : 'day'
    // The clicked button unmounts with its grid and focus falls to <body>, out
    // of reach of both keydown handlers. Park it on the panel instead.
    nextTick(() => dropdownRef.value?.focus({ preventScroll: true }))
    return
  }
  handleDateSelect(date)
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
  // Without this the half-picked start survived 清空 and the NEXT click closed a
  // range around it: pick Sep 10, clear, click Sep 20, and the model came back
  // ['2026-09-10', '2026-09-20'].
  tempRangeStart.value = null
  const newValue: string | null | [string | null, string | null] =
    props.mode === 'single' ? null : [null, null]
  emit('update:modelValue', newValue)
}

// `role="grid"` is only meaningful with `role="row"` between it and the cells:
// without the rows a screen reader reads 42 cells as one flat list and loses
// "column 3 of 7" entirely. Each row is its own CSS grid, which lays out
// identically to the single grid it replaces because every row is full.
const chunk = <C,>(cells: readonly C[], size: number): C[][] =>
  Array.from({ length: Math.ceil(cells.length / size) }, (_, i) =>
    cells.slice(i * size, i * size + size)
  )
const dayRows = computed(() => chunk(calendarGrid.value, 7))
const monthRows = computed(() => chunk(monthGrid.value, 3))
const yearRows = computed(() => chunk(yearGrid.value, 3))

// One class builder for both coarse grids — they differ only in what a cell

// stands for. Literal strings so they survive into `dist/index.js` for the
// consumer's Tailwind to find.
const periodCellClass = (cell: {
  date: Date
  isNow: boolean
  isSelected: boolean
  isDisabled: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isOutside: boolean
}) =>
  cn(
    'flex h-9 w-full items-center justify-center rounded-kun-md text-sm transition-colors',
    kunFocusRingClasses[props.color],
    cell.isOutside && 'text-default-400',
    cell.isNow && 'border-primary bg-primary/20 border',
    !cell.isSelected && !cell.isDisabled && 'hover:bg-default/20',
    cell.isDisabled && 'cursor-not-allowed opacity-50',
    cell.isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
    (cell.isInRange || isInPreviewRange(cell.date)) &&
      !cell.isSelected &&
      'bg-primary/10 rounded-none',
    cell.isRangeStart && 'rounded-r-none',
    cell.isRangeEnd && 'rounded-l-none',
    props.classNames?.cell
  )

const isInPreviewRange = (date: Date) => {
  if (!tempRangeStart.value || !hoveredDate.value) return false
  const start = tempRangeStart.value
  const end = hoveredDate.value
  if (!start || !end) return false
  return (date > start && date < end) || (date < start && date > end)
}
</script>

<template>
  <div
    ref="datePickerRef"
    :class="
      cn(
        'relative',
        // `w-fit` is not redundant with `inline-block`: a grid item is
        // blockified, and `justify-self: stretch` then fills the whole track.
        fullWidth ? 'w-full' : 'inline-block w-fit align-top',
        props.className,
        props.classNames?.root
      )
    "
  >
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
        aria-haspopup="grid"
        :aria-expanded="isOpen"
        :aria-controls="gridId"
        :aria-labelledby="label ? `${kunUniqueId}-label` : undefined"
        :aria-label="label ? undefined : resolvedPlaceholder"
        :aria-disabled="disabled || undefined"
        :aria-activedescendant="isOpen ? cellId(activeKey) : undefined"
        :class="
          cn(
            'flex cursor-pointer items-center justify-between gap-2 text-left transition-[color,box-shadow]',
            fullWidth && 'w-full',
            kunControlSizeClasses[props.size],
            roundedClass,
            'bg-content1 shadow-kun-sm border',
            error
              ? cn('border-danger-300', kunFocusRingClasses.danger)
              : cn('border-kun', kunFocusRingClasses[color]),
            disabled && 'cursor-not-allowed opacity-60',
            props.classNames?.trigger
          )
        "
        @click="toggle"
        @keydown="onKeydown"
      >
        <KunIcon v-if="icon" :name="icon" class="text-default-500 shrink-0" />
        <span class="block min-w-0 flex-1 truncate" :class="{ 'text-default-400': !displayValue }">
          {{ displayValue || resolvedPlaceholder }}
        </span>
        <div class="flex shrink-0 items-center gap-2">
          <!-- `flex` on the button, and the icon left at its 1em default: a lone
               <svg> in a block button sits on the line box's text baseline, so
               the strut's descent pushed the clear icon ~2px above the button's
               centre and out of line with the calendar icon, while the button's
               padding made the whole trigger 8px taller than a KunSelect of the
               same size. The negative margin keeps the tap target without
               putting that height back. -->
          <button
            v-if="clearable && displayValue && !disabled"
            type="button"
            class="text-default-500 hover:text-default-800 -m-1.5 flex items-center p-1.5"
            aria-label="Clear date"
            @click.stop="clearDate"
            @mousedown.stop.prevent
          >
            <KunIcon name="lucide:x" />
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
              roundedClass,
              props.classNames?.popup
            )
          "
          :style="[floatingStyles, { minWidth: '260px', transformOrigin }]"
          tabindex="-1"
          @keydown="onPanelKeydown"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- The double chevrons only exist in the day grid: in the month
                   grid the single ones already step a year, and in the year grid
                   a decade. -->
              <KunButton v-if="view === 'day'" variant="light" :is-icon-only="true" size="sm" aria-label="Previous year" @click="navigateYear(-1)">
                <KunIcon name="lucide:chevrons-left" />
              </KunButton>
              <KunButton variant="light" :is-icon-only="true" size="sm" :aria-label="`Previous ${stepLabel}`" @click="stepPage(-1)">
                <KunIcon name="lucide:chevron-left" />
              </KunButton>
            </div>
            <button
              type="button"
              :disabled="!canZoomOut"
              :class="
                cn(
                  'rounded-kun-md px-2 py-0.5 font-semibold transition-colors',
                  kunFocusRingClasses[color],
                  canZoomOut ? 'hover:bg-default/20 cursor-pointer' : 'cursor-default'
                )
              "
              :aria-label="canZoomOut ? `${headerLabel} — zoom out` : headerLabel"
              @click="zoomOut"
            >
              {{ headerLabel }}
            </button>
            <div class="flex items-center gap-2">
              <KunButton variant="light" :is-icon-only="true" size="sm" :aria-label="`Next ${stepLabel}`" @click="stepPage(1)">
                <KunIcon name="lucide:chevron-right" />
              </KunButton>
              <KunButton v-if="view === 'day'" variant="light" :is-icon-only="true" size="sm" aria-label="Next year" @click="navigateYear(1)">
                <KunIcon name="lucide:chevrons-right" />
              </KunButton>
            </div>
          </div>

          <!-- aria-hidden, following react-aria's useCalendarGrid: "Column
               headers are hidden to screen readers to make navigating with a
               touch screen reader easier. The day names are already included in
               the label of each cell." Ours are — the cell label is a full
               `toDateString()`. -->
          <div
            v-if="view === 'day'"
            class="text-default-600 mt-3 grid grid-cols-7 text-center text-xs"
            aria-hidden="true"
          >
            <div v-for="day in i18n.weekdays" :key="day" class="p-1 font-medium">
              {{ day }}
            </div>
          </div>

          <div
            v-if="view === 'day'"
            :id="gridId"
            :class="cn('mt-1', props.classNames?.grid)"
            role="grid"
            :aria-label="headerLabel"
          >
            <div
              v-for="(week, weekIndex) in dayRows"
              :key="weekIndex"
              class="grid grid-cols-7"
              role="row"
            >
              <div
                v-for="day in week"
                :key="day.key"
                class="p-0.5"
                role="gridcell"
              >
                <button
                  :id="cellId(day.key)"
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
                      day.isRangeEnd && 'rounded-l-none',
                      props.classNames?.cell
                    )
                  "
                  :aria-label="day.date.toDateString()"
                  :aria-selected="day.isSelected"
                  :tabindex="day.key === activeKey ? 0 : -1"
                  @click="handleCellSelect(day.date)"
                  @mouseenter="hoveredDate = day.date"
                  @mouseleave="hoveredDate = null"
                >
                  {{ day.dayOfMonth }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-else-if="view === 'month'"
            :id="gridId"
            :class="cn('mt-3', props.classNames?.grid)"
            role="grid"
            :aria-label="headerLabel"
          >
            <div
              v-for="(row, rowIndex) in monthRows"
              :key="rowIndex"
              class="grid grid-cols-3"
              role="row"
            >
              <div
                v-for="cell in row"
                :key="cell.key"
                class="p-0.5"
                role="gridcell"
              >
                <button
                  :id="cellId(cell.key)"
                  type="button"
                  :disabled="cell.isDisabled"
                  :class="periodCellClass(cell)"
                  :aria-label="`${cell.label} ${cell.date.getFullYear()}`"
                  :aria-selected="cell.isSelected"
                  :tabindex="cell.key === activeKey ? 0 : -1"
                  @click="handleCellSelect(cell.date)"
                  @mouseenter="hoveredDate = cell.date"
                  @mouseleave="hoveredDate = null"
                >
                  {{ cell.label }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            :id="gridId"
            :class="cn('mt-3', props.classNames?.grid)"
            role="grid"
            :aria-label="headerLabel"
          >
            <div
              v-for="(row, rowIndex) in yearRows"
              :key="rowIndex"
              class="grid grid-cols-3"
              role="row"
            >
              <div
                v-for="cell in row"
                :key="cell.key"
                class="p-0.5"
                role="gridcell"
              >
                <button
                  :id="cellId(cell.key)"
                  type="button"
                  :disabled="cell.isDisabled"
                  :class="periodCellClass(cell)"
                  :aria-label="cell.key"
                  :aria-selected="cell.isSelected"
                  :tabindex="cell.key === activeKey ? 0 : -1"
                  @click="handleCellSelect(cell.date)"
                  @mouseenter="hoveredDate = cell.date"
                  @mouseleave="hoveredDate = null"
                >
                  {{ cell.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <KunButton
              v-if="precision === 'day'"
              size="sm"
              variant="light"
              :disabled="isTodayDisabled"
              @click="handleDateSelect(new Date())"
            >
              今天
            </KunButton>
            <span v-else />
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
