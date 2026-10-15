<script setup lang="ts" generic="T extends KunCommandItem = KunCommandItem">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { size as floatingSize } from '@floating-ui/vue'
import {
  cn,
  kunControlSizeClasses,
  kunFocusRingClasses,
  kunPanelRoundedClass,
  kunRoundedClasses,
} from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunShortcutPlatform } from '../composables/useKunShortcutPlatform'
import { scrollItemIntoView } from '../utils/scrollItemIntoView'
import { isImeComposing } from '../utils/imeComposition'
import { commandItemKey, createCommandHighlighter, toCommandRows } from '../utils/commandItems'
import KunIcon from './Icon.vue'
import KunKbd from './Kbd.vue'
import KunCommandResults from './CommandResults.vue'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunCommandItem, KunCommandSearchProps } from './types'

defineOptions({ name: 'KunCommandSearch', inheritAttrs: false })

const { t } = useKunLocale()

const props = withDefaults(defineProps<KunCommandSearchProps<T>>(), {
  items: () => [],
  loading: false,
  placeholder: undefined,
  noResultText: undefined,
  shortcut: true,
  highlight: true,
  size: 'md',
  rounded: undefined,
  maxHeight: 420,
  ariaLabel: '',
  className: undefined,
})

const emit = defineEmits<{
  /** The row the user clicked, or highlighted with the arrow keys and confirmed
   *  with Enter. A disabled row never emits. */
  select: [item: T]

  /**
   * Enter with no row highlighted, carrying the trimmed query: the way to the
   * full search page. Nothing is highlighted until an arrow key moves onto a
   * row, so Enter after typing always lands here.
   */
  submit: [query: string]

  /** The remove button or Shift+Delete on a `removable` row. Drop the item from
   *  `items`; the highlight stays on the row that takes its place. */
  remove: [item: T]
}>()

const slots = useSlots()
const query = defineModel<string>('query', { default: '' })

const resolvedPlaceholder = computed(
  () => props.placeholder ?? t('commandPalette.placeholder')
)
const rounded = useResolvedRounded(() => props.rounded)

const uid = useKunUniqueId('kun-command-search')
const listId = computed(() => `${uid.value}-list`)
const inputRef = ref<HTMLInputElement | null>(null)
const fieldRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(panelRef, { trigger: fieldRef })

const rows = computed(() => toCommandRows<T>(props.items))
const flat = computed(() => rows.value.flatMap((r) => r.items))
const hasResults = computed(() => flat.value.length > 0)
const trimmed = computed(() => query.value.trim())
const highlight = computed(() => createCommandHighlighter(query.value, props.highlight))

const isOpen = ref(false)
const shown = computed(
  () =>
    isOpen.value &&
    (props.loading || hasResults.value || !!trimmed.value || !!slots.empty)
)

const activeIndex = ref(-1)
const activeId = computed(() =>
  shown.value && flat.value[activeIndex.value]
    ? `${uid.value}-opt-${activeIndex.value}`
    : undefined
)

const MIN_PANEL_WIDTH = 360
const { floatingStyles, transformOrigin } = useKunFloating(fieldRef, panelRef, {
  placement: 'bottom-start',
  open: shown,
  offset: 4,
  middleware: [
    floatingSize({
      padding: 8,
      apply({ rects, elements, availableWidth, availableHeight }) {
        Object.assign(elements.floating.style, {
          width: `${Math.min(Math.max(rects.reference.width, MIN_PANEL_WIDTH), Math.floor(availableWidth))}px`,
          maxHeight: `${Math.max(0, Math.min(props.maxHeight, Math.floor(availableHeight)))}px`,
        })
      },
    }),
  ],
})

const open = () => {
  isOpen.value = true
}
const close = () => {
  isOpen.value = false
  activeIndex.value = -1
}

const scrollActiveIntoView = () => {
  requestAnimationFrame(() =>
    scrollItemIntoView(listRef.value, listRef.value?.querySelector('[data-active="true"]'))
  )
}

