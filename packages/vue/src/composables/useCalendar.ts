import { ref, computed, type Ref } from 'vue'
import {
  format,
  parseISO,
  isValid,
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isSameMonth,
  isSameYear,
  isToday,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
  startOfToday,
} from 'date-fns'
import { enUS, ja, zhCN } from 'date-fns/locale'

// Calendar grid + selection logic for KunDatePicker. Pure date-fns + Vue
// reactivity — no framework coupling.

export type KunCalendarPrecision = 'day' | 'month' | 'year'

// The value a precision round-trips through. 'yyyy-MM' and 'yyyy' are both
// valid ISO 8601, so `parseISO` reads them back as local midnight of the first
// day of the period — the same guarantee the day format relies on.
export const KUN_CALENDAR_VALUE_FORMATS: Record<KunCalendarPrecision, string> = {
  day: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
}

const DEFAULT_FORMAT = KUN_CALENDAR_VALUE_FORMATS.day

// `new Date(y, m, 1)` maps a year of 0–99 to 1900 + y. `parseISO` accepts
// '0005', so a model value that old built a grid of 1900s: nothing matched the
// selection, and clicking the cell labelled "5" emitted '1905'.
const periodStart = (year: number, month = 0) => {
  const d = new Date(year, month, 1)
  d.setFullYear(year)
  return d
}

// Stepping a coarse grid must NOT go through `setMonth`/`setFullYear`: the
// caller's date carries a day-of-month and both OVERFLOW rather than clamp.
// Measured — from Jan 31, +1 month lands on Mar 3 (February skipped) and -1
// lands on Mar 3 as well, i.e. the key does not move at all. Snapping to the
// period start first also stops the day drifting across a page turn.
export const stepPeriod = (
  date: Date,
  unit: KunCalendarPrecision,
  amount: number
): Date => {
  if (unit === 'day') return addDays(date, amount)
  if (unit === 'month') return addMonths(startOfMonth(date), amount)
  return addYears(startOfYear(date), amount)
}

const formatDate = (date: Date, formatStr = DEFAULT_FORMAT): string =>
  format(date, formatStr)

// `parseISO`, NOT `new Date(str)`: ES2015+ parses a date-only ISO string
// ('2026-06-14') as UTC midnight, and date-fns then FORMATS it in local time —
// so every browser west of UTC renders the previous day, and an SSR app whose
// server sits in a different zone from the visitor gets a hydration text
// mismatch on top of that. parseISO treats a date-only string as local midnight.
const parseDate = (
  dateString: string | Date | null | undefined
): Date | null => {
  if (!dateString) return null
  if (dateString instanceof Date) {
    return isValid(dateString) ? dateString : null
  }
  const d = parseISO(dateString)
  return isValid(d) ? d : null
}

const getLocale = (localeStr?: string) => {
  switch (localeStr) {
    case 'ja':
      return ja
    case 'zh-CN':
      return zhCN
    default:
      return enUS
  }
}

