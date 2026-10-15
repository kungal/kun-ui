<script setup lang="ts" generic="T extends KunCommandItem = KunCommandItem">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { warnTopLayerConflict } from '../utils/warnTopLayerConflict'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { useKunShortcutPlatform } from '../composables/useKunShortcutPlatform'
import { isImeComposing } from '../utils/imeComposition'
import KunIcon from './Icon.vue'
import KunCommandResults from './CommandResults.vue'
import { useKunLocale } from '../locale/useKunLocale'
import { commandItemKey, createCommandHighlighter, toCommandRows } from '../utils/commandItems'
import type { KunCommandItem, KunCommandPaletteProps } from './types'

// The generic ⌘K command-palette SHELL. It owns the dialog, query input,
// keyboard nav, grouped rendering, highlighting and a11y — NOT the search: you
// compute `items` (flat or grouped) from the `query` it exposes via
// `v-model:query`, and it renders + navigates them. Selecting emits `@select`.
defineOptions({ name: 'KunCommandPalette', inheritAttrs: false })

const { t } = useKunLocale()

const props = withDefaults(defineProps<KunCommandPaletteProps<T>>(), {
  items: () => [],
  loading: false,
  shortcut: true,
  highlight: true,
  ariaLabel: '',
})

const emit = defineEmits<{
  /** The item the user activated. A disabled item never emits. */
  select: [item: T]

  /**
   * Enter with nothing to select — no results, or every result disabled. The
   * shell has no search of its own, so this is the only way a consumer can act
   * on the raw query ("search the whole site for …"). Enter over a real result
   * still selects it; put an action row first if you want one that is visible.
   */
  submit: [query: string]

  /** The remove button or Shift+Delete on a `removable` row. Drop the item from
   *  `items`; the highlight stays on the row that takes its place. */
  remove: [item: T]
}>()

const resolvedPlaceholder = computed(
  () => props.placeholder ?? t('commandPalette.placeholder')
)

const isOpen = defineModel<boolean>('open', { default: false })
const query = defineModel<string>('query', { default: '' })

const uid = useKunUniqueId('kun-command')
const listId = computed(() => `${uid.value}-list`)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(overlayRef)
const activeIndex = ref(0)

const rows = computed(() => toCommandRows<T>(props.items))
const flat = computed(() => rows.value.flatMap((r) => r.items))
const hasResults = computed(() => flat.value.length > 0)
const activeId = computed(() =>
  flat.value[activeIndex.value] ? `${uid.value}-opt-${activeIndex.value}` : undefined
)

const firstEnabled = () => {
  const i = flat.value.findIndex((r) => !r.item.disabled)
  return i === -1 ? 0 : i
}
let removed: { key: string | number; index: number } | null = null
watch(query, () => {
  removed = null
})
watch(flat, (list) => {
  const r = removed
  removed = null
  if (r && list.length && !list.some((row) => commandItemKey(row.item) === r.key)) {
    const i = Math.min(r.index, list.length - 1)
    activeIndex.value = list[i]!.item.disabled ? firstEnabled() : i
    return
  }
  activeIndex.value = firstEnabled()
})
const removeItem = (item: T, index: number) => {
  if (item.disabled) return
  removed = { key: commandItemKey(item), index }
  emit('remove', item)
}

// ── keyboard ────────────────────────────────────────────────────────────────
const scrollActiveIntoView = () => {
  nextTick(() =>
    listRef.value
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  )
}
const move = (delta: 1 | -1) => {
  const n = flat.value.length
  if (!n) return
  let i = activeIndex.value
  for (let step = 0; step < n; step++) {
    i = (i + delta + n) % n
    if (!flat.value[i]!.item.disabled) {
      activeIndex.value = i
      break
    }
  }
  scrollActiveIntoView()
}
const onInputKeydown = (e: KeyboardEvent) => {
  if (isImeComposing(e)) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(-1)
      break
    case 'Home':
      e.preventDefault()
      activeIndex.value = firstEnabled()
      scrollActiveIntoView()
      break
    case 'End':
      e.preventDefault()
      for (let i = flat.value.length - 1; i >= 0; i--) {
        if (!flat.value[i]!.item.disabled) {
          activeIndex.value = i
          break
        }
      }
      scrollActiveIntoView()
      break
    case 'Enter': {
      const row = flat.value[activeIndex.value]
      if (row && !row.item.disabled) {
        e.preventDefault()
        selectItem(row.item)
        break
      }
      // Nothing to select. Emit instead of swallowing the key: preventDefault
      // here used to make Enter a dead key on a no-result query.
      if (query.value.trim()) emit('submit', query.value.trim())
      break
    }
    case 'Escape':
      e.preventDefault()
      close()
      break
    case 'Delete': {
      const row = flat.value[activeIndex.value]
      if (e.shiftKey && row?.item.removable) {
        e.preventDefault()
        removeItem(row.item, row.index)
      }
      break
    }
  }
}

// ── select ────────────────────────────────────────────────────────────────
const selectItem = (item: T) => {
  if (item.disabled) return
  emit('select', item)
  close()
}

// ── open / close (+ scroll lock, focus restore) ─────────────────────────────
let lastFocused: HTMLElement | null = null
const { lock, unlock } = useBodyScrollLock()

const open = () => {
  if (isOpen.value) return
  lastFocused = (typeof document !== 'undefined'
    ? (document.activeElement as HTMLElement)
    : null)
  isOpen.value = true
}
const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
}
const toggle = () => (isOpen.value ? close() : open())

// Escape is handled on the input, and the results are real <button>/<a>
// elements — so one Tab takes focus off the input and Escape stops closing the
// dialog. Measured in Chrome 152: two Tabs put focus on a BUTTON[role=option]
// and Escape left the palette open. There is no focus trap here to keep focus
// inside, so the listener goes on the window rather than the panel.
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
})

