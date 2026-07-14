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
import { cn } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import KunIcon from './Icon.vue'
import type {
  KunCommandGroup,
  KunCommandItem,
  KunCommandPaletteProps,
} from './types'

// The generic ⌘K command-palette SHELL. It owns the dialog, query input,
// keyboard nav, grouped rendering, highlighting and a11y — NOT the search: you
// compute `items` (flat or grouped) from the `query` it exposes via
// `v-model:query`, and it renders + navigates them. Selecting emits `@select`.
defineOptions({ name: 'KunCommandPalette', inheritAttrs: false })

const props = withDefaults(defineProps<KunCommandPaletteProps<T>>(), {
  items: () => [],
  loading: false,
  placeholder: '搜索…',
  noResultText: '无结果',
  emptyText: '输入关键字搜索',
  shortcut: true,
  highlight: true,
  ariaLabel: '',
})

const emit = defineEmits<{ select: [item: T] }>()

const isOpen = defineModel<boolean>('open', { default: false })
const query = defineModel<string>('query', { default: '' })

const uid = useKunUniqueId('kun-command')
const listId = computed(() => `${uid.value}-list`)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

// ── normalise `items` (flat OR grouped) → groups, then a flat list that carries
//    each item's GLOBAL index (for roving focus + aria-activedescendant) ──────
const groups = computed<KunCommandGroup<T>[]>(() => {
  const raw = props.items ?? []
  if (!raw.length) return []
  return 'items' in (raw[0] as object)
    ? (raw as readonly KunCommandGroup<T>[]).slice()
    : [{ items: raw as readonly T[] }]
})
const rows = computed(() => {
  let i = 0
  return groups.value.map((g) => ({
    label: g.label,
    items: g.items.map((item) => ({ item, index: i++ })),
  }))
})
const flat = computed(() => rows.value.flatMap((r) => r.items))
const hasResults = computed(() => flat.value.length > 0)
const activeId = computed(() =>
  flat.value[activeIndex.value] ? `${uid.value}-opt-${activeIndex.value}` : undefined
)

const firstEnabled = () => {
  const i = flat.value.findIndex((r) => !r.item.disabled)
  return i === -1 ? 0 : i
}
watch(flat, () => {
  activeIndex.value = firstEnabled()
})

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
    case 'Enter':
      e.preventDefault()
      selectActive()
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
  }
}