export const useCalendar = (props: {
  modelValue: Ref<string | null | [string | null, string | null]>
  mode: Ref<'single' | 'range'>
  precision?: Ref<KunCalendarPrecision | undefined>
  minDate?: Ref<string | Date | undefined>
  maxDate?: Ref<string | Date | undefined>
  isDateDisabled?: Ref<((date: Date) => boolean) | undefined>
  locale?: Ref<string | undefined> | string
  weekdays?: Ref<string[] | undefined>
  months?: Ref<string[] | undefined>
  valueFormat?: Ref<string | undefined>
}) => {
  const initialDate = Array.isArray(props.modelValue.value)
    ? props.modelValue.value[0]
    : props.modelValue.value
  const viewingDate = ref(parseDate(initialDate) || startOfToday())
  const tempRangeStart = ref<Date | null>(null)

  const precision = computed<KunCalendarPrecision>(
    () => props.precision?.value ?? 'day'
  )

  const localeObject = computed(() =>
    getLocale(typeof props.locale === 'string' ? props.locale : props.locale?.value)
  )

  const i18n = computed(() => {
    const locale = localeObject.value
    const weekdaysOverride =
      props.weekdays && 'value' in props.weekdays
        ? props.weekdays.value
        : props.weekdays
    const monthsOverride =
      props.months && 'value' in props.months ? props.months.value : props.months

    // Padded from the locale rather than taken wholesale: an override shorter
    // than the grid (`months: ['A','B','C']`) left nine blank cells that were
    // still enabled and still committed a real value.
    const pad = (fallback: string[], override?: string[]) =>
      fallback.map((d, i) => override?.[i] ?? d)

    const weekdaysShort = pad(
      [...Array(7)].map((_, i) =>
        format(new Date(2023, 0, i + 1), 'EEEEEE', { locale })
      ),
      weekdaysOverride
    )
    const months = pad(
      [...Array(12)].map((_, i) => format(new Date(2023, i, 1), 'LLLL', { locale })),
      monthsOverride
    )
    // Grid labels: 'LLLL' is "September", which does not fit a 3-column cell in
    // any locale with long month names. 'LLL' is the standalone abbreviation.
    const monthsShort = pad(
      [...Array(12)].map((_, i) => format(new Date(2023, i, 1), 'LLL', { locale })),
      monthsOverride
    )

    return { weekdays: weekdaysShort, months, monthsShort }
  })

  const navigateMonth = (direction: number) => {
    viewingDate.value = addMonths(viewingDate.value, direction)
  }

  const navigateYear = (direction: number) => {
    viewingDate.value = addYears(viewingDate.value, direction)
  }

  const navigateDecade = (direction: number) => {
    viewingDate.value = addYears(viewingDate.value, direction * 10)
  }

  // The first year of the 10-year page the view is sitting on.
  const decadeStart = computed(
    () => Math.floor(viewingDate.value.getFullYear() / 10) * 10
  )
  const decadeLabel = computed(
    () => `${decadeStart.value} - ${decadeStart.value + 9}`
  )

  const bounds = computed(() => {
    const minParsed = parseDate(props.minDate?.value)
    const maxParsed = parseDate(props.maxDate?.value)
    const mv = props.modelValue.value
    return {
      min: minParsed ? startOfDay(minParsed) : null,
      max: maxParsed ? startOfDay(maxParsed) : null,
      single: parseDate(Array.isArray(mv) ? mv[0] : (mv as string)),
      rangeStart: parseDate(Array.isArray(mv) ? mv[0] : null),
      rangeEnd: parseDate(Array.isArray(mv) ? mv[1] : null),
    }
  })

  // A cell is disabled only when the WHOLE period it covers is out of bounds —
  // otherwise a `minDate` of 2026-03-15 would grey out March in the month grid
  // and take the second half of the month with it.
  const isPeriodDisabled = (start: Date, end: Date) => {
    const { min, max } = bounds.value
    if (min && isBefore(end, min)) return true
    if (max && isAfter(start, max)) return true
    return props.isDateDisabled?.value?.(start) ?? false
  }

  // `今天` bypasses the grid, so it has to run the same bounds check a cell does
  // or a `maxDate` in the past keeps a one-click way to commit today.
  const isTodayDisabled = computed(() => {
    const today = startOfDay(new Date())
    return isPeriodDisabled(today, today)
  })

  const calendarGrid = computed(() => {
    const firstDayOfMonth = startOfMonth(viewingDate.value)
    const lastDayOfMonth = endOfMonth(viewingDate.value)

    const startDate = startOfWeek(firstDayOfMonth)
    const endDate = endOfWeek(lastDayOfMonth)

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const { single, rangeStart, rangeEnd } = bounds.value

    return days.map((date) => {
      const isSelected =
        props.mode.value === 'single'
          ? !!single && isSameDay(date, single)
          : (!!rangeStart && isSameDay(date, rangeStart)) ||
            (!!rangeEnd && isSameDay(date, rangeEnd))

      const isInRange =
        !!rangeStart &&
        !!rangeEnd &&
        isAfter(date, rangeStart) &&
        isBefore(date, rangeEnd)

      return {
        date,
        key: formatDate(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: isSameMonth(date, viewingDate.value),
        isToday: isToday(date),
        isSelected,
        isRangeStart: !!rangeStart && isSameDay(date, rangeStart),
        isRangeEnd: !!rangeEnd && isSameDay(date, rangeEnd),
        isInRange,
        isDisabled: isPeriodDisabled(startOfDay(date), startOfDay(date)),
      }
    })
  })

  const monthGrid = computed(() => {
    const year = viewingDate.value.getFullYear()
    const { single, rangeStart, rangeEnd } = bounds.value
    const now = new Date()
    return Array.from({ length: 12 }, (_, m) => {
      const date = periodStart(year, m)
      const end = endOfMonth(date)
      const isRangeStartCell = !!rangeStart && isSameMonth(date, rangeStart)
      const isRangeEndCell = !!rangeEnd && isSameMonth(date, rangeEnd)
      return {
        date,
        key: format(date, 'yyyy-MM'),
        label: i18n.value.monthsShort[m]!,
        isNow: isSameMonth(date, now),
        isSelected:
          props.mode.value === 'single'
            ? !!single && isSameMonth(date, single)
            : isRangeStartCell || isRangeEndCell,
        isRangeStart: isRangeStartCell,
        isRangeEnd: isRangeEndCell,
        isInRange:
          !!rangeStart &&
          !!rangeEnd &&
          isAfter(date, startOfMonth(rangeStart)) &&
          isBefore(date, startOfMonth(rangeEnd)),
        isOutside: false,
        isDisabled: isPeriodDisabled(date, end),
      }
    })
  })

  // Twelve cells so the page shows the decade plus one leading and one trailing
  // year — the same affordance the day grid's adjacent-month cells give.
  const yearGrid = computed(() => {
    const base = decadeStart.value
    const { single, rangeStart, rangeEnd } = bounds.value
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const y = base - 1 + i
      const date = periodStart(y)
      const end = endOfYear(date)
      const isRangeStartCell = !!rangeStart && isSameYear(date, rangeStart)
      const isRangeEndCell = !!rangeEnd && isSameYear(date, rangeEnd)
      return {
        date,
        key: String(y),
        label: String(y),
        isNow: isSameYear(date, now),
        isSelected:
          props.mode.value === 'single'
            ? !!single && isSameYear(date, single)
            : isRangeStartCell || isRangeEndCell,
        isRangeStart: isRangeStartCell,
        isRangeEnd: isRangeEndCell,
        isInRange:
          !!rangeStart &&
          !!rangeEnd &&
          isAfter(date, startOfYear(rangeStart)) &&
          isBefore(date, startOfYear(rangeEnd)),
        isOutside: y < base || y > base + 9,
        isDisabled: isPeriodDisabled(date, end),
      }
    })
  })

  // Every date that leaves this composable is snapped to the start of the period
  // the precision selects, so `tempRangeStart`, the emitted value and the range
  // comparisons above all speak the same granularity.
  const normalize = (date: Date) => {
    if (precision.value === 'year') return startOfYear(date)
    if (precision.value === 'month') return startOfMonth(date)
    return startOfDay(date)
  }

  const formatValue = (date: Date) => {
    const vf =
      props.valueFormat && 'value' in props.valueFormat
        ? props.valueFormat.value
        : props.valueFormat
    return format(date, vf || KUN_CALENDAR_VALUE_FORMATS[precision.value])
  }

  const selectDate = (
    input: Date
  ): [string | null, string | null] | string | null => {
    const date = normalize(input)
    if (props.mode.value === 'single') {
      return formatValue(date)
    }
    if (
      !tempRangeStart.value ||
      (Array.isArray(props.modelValue.value) && props.modelValue.value[1])
    ) {
      tempRangeStart.value = date
      return [formatValue(date), null]
    }
    const start = tempRangeStart.value
    tempRangeStart.value = null
    if (!start) {
      return [formatValue(date), null]
    }
    if (isBefore(date, start)) {
      return [formatValue(date), formatValue(start)]
    }
    return [formatValue(start), formatValue(date)]
  }

  return {
    viewingDate,
    precision,
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
    normalize,
    selectDate,
    formatDate,
    tempRangeStart,
  }
}