watch(isOpen, (openNow) => {
  if (openNow) {
    warnTopLayerConflict('KunCommandPalette')
    lock()
    activeIndex.value = firstEnabled()
    nextTick(() => inputRef.value?.focus({ preventScroll: true }))
  } else {
    unlock()
    query.value = ''
    activeIndex.value = 0
    nextTick(() => lastFocused?.focus?.({ preventScroll: true }))
  }
})
onUnmounted(() => {
  if (isOpen.value) unlock()
})

// ── ⌘K / custom global shortcut ─────────────────────────────────────────────
const shortcutKey = computed(() =>
  props.shortcut === false
    ? null
    : typeof props.shortcut === 'string'
      ? props.shortcut.toLowerCase()
      : 'k'
)
const platform = useKunShortcutPlatform()
const shortcutKeys = computed(() => (shortcutKey.value ? `Mod+${shortcutKey.value}` : ''))
const shortcutLabel = computed(() => {
  const k = shortcutKey.value
  if (!k) return ''
  return `${platform.value === 'apple' ? '⌘' : 'Ctrl '}${k.toUpperCase()}`
})
const onGlobalKeydown = (e: KeyboardEvent) => {
  // A visible KunCommandSearch answers the same shortcut first (capture phase).
  if (e.defaultPrevented) return
  const k = shortcutKey.value
  if (k && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === k) {
    e.preventDefault()
    toggle()
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

const highlight = computed(() => createCommandHighlighter(query.value, props.highlight))

defineExpose({ open, close, toggle })
</script>

<template>
  <!-- Trigger (optional): the slot gets `open`, a platform shortcut label and
       the same shortcut as KunKbd `keys`. Omit it and drive the palette with
       `v-model:open` / the ⌘K shortcut. -->
  <slot name="trigger" :open="open" :shortcut="shortcutLabel" :keys="shortcutKeys" />

  <Teleport to="body">
    <Transition name="kun-command">
      <div
        v-if="isOpen"
        ref="overlayRef"
        data-kun-overlay
        class="kun-command-overlay z-kun-modal fixed inset-0 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="kun-command-panel bg-content1 border-kun rounded-kun-lg shadow-kun-lg flex max-h-[70dvh] w-full max-w-xl flex-col overflow-hidden border"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel || resolvedPlaceholder"
        >
          <!-- input -->
          <div class="border-kun flex items-center gap-3 border-b px-4">
            <KunIcon name="lucide:search" class="text-default-400 shrink-0" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              role="combobox"
              enterkeyhint="search"
              autocomplete="off"
              spellcheck="false"
              :placeholder="resolvedPlaceholder"
              :aria-controls="listId"
              :aria-expanded="isOpen"
              :aria-activedescendant="activeId"
              class="text-foreground placeholder:text-foreground-muted flex-1 bg-transparent py-3.5 text-sm outline-none"
              @keydown="onInputKeydown"
            />
            <button
              type="button"
              class="text-default-400 hover:text-default-600 flex shrink-0 cursor-pointer items-center"
              :aria-label="t('commandPalette.close')"
              @click="close"
            >
              <KunIcon name="lucide:x" />
            </button>
          </div>

          <!-- results -->
          <div
            ref="listRef"
            :id="listId"
            role="listbox"
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
          >
            <template v-if="loading">
              <slot name="loading">
                <p class="text-foreground-muted px-3 py-6 text-center text-sm">
                  {{ t('commandPalette.loading') }}
                </p>
              </slot>
            </template>

            <template v-else-if="hasResults">
              <KunCommandResults
                :rows="rows"
                :active-index="activeIndex"
                :uid="uid"
                :highlight="highlight"
                @select="selectItem"
                @hover="(i) => (activeIndex = i)"
                @remove="removeItem"
              >
                <template v-if="$slots.item" #item="{ item, active, index, highlight: hl }">
                  <slot name="item" :item="item" :active="active" :index="index" :highlight="hl" />
                </template>
              </KunCommandResults>
            </template>

            <template v-else>
              <slot v-if="query.trim()" name="no-result" :query="query">
                <p class="text-foreground-muted px-3 py-6 text-center text-sm">
                  {{ noResultText ?? t('commandPalette.noResult') }}:<span class="text-default-600">{{ query }}</span>
                </p>
              </slot>
              <slot v-else name="empty">
                <p class="text-foreground-muted px-3 py-6 text-center text-sm">
                  {{ emptyText ?? t('commandPalette.empty') }}
                </p>
              </slot>
            </template>
          </div>

          <!-- footer hints -->
          <slot name="footer">
            <div
              class="border-kun text-foreground-muted flex items-center gap-4 border-t px-4 py-2 text-[11px]"
            >
              <span><kbd class="text-foreground-muted">↑↓</kbd> {{ t('commandPalette.hintSelect') }}</span>
              <span><kbd class="text-foreground-muted">↵</kbd> {{ t('commandPalette.hintOpen') }}</span>
              <span><kbd class="text-foreground-muted">esc</kbd> {{ t('commandPalette.hintClose') }}</span>
              <span class="ml-auto">{{ t('commandPalette.resultCount', { count: flat.length }) }}</span>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kun-command-enter-active,
.kun-command-leave-active {
  transition: opacity 0.15s ease;
}
.kun-command-enter-active .kun-command-panel,
.kun-command-leave-active .kun-command-panel {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}
.kun-command-enter-from,
.kun-command-leave-to {
  opacity: 0;
}
.kun-command-enter-from .kun-command-panel,
.kun-command-leave-to .kun-command-panel {
  transform: translateY(-8px) scale(0.98);
  opacity: 0;
}
</style>