// ── select ────────────────────────────────────────────────────────────────
const selectItem = (item: T) => {
  if (item.disabled) return
  emit('select', item)
  close()
}
const selectActive = () => {
  const row = flat.value[activeIndex.value]
  if (row) selectItem(row.item)
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

watch(isOpen, (openNow) => {
  if (openNow) {
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
const isMac = ref(false)
onMounted(() => {
  isMac.value = /mac/i.test(navigator.platform || navigator.userAgent)
})
const shortcutLabel = computed(() => {
  const k = shortcutKey.value
  if (!k) return ''
  return `${isMac.value ? '⌘' : 'Ctrl '}${k.toUpperCase()}`
})
const onGlobalKeydown = (e: KeyboardEvent) => {
  const k = shortcutKey.value
  if (k && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === k) {
    e.preventDefault()
    toggle()
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

// ── safe match highlighting (split on terms → escape each piece → wrap) ──────
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string
  )
const terms = computed(() =>
  query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
)
const highlight = (text: string): string => {
  const valid = props.highlight ? terms.value.map(escapeRegExp).filter(Boolean) : []
  if (!valid.length) return escapeHtml(text)
  const re = new RegExp(`(${valid.join('|')})`, 'gi')
  return text
    .split(re)
    .map((part, i) =>
      i % 2
        ? `<mark class="bg-primary/20 text-foreground rounded-sm px-0.5">${escapeHtml(part)}</mark>`
        : escapeHtml(part)
    )
    .join('')
}

defineExpose({ open, close, toggle })
</script>

<template>
  <!-- Trigger (optional): the slot gets `open` + a platform shortcut label.
       Omit it and drive the palette with `v-model:open` / the ⌘K shortcut. -->
  <slot name="trigger" :open="open" :shortcut="shortcutLabel" />

  <Teleport to="body">
    <Transition name="kun-command">
      <div
        v-if="isOpen"
        class="kun-command-overlay z-kun-modal fixed inset-0 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="kun-command-panel bg-content1 border-kun rounded-kun-lg shadow-kun-lg flex max-h-[70dvh] w-full max-w-xl flex-col overflow-hidden border"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel || placeholder"
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
              :placeholder="placeholder"
              :aria-controls="listId"
              :aria-expanded="isOpen"
              :aria-activedescendant="activeId"
              class="text-foreground placeholder:text-default-400 flex-1 bg-transparent py-3.5 text-sm outline-none"
              @keydown="onInputKeydown"
            />
            <button
              type="button"
              class="text-default-400 hover:text-default-600 shrink-0 cursor-pointer"
              aria-label="关闭"
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
                <p class="text-default-400 px-3 py-6 text-center text-sm">加载中…</p>
              </slot>
            </template>

            <template v-else-if="hasResults">
              <div v-for="(group, gi) in rows" :key="gi" class="mb-1 last:mb-0">
                <div
                  v-if="group.label"
                  class="text-default-400 px-3 pt-2 pb-1 text-xs font-medium"
                >
                  {{ group.label }}
                </div>
                <component
                  :is="row.item.href ? 'a' : 'button'"
                  v-for="row in group.items"
                  :id="`${uid}-opt-${row.index}`"
                  :key="row.item.value ?? row.item.label"
                  :href="row.item.href || undefined"
                  :type="row.item.href ? undefined : 'button'"
                  role="option"
                  :data-active="row.index === activeIndex"
                  :aria-selected="row.index === activeIndex"
                  :aria-disabled="row.item.disabled || undefined"
                  :class="
                    cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-kun-md px-3 py-2 text-left transition-colors',
                      row.index === activeIndex
                        ? 'bg-primary/10'
                        : 'hover:bg-default-100',
                      row.item.disabled && 'pointer-events-none opacity-50'
                    )
                  "
                  @click="selectItem(row.item)"
                  @mousemove="!row.item.disabled && (activeIndex = row.index)"
                >
                  <slot
                    name="item"
                    :item="row.item"
                    :active="row.index === activeIndex"
                    :index="row.index"
                    :highlight="highlight"
                  >
                    <KunIcon
                      v-if="row.item.icon"
                      :name="row.item.icon"
                      class="text-default-500 shrink-0"
                    />
                    <span class="min-w-0 flex-1">
                      <span
                        v-if="row.item.section"
                        class="text-default-400 mb-0.5 block text-xs"
                        >{{ row.item.section }}</span
                      >
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <span
                        class="text-foreground block truncate text-sm font-medium"
                        v-html="highlight(row.item.label)"
                      />
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <span
                        v-if="row.item.description"
                        class="text-default-400 mt-0.5 block truncate text-xs"
                        v-html="highlight(row.item.description)"
                      />
                    </span>
                  </slot>
                </component>
              </div>
            </template>

            <template v-else>
              <slot v-if="query.trim()" name="no-result" :query="query">
                <p class="text-default-400 px-3 py-6 text-center text-sm">
                  {{ noResultText }}:<span class="text-default-600">{{ query }}</span>
                </p>
              </slot>
              <slot v-else name="empty">
                <p class="text-default-400 px-3 py-6 text-center text-sm">
                  {{ emptyText }}
                </p>
              </slot>
            </template>
          </div>

          <!-- footer hints -->
          <slot name="footer">
            <div
              class="border-kun text-default-400 flex items-center gap-4 border-t px-4 py-2 text-[11px]"
            >
              <span><kbd class="text-default-500">↑↓</kbd> 选择</span>
              <span><kbd class="text-default-500">↵</kbd> 打开</span>
              <span><kbd class="text-default-500">esc</kbd> 关闭</span>
              <span class="ml-auto">{{ flat.length }} 条结果</span>
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
