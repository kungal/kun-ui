<script setup lang="ts" generic="T extends KunSelectValue = KunSelectValue, O extends KunSelectOption<T> = KunSelectOption<T>">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { size } from '@floating-ui/vue'
import {
  cn,
  kunRoundedClasses,
  kunControlSizeClasses,
  kunFocusRingClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { scrollItemIntoView } from '../utils/scrollItemIntoView'
import { isImeComposing } from '../utils/imeComposition'
import KunIcon from './Icon.vue'
import KunLoading from './Loading.vue'
import type { KunSelectOption, KunSelectProps, KunSelectValue } from './types'

defineOptions({ name: 'KunSelect' })

const props = withDefaults(defineProps<KunSelectProps<T, O>>(), {
  placeholder: '',
  label: '',
  disabled: false,
  error: '',
  description: '',
  darkBorder: true,
  color: 'default',
  ariaLabel: '',
  className: '',
  rounded: undefined,
  size: 'md',
  multiple: false,
  searchable: false,
  clearable: false,
  searchPlaceholder: '搜索…',
  noResultText: '无匹配项',
  name: undefined,
  icon: undefined,
  fullWidth: true,
  maxVisibleTags: undefined,
  popupWidth: 'trigger',
  classNames: undefined,
  manualFilter: false,
  loading: false,
  loadingText: '加载中…',
  debounce: 0,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// null/[] represents "nothing selected"; single = scalar, multiple = array.
const modelValue = defineModel<T | T[] | null>({ required: true })

const emit = defineEmits<{
  set: [value: T, index: number]
  search: [query: string]
}>()

const kunUniqueId = useKunUniqueId('kun-select')
const listId = computed(() => `${kunUniqueId.value}-listbox`)
const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(dropdownRef, { trigger: buttonRef })
const listRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const { floatingStyles, transformOrigin } = useKunFloating(buttonRef, dropdownRef, {
  placement: 'bottom-start',
  open: isOpen,
  offset: 4,
  middleware: [
    // Inline styles, not classes: the popup's width is correctness, not
    // appearance — a purged utility would leave the list at its content width
    // over a trigger it is supposed to match. Height is always capped to the
    // viewport so the list scrolls instead of overflowing.
    size({
      apply({ rects, elements, availableHeight, availableWidth }) {
        const w = props.popupWidth
        // A number is a *requested* width, not a licence to leave the screen:
        // `popupWidth: 700` in a 360px viewport measured 348px off the right
        // edge and grew documentElement.scrollWidth to 2008, i.e. the whole page
        // got a horizontal scrollbar. `shift()` cannot rescue a popup wider than
        // the viewport, so the cap applies to every mode except `trigger`, which
        // is on-screen by construction.
        Object.assign(elements.floating.style, {
          width: typeof w === 'number' ? `${w}px` : w === 'auto' ? '' : `${rects.reference.width}px`,
          minWidth: w === 'auto' ? `${rects.reference.width}px` : '',
          maxWidth: w === 'trigger' ? '' : `${Math.max(0, availableWidth - 8)}px`,
          maxHeight: `${Math.min(280, availableHeight - 8)}px`,
        })
      },
    }),
  ],
})

// ── selection model ──────────────────────────────────────────────────────
const selected = computed<T[]>(() => {
  const v = modelValue.value
  if (props.multiple) return Array.isArray(v) ? v : []
  return v === undefined || v === null ? [] : [v as T]
})
const selectedSet = computed(() => new Set<KunSelectValue>(selected.value))
const optionByValue = computed(() => {
  const m = new Map<KunSelectValue, O>()
  for (const o of props.options) m.set(o.value, o)
  return m
})

// A remote source replaces `options` on every query, which used to take the
// chips with it: search "fate", pick it, search "clannad" — the picked option is
// no longer in the list, so its chip lost its label while the value stayed in
// the model. Keep the last known option for everything currently selected
// (Element Plus carries a `cachedOptions` map for the same reason), and only
// for that, so the map cannot grow past the selection.
const optionCache = shallowRef(new Map<KunSelectValue, O>())
watch(
  [() => props.options, selected],
  ([opts, sel]) => {
    const keep = new Set<KunSelectValue>(sel)
    const next = new Map<KunSelectValue, O>()
    for (const [k, v] of optionCache.value) if (keep.has(k)) next.set(k, v)
    for (const o of opts) if (keep.has(o.value)) next.set(o.value, o)
    optionCache.value = next
  },
  { immediate: true }
)

// Model order, not `options` order: the hidden form inputs already iterate the
// model, so ordering the chips by the list made the two disagree.
//
// A value that neither `options` nor the cache can name still gets a chip, off
// its own raw value. Dropping it made the chips disagree with the count: model
// ['clannad', 'deleted-tag'] rendered one chip plus an unexplained "+1" badge
// that carried no remove button, so the value could not be seen or removed.
// Element Plus and antd both fall back to the value for the same reason.
const selectedChips = computed<{ value: T; label: string }[]>(() =>
  selected.value.map((v) => {
    const o = optionByValue.value.get(v) ?? optionCache.value.get(v)
    return { value: v, label: o ? o.label : String(v) }
  })
)
const singleLabel = computed(() => selectedChips.value[0]?.label ?? '')
const hasSelection = computed(() => selected.value.length > 0)

// Uncapped, the trigger grows a row per selection — fine for a form field,
// fatal for a filter bar. 0 visible chips falls through to the text branch.
const visibleTags = computed(() =>
  props.maxVisibleTags == null
    ? selectedChips.value
    : selectedChips.value.slice(0, Math.max(0, props.maxVisibleTags))
)
const hiddenTagCount = computed(
  () => selected.value.length - visibleTags.value.length
)
const showsChips = computed(
  () => props.multiple && hasSelection.value && visibleTags.value.length > 0
)
const triggerText = computed(() => {
  if (!props.multiple) return singleLabel.value || props.placeholder
  if (!hasSelection.value) return props.placeholder
  const n = selected.value.length
  return props.placeholder ? `${props.placeholder} · ${n}` : String(n)
})

// ── filtering ──────────────────────────────────────────────────────────
const filtered = computed(() => {
  if (props.manualFilter || !props.searchable || !query.value.trim())
    return props.options
  const q = query.value.trim().toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

// `showSpinner` gates this: while the spinner is up the rows are not rendered,
// and an `aria-activedescendant` naming an id that is not in the DOM makes the
// listbox read to a screen reader as having no active option at all.
const activeId = computed(() =>
  activeIndex.value >= 0 && !showSpinner.value && filtered.value[activeIndex.value]
    ? `${kunUniqueId.value}-opt-${activeIndex.value}`
    : undefined
)

const firstEnabled = (from = 0, dir = 1) => {
  const list = filtered.value
  for (let i = from; i >= 0 && i < list.length; i += dir) {
    if (!list[i]!.disabled) return i
  }
  return -1
}

// ── search ───────────────────────────────────────────────────────────────
// Same contract as KunAutocomplete: the filter field updates instantly, only
// the parent notification waits. `immediate` skips the wait for resets (open /
// clear) and supersedes any pending keystroke emit. While a timer is armed we
// are "about to search", so `pending` shows the spinner and suppresses
// `noResultText` — otherwise the gap before the request flashes "no matches".
const pending = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null
const cancelPendingSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  pending.value = false
}
const emitSearch = (q: string, immediate = false) => {
  cancelPendingSearch()
  if (immediate || props.debounce <= 0) {
    emit('search', q)
    return
  }
  pending.value = true
  searchTimer = setTimeout(() => {
    searchTimer = null
    pending.value = false
    emit('search', q)
  }, props.debounce)
}
onBeforeUnmount(cancelPendingSearch)

const showSpinner = computed(() => props.loading || pending.value)

const applySearch = (value: string) => {
  // Element Plus bails on an unchanged query (`previousQuery === val`) for the
  // reason we need it: compositionend and the browser's own final `input` can
  // both deliver the committed text, and that would emit @search twice.
  if (value === query.value) return
  query.value = value
  // The highlight is an index into a list the new query is about to replace.
  // KunAutocomplete records the incident: with the index kept, Enter committed
  // whichever row happened to land at it in the NEXT query's results.
  activeIndex.value = firstEnabled()
  emitSearch(value)
}

// `v-model` on a text input installs Vue's own composition guard — its input
// listener opens with `if (e.target.composing) return` and replays one event on
// compositionend. Reading the value off the event instead (below) opts out of
// that. Measured over CDP `Input.imeSetComposition` in Chrome 152: typing 你好
// through a Pinyin IME re-filtered on every romaji keystroke, collapsing the
// panel to `noResultText` while the candidate window was still open, and fired
// five @search emits before the real one. So track composition here.
const composing = ref(false)
const onCompositionEnd = (e: CompositionEvent) => {
  composing.value = false
  applySearch((e.target as HTMLInputElement).value)
}

const onSearchInput = (e: Event) => {
  if (composing.value) return
  // Value off the event, never read back out of state — the rule 2.26.3 was
  // cut for. @search must carry the text that was just typed.
  applySearch((e.target as HTMLInputElement).value)
}

// ── open / close ─────────────────────────────────────────────────────────
const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  query.value = ''
  // Start on the (first) selected option, else the first enabled one.
  const sel = filtered.value.findIndex((o) => selectedSet.value.has(o.value))
  activeIndex.value = sel >= 0 ? sel : firstEnabled()
  nextTick(() => {
    // preventScroll: the search field lives in the teleported dropdown, which
    // is momentarily at (0,0) before floating-ui's first measurement — a plain
    // focus() would scroll the page to the top. floating-ui handles visibility.
    if (props.searchable) searchRef.value?.focus({ preventScroll: true })
    scrollActiveIntoView()
  })
  // Opening resets the query, so a remote source gets told to load its first
  // page. Immediate: there is nothing to debounce against on an open.
  if (props.searchable) emitSearch('', true)
}

const close = (returnFocus = true) => {
  if (!isOpen.value) return
  isOpen.value = false
  query.value = ''
  cancelPendingSearch()
  if (returnFocus) nextTick(() => buttonRef.value?.focus({ preventScroll: true }))
}

const toggle = () => (isOpen.value ? close() : open())

onClickOutside(buttonRef, (event) => {
  if (dropdownRef.value?.contains(event.target as Node)) return
  close(false)
})

// ── selection actions ────────────────────────────────────────────────────
const selectOption = (option: O) => {
  if (props.disabled || option.disabled) return
  const origIndex = props.options.findIndex((o) => o.value === option.value)
  if (props.multiple) {
    const cur = Array.isArray(modelValue.value) ? [...modelValue.value] : []
    const at = cur.indexOf(option.value)
    if (at >= 0) cur.splice(at, 1)
    else cur.push(option.value)
    modelValue.value = cur
    if (props.searchable) nextTick(() => searchRef.value?.focus({ preventScroll: true }))
  } else {
    modelValue.value = option.value
    close()
  }
  emit('set', option.value, origIndex)
}

const selectActive = () => {
  if (showSpinner.value) return
  const opt = filtered.value[activeIndex.value]
  if (opt) selectOption(opt)
}

const removeValue = (value: T) => {
  if (props.disabled) return
  const cur = Array.isArray(modelValue.value) ? [...modelValue.value] : []
  modelValue.value = cur.filter((v) => v !== value)
}

const clearAll = () => {
  if (props.disabled) return
  modelValue.value = props.multiple ? [] : null
}

// ── keyboard ─────────────────────────────────────────────────────────────
const scrollActiveIntoView = () => {
  nextTick(() => {
    scrollItemIntoView(
      listRef.value,
      listRef.value?.querySelector(`[data-index="${activeIndex.value}"]`)
    )
  })
}

const moveActive = (dir: 1 | -1) => {
  if (showSpinner.value) return
  const n = filtered.value.length
  if (!n) return
  let i = activeIndex.value
  for (let step = 0; step < n; step++) {
    i = (i + dir + n) % n
    if (!filtered.value[i]!.disabled) {
      activeIndex.value = i
      break
    }
  }
  scrollActiveIntoView()
}

const setEdgeActive = (dir: 1 | -1) => {
  if (showSpinner.value) return
  activeIndex.value = dir === 1 ? firstEnabled(0, 1) : firstEnabled(filtered.value.length - 1, -1)
  scrollActiveIntoView()
}

// type-ahead for the non-searchable listbox.
let typeBuffer = ''
let typeTimer: ReturnType<typeof setTimeout> | null = null
const typeahead = (char: string) => {
  if (showSpinner.value) return
  typeBuffer += char.toLowerCase()
  if (typeTimer) clearTimeout(typeTimer)
  typeTimer = setTimeout(() => (typeBuffer = ''), 600)
  const i = props.options.findIndex(
    (o) => !o.disabled && o.label.toLowerCase().startsWith(typeBuffer)
  )
  if (i >= 0) {
    activeIndex.value = i
    scrollActiveIntoView()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (isImeComposing(e)) return
  const key = e.key
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      e.preventDefault()
      open()
    }
    return
  }
  switch (key) {
    case 'ArrowDown':
      e.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      moveActive(-1)
      break
    case 'Home':
      e.preventDefault()
      setEdgeActive(1)
      break
    case 'End':
      e.preventDefault()
      setEdgeActive(-1)
      break
    case 'Enter':
      e.preventDefault()
      selectActive()
      break
    case ' ':
      // In a search field a space types; in the plain listbox it selects.
      if (!props.searchable) {
        e.preventDefault()
        selectActive()
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
    case 'Tab':
      close(false)
      break
    default:
      if (
        !props.searchable &&
        key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        typeahead(key)
      }
  }
}

// Filtering shifts indices — keep `active` on a valid, enabled row.
watch(filtered, () => {
  if (!isOpen.value) return
  if (activeIndex.value < 0 || activeIndex.value >= filtered.value.length) {
    activeIndex.value = firstEnabled()
  } else if (filtered.value[activeIndex.value]?.disabled) {
    activeIndex.value = firstEnabled()
  }
})
</script>

<template>
  <div
    :class="
      cn(
        'relative',
        // `w-fit` is not redundant with `inline-block`: a grid item is
        // blockified, and `justify-self: stretch` then filled the whole track —
        // measured 287px against 90px in normal flow.
        fullWidth ? 'w-full' : 'inline-block w-fit align-top',
        props.className,
        props.classNames?.root
      )
    "
  >
    <label
      v-if="label"
      :id="`${kunUniqueId}-label`"
      :for="kunUniqueId"
      class="text-default-700 mb-1 block text-sm font-medium"
    >
      {{ label }}
    </label>

    <div
      ref="buttonRef"
      :id="kunUniqueId"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-label="ariaLabel || (label ? undefined : 'select')"
      :aria-labelledby="label ? `${kunUniqueId}-label` : undefined"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :aria-activedescendant="isOpen ? activeId : undefined"
      :aria-disabled="disabled || undefined"
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

      <!-- Multiple: removable chips, capped by `maxVisibleTags` -->
      <span v-if="showsChips" class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        <span
          v-for="opt in visibleTags"
          :key="String(opt.value)"
          :class="
            cn(
              'bg-default-100 text-default-700 inline-flex max-w-full items-center gap-1 rounded-kun-sm px-1.5 py-0.5 text-xs',
              props.classNames?.chip
            )
          "
        >
          <span class="truncate">{{ opt.label }}</span>
          <button
            v-if="!disabled"
            type="button"
            class="hover:text-danger flex shrink-0 items-center"
            :aria-label="`移除 ${opt.label}`"
            @click.stop="removeValue(opt.value)"
            @mousedown.stop.prevent
          >
            <KunIcon name="lucide:x" class="size-3" />
          </button>
        </span>
        <span
          v-if="hiddenTagCount > 0"
          :class="
            cn(
              'bg-default-100 text-default-700 inline-flex shrink-0 items-center rounded-kun-sm px-1.5 py-0.5 text-xs tabular-nums',
              props.classNames?.chip
            )
          "
        >
          +{{ hiddenTagCount }}
        </span>
      </span>

      <!-- Single, nothing selected, or every chip collapsed (`maxVisibleTags: 0`) -->
      <span v-else class="block min-w-0 flex-1 truncate" :class="!hasSelection && 'text-default-400'">
        {{ triggerText }}
      </span>

      <!-- `flex`, not a bare block: an <svg> alone in a block button sits on the
           line box's text baseline, which pushed the clear icon ~2px above the
           chevron. Same fix as KunDatePicker's trigger. -->
      <button
        v-if="clearable && hasSelection && !disabled"
        type="button"
        class="text-default-400 hover:text-default-600 flex shrink-0 items-center"
        aria-label="清除"
        @click.stop="clearAll"
        @mousedown.stop.prevent
      >
        <KunIcon name="lucide:circle-x" class="size-4" />
      </button>
      <KunIcon
        name="lucide:chevron-down"
        class="pointer-events-none shrink-0 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </div>

    <!-- Hidden native fields so the value is collected by a surrounding <form>. -->
    <template v-if="name">
      <input
        v-for="v in selected"
        :key="`hidden-${String(v)}`"
        type="hidden"
        :name="name"
        :value="String(v)"
      />
      <input v-if="!hasSelection" type="hidden" :name="name" value="" />
    </template>

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
          ref="dropdownRef"
          data-kun-overlay
          :style="[floatingStyles, { transformOrigin }]"
          :class="
            cn(
              'bg-content1 z-kun-popover flex flex-col overflow-hidden p-1 shadow-kun-md',
              roundedClass,
              props.classNames?.popup
            )
          "
        >
          <div v-if="searchable" class="p-1">
            <input
              ref="searchRef"
              :value="query"
              type="text"
              enterkeyhint="done"
              :placeholder="searchPlaceholder"
              role="combobox"
              :aria-controls="listId"
              :aria-expanded="isOpen"
              :aria-activedescendant="activeId"
              :class="
                cn(
                  'bg-content1 shadow-kun-sm border-kun w-full rounded-kun-sm border px-2.5 py-1.5 text-sm',
                  kunFocusRingClasses[color]
                )
              "
              @keydown="onKeydown"
              @input="onSearchInput"
              @compositionstart="composing = true"
              @compositionend="onCompositionEnd"
            />
          </div>

          <ul
            ref="listRef"
            :id="listId"
            :class="
              cn(
                'scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-kun-sm text-sm focus:outline-none',
                props.classNames?.list
              )
            "
            tabindex="-1"
            role="listbox"
            :aria-multiselectable="multiple || undefined"
            :aria-busy="showSpinner || undefined"
          >
            <!-- Async in flight (or the debounce gap): a spinner instead of
                 options / noResultText, so a pending fetch never reads as
                 "no matches". -->
            <li v-if="showSpinner" class="flex justify-center px-3 py-6">
              <KunLoading spinner size="sm" :description="loadingText" />
            </li>

            <template v-else>
              <li
                v-for="(option, index) in filtered"
                :id="`${kunUniqueId}-opt-${index}`"
                :key="String(option.value)"
                :data-index="index"
                class="text-foreground relative flex items-center gap-2 rounded-kun-md px-3 py-2 select-none"
                :class="[
                  option.disabled
                    ? 'text-default-300 cursor-not-allowed'
                    : 'cursor-pointer',
                  index === activeIndex && !option.disabled ? 'bg-default-100' : '',
                  props.classNames?.option,
                ]"
                role="option"
                :aria-selected="selectedSet.has(option.value)"
                :aria-disabled="option.disabled || undefined"
                @click="selectOption(option)"
                @mousemove="!option.disabled && (activeIndex = index)"
              >
                <!-- Custom item rendering: pass an option shape with extra fields
                     (avatar, description, …) and read them here. Defaults to the
                     plain label. The flex-1 wrapper lets rich content (avatar +
                     text) group at the left while the check stays at the right. -->
                <div class="flex min-w-0 flex-1 items-center gap-2">
                  <slot
                    name="option"
                    :option="option"
                    :index="index"
                    :active="index === activeIndex"
                    :selected="selectedSet.has(option.value)"
                  >
                    <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                  </slot>
                </div>
                <KunIcon
                  v-if="selectedSet.has(option.value)"
                  name="lucide:check"
                  class="text-primary shrink-0"
                />
              </li>

              <li
                v-if="!filtered.length"
                class="text-default-400 px-3 py-6 text-center text-sm"
              >
                {{ noResultText }}
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </Teleport>

    <p v-if="error" class="text-danger mt-1 text-sm">{{ error }}</p>
    <p v-else-if="description" class="text-default-500 mt-1 text-sm">
      {{ description }}
    </p>
  </div>
</template>