// -1 (nothing highlighted, so Enter submits) is a stop in the cycle, as in a
// browser's address bar: Up from the first row goes back to the typed text.
const move = (delta: 1 | -1) => {
  const n = flat.value.length
  if (!n) return
  let i = activeIndex.value
  for (let step = 0; step <= n; step++) {
    i += delta
    if (i >= n) i = -1
    else if (i < -1) i = n - 1
    if (i === -1 || !flat.value[i]!.item.disabled) break
  }
  activeIndex.value = i
  scrollActiveIntoView()
}

// A new query or a new result list drops the highlight: rows that arrive under
// a highlighted index are not the row the user moved to, and Enter would pick
// one they never saw highlighted. A removal keeps it on the row that moved up,
// but only once the removed row is actually gone; a removal the app answers
// late (or not at all) must not re-highlight a row in some later list.
let removed: { key: string | number; index: number } | null = null
watch(query, () => {
  removed = null
  activeIndex.value = -1
})
watch(flat, (list) => {
  const r = removed
  removed = null
  const i =
    r && !list.some((row) => commandItemKey(row.item) === r.key)
      ? Math.min(r.index, list.length - 1)
      : -1
  activeIndex.value = i >= 0 && !list[i]!.item.disabled ? i : -1
})

const selectItem = (item: T) => {
  if (item.disabled) return
  emit('select', item)
  close()
  inputRef.value?.blur()
}
const submit = () => {
  emit('submit', trimmed.value)
  close()
  inputRef.value?.blur()
}
const removeItem = (item: T, index: number) => {
  if (item.disabled) return
  removed = { key: commandItemKey(item), index }
  emit('remove', item)
}
const onListLeave = () => {
  removed = null
  activeIndex.value = -1
}
const clear = () => {
  query.value = ''
  inputRef.value?.focus({ preventScroll: true })
  open()
}

const onKeydown = (e: KeyboardEvent) => {
  if (isImeComposing(e)) return
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      if (!shown.value) open()
      else move(e.key === 'ArrowDown' ? 1 : -1)
      break
    case 'Enter': {
      const row = shown.value ? flat.value[activeIndex.value] : undefined
      if (row) {
        e.preventDefault()
        selectItem(row.item)
      } else if (trimmed.value) {
        e.preventDefault()
        submit()
      }
      break
    }
    // The first Escape closes the panel and keeps the text; the next one clears
    // the text (WAI-ARIA APG combobox). preventDefault so an enclosing KunModal
    // does not take the same keystroke as its close request.
    case 'Escape':
      if (shown.value) {
        e.preventDefault()
        close()
      } else if (query.value) {
        e.preventDefault()
        query.value = ''
      }
      break
    case 'Tab':
      close()
      break
    case 'Delete': {
      const row = shown.value ? flat.value[activeIndex.value] : undefined
      if (e.shiftKey && row?.item.removable) {
        e.preventDefault()
        removeItem(row.item, row.index)
      }
      break
    }
  }
}

// A press on the icon or padding around the input would otherwise take focus
// off it and close the panel.
const onFieldMousedown = (e: MouseEvent) => {
  if (e.target === inputRef.value) return
  e.preventDefault()
  inputRef.value?.focus({ preventScroll: true })
}

const shortcutKey = computed(() =>
  props.shortcut === false
    ? null
    : typeof props.shortcut === 'string'
      ? props.shortcut.toLowerCase()
      : 'k'
)
const shortcutKeys = computed(() => (shortcutKey.value ? `Mod+${shortcutKey.value}` : ''))
const platform = useKunShortcutPlatform()
const ariaShortcut = computed(() =>
  shortcutKey.value
    ? `${platform.value === 'apple' ? 'Meta' : 'Control'}+${shortcutKey.value.toUpperCase()}`
    : undefined
)

// Capture phase, so a KunCommandPalette listening for the same shortcut (the
// narrow-screen stand-in for this field) sees it defaultPrevented and stands
// down. A field that is not on screen, or sits behind a modal, leaves the key
// alone so the palette can have it.
const onShortcut = (e: KeyboardEvent) => {
  const k = shortcutKey.value
  const input = inputRef.value
  if (!k || !input || e.defaultPrevented) return
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== k) return
  if (!input.getClientRects().length || input.closest('[inert]')) return
  const modal =
    e.target instanceof Element ? e.target.closest('[aria-modal="true"], dialog[open]') : null
  if (modal && !modal.contains(input)) return
  e.preventDefault()
  input.focus({ preventScroll: true })
  input.select()
  open()
}
onMounted(() => window.addEventListener('keydown', onShortcut, true))
onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut, true))

const statusText = computed(() => {
  if (!shown.value) return ''
  if (hasResults.value) {
    return trimmed.value ? t('commandPalette.resultCount', { count: flat.value.length }) : ''
  }
  if (props.loading) return t('commandPalette.loading')
  return trimmed.value ? (props.noResultText ?? t('commandPalette.noResult')) : ''
})

defineExpose({
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
  close,
})
</script>

<template>
  <div :class="cn('relative w-full min-w-0', className)">
    <div ref="fieldRef" class="relative" @mousedown="onFieldMousedown">
      <div
        class="text-default-400 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <KunIcon :name="loading ? 'svg-spinners:90-ring-with-bg' : 'lucide:search'" />
      </div>
      <input
        ref="inputRef"
        v-bind="$attrs"
        v-model="query"
        type="text"
        role="combobox"
        enterkeyhint="search"
        autocomplete="off"
        spellcheck="false"
        aria-autocomplete="list"
        :aria-expanded="shown"
        :aria-controls="shown && hasResults ? listId : undefined"
        :aria-activedescendant="activeId"
        :aria-keyshortcuts="ariaShortcut"
        :aria-label="ariaLabel || resolvedPlaceholder"
        :placeholder="resolvedPlaceholder"
        :class="
          cn(
            'peer bg-content1 shadow-kun-sm border-kun block w-full border transition-[color,box-shadow] duration-kun-fast ease-kun-standard',
            kunRoundedClasses[rounded],
            kunControlSizeClasses[size],
            'pl-10',
            query ? 'pr-10' : shortcutKeys && 'pr-20',
            kunFocusRingClasses.default
          )
        "
        @focus="open"
        @blur="close"
        @input="open"
        @mousedown="open"
        @keydown="onKeydown"
      />
      <div v-if="query" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          tabindex="-1"
          class="text-default-400 hover:text-default-600 flex items-center"
          :aria-label="t('commandPalette.clear')"
          @click="clear"
        >
          <KunIcon name="lucide:circle-x" class="size-4" />
        </button>
      </div>
      <div
        v-else-if="shortcutKeys"
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 peer-focus:hidden"
      >
        <KunKbd :keys="shortcutKeys" />
      </div>
    </div>

    <span role="status" class="sr-only">{{ statusText }}</span>

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
          v-if="shown"
          ref="panelRef"
          data-kun-overlay
          :style="[floatingStyles, { transformOrigin }]"
          :class="
            cn(
              'bg-content1 z-kun-popover border-kun shadow-kun-md flex flex-col overflow-hidden border',
              kunPanelRoundedClass(rounded)
            )
          "
          @mousedown.prevent
        >
          <div ref="listRef" class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">
            <div
              v-if="hasResults"
              :id="listId"
              role="listbox"
              :aria-label="ariaLabel || resolvedPlaceholder"
              :aria-busy="loading || undefined"
              @mouseleave="onListLeave"
            >
              <KunCommandResults
                :rows="rows"
                :active-index="activeIndex"
                :uid="uid"
                :highlight="highlight"
                :option-tabindex="-1"
                @select="selectItem"
                @hover="(i) => (activeIndex = i)"
                @remove="removeItem"
              >
                <template v-if="$slots.item" #item="{ item, active, index, highlight: hl }">
                  <slot name="item" :item="item" :active="active" :index="index" :highlight="hl" />
                </template>
              </KunCommandResults>
            </div>
            <template v-else-if="loading">
              <slot name="loading">
                <p class="text-foreground-muted px-3 py-6 text-center text-sm">
                  {{ t('commandPalette.loading') }}
                </p>
              </slot>
            </template>
            <template v-else-if="trimmed">
              <slot name="no-result" :query="trimmed">
                <p class="text-foreground-muted px-3 py-6 text-center text-sm">
                  {{ noResultText ?? t('commandPalette.noResult') }}
                </p>
              </slot>
            </template>
            <slot v-else name="empty" />
          </div>
          <slot name="footer" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
