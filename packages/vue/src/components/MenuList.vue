<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, toRef, watch, type ComponentPublicInstance } from 'vue'
import {
  cn,
  kunVariantClasses,
  normalizeKunMenuSeparators,
  type KunUIColor,
} from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import KunKbd from './Kbd.vue'
import KunMenuSubTrigger from './MenuSubTrigger.vue'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunUIConfig } from '../config/useKunUIConfig'
import type { KunContextMenuItem, KunMenuEntry } from './types'

// The role="menu" list KunDropdown and KunContextMenu share: items,
// separators, one level of submenu, and the WAI-ARIA menu keyboard model. The
// host opens, positions and closes the root; this list owns its submenu.
defineOptions({ name: 'KunMenuList' })

const props = withDefaults(
  defineProps<{
    entries: KunMenuEntry[]
    /** Shared by the root list and its submenu, so the host's outside-click
     *  test can tell a click in the teleported submenu from a click away. */
    treeId: string
    level?: 0 | 1
    /** The root menu's trigger: an enclosing modal's focus trap owns the
     *  submenu through it (useKunFloatingLayer). */
    trigger?: HTMLElement | null
    minWidth?: number
  }>(),
  { level: 0, trigger: null, minWidth: 192 }
)

const emit = defineEmits<{
  select: [item: KunContextMenuItem]
  /** Close the whole menu; `returnFocus` after a key press. */
  close: [returnFocus: boolean]
  /** A submenu asks its parent to close it (← or Escape). */
  back: []
}>()

const config = useKunUIConfig()
const uid = useKunUniqueId('kun-menu-')
const subId = computed(() => `${uid.value}-sub`)

const rows = computed(() => normalizeKunMenuSeparators(props.entries))
const isItem = (row: KunMenuEntry | undefined): row is KunContextMenuItem =>
  !!row && row.type !== 'separator'
// `children`, even an empty array, makes a submenu trigger: an app that
// filters a "Move to" list down to nothing must not get that item's `select`.
const hasSubmenu = (row: KunMenuEntry | undefined): boolean =>
  props.level === 0 && isItem(row) && Array.isArray(row.children)
const isDisabled = (row: KunContextMenuItem) =>
  !!row.disabled ||
  (hasSubmenu(row) && !row.children!.some((child) => child.type !== 'separator'))

const enabledIndices = () =>
  rows.value.reduce<number[]>((acc, row, i) => {
    if (isItem(row) && !isDisabled(row)) acc.push(i)
    return acc
  }, [])

const rootRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

const itemEl = (i: number) =>
  rootRef.value?.querySelector<HTMLElement>(`[data-kun-menu-index="${i}"]`) ?? null

const focusItem = (i: number) => {
  activeIndex.value = i
  // preventScroll: a teleported menu is focused before floating-ui has moved
  // it off top:0/left:0, and focusing it there scrolls the document to the top.
  itemEl(i)?.focus({ preventScroll: true })
}

const focusMenu = () => {
  activeIndex.value = -1
  rootRef.value?.focus({ preventScroll: true })
}

const focusFirst = () => {
  const first = enabledIndices()[0]
  if (first === undefined) focusMenu()
  else focusItem(first)
}

const focusLast = () => {
  const enabled = enabledIndices()
  if (!enabled.length) focusMenu()
  else focusItem(enabled[enabled.length - 1]!)
}

const move = (delta: number) => {
  const enabled = enabledIndices()
  if (!enabled.length) return
  const pos = enabled.indexOf(activeIndex.value)
  if (pos === -1) {
    focusItem(delta > 0 ? enabled[0]! : enabled[enabled.length - 1]!)
    return
  }
  focusItem(enabled[(pos + delta + enabled.length) % enabled.length]!)
}

let typeBuffer = ''
let typeTimer: ReturnType<typeof setTimeout> | null = null
const typeahead = (char: string) => {
  typeBuffer += char.toLowerCase()
  if (typeTimer) clearTimeout(typeTimer)
  typeTimer = setTimeout(() => (typeBuffer = ''), 600)
  const i = rows.value.findIndex(
    (row) => isItem(row) && !isDisabled(row) && row.label.toLowerCase().startsWith(typeBuffer)
  )
  if (i >= 0) focusItem(i)
}

const openSub = ref(-1)
const subTrigger = shallowRef<HTMLElement | null>(null)
const subPanel = shallowRef<HTMLElement | null>(null)
const subList = shallowRef<{ focusFirst: () => void } | null>(null)
const subOpen = computed(() => openSub.value >= 0)
const subEntries = computed(() => {
  const row = rows.value[openSub.value]
  return isItem(row) ? (row.children ?? []) : []
})

const setSubList = (c: Element | ComponentPublicInstance | null) => {
  subList.value = c as unknown as { focusFirst: () => void } | null
  subPanel.value = ((c as ComponentPublicInstance | null)?.$el as HTMLElement | null) ?? null
}

const { floatingStyles: subStyles, transformOrigin: subOrigin } = useKunFloating(
  subTrigger,
  subPanel,
  {
    placement: 'right-start',
    open: subOpen,
    // Line the submenu's first item up with its trigger: the panel's p-1.
    offset: { mainAxis: 4, crossAxis: -4 },
    maxSize: true,
  }
)
useKunFloatingLayer(subPanel, { trigger: toRef(props, 'trigger') })

const openSubmenu = (i: number, focus: boolean) => {
  subTrigger.value = itemEl(i)
  openSub.value = i
  activeIndex.value = i
  if (focus) nextTick(() => subList.value?.focusFirst())
}

const closeSubmenu = (refocus: boolean) => {
  const i = openSub.value
  if (i < 0) return
  const focusInside = !!subPanel.value?.contains(document.activeElement)
  openSub.value = -1
  if (refocus || focusInside) focusItem(i)
}

const setSubOpen = (i: number, open: boolean) => {
  if (open) openSubmenu(i, false)
  else if (openSub.value === i) closeSubmenu(false)
}

// Keyed on the row keys, not the array: an inline `:items="[...]"` is a new
// array on every parent render, and that must not close an open submenu.
watch(
  () => rows.value.map((row) => row.key ?? '').join('\u0000'),
  () => closeSubmenu(false)
)

const onItemClick = (e: MouseEvent, row: KunContextMenuItem, i: number) => {
  if (isDisabled(row)) {
    e.preventDefault()
    return
  }
  if (hasSubmenu(row)) {
    if (openSub.value !== i) openSubmenu(i, false)
    return
  }
  emit('select', row)
}

const onKeydown = (e: KeyboardEvent) => {
  const row = rows.value[activeIndex.value]
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
      focusFirst()
      break
    case 'End':
      e.preventDefault()
      focusLast()
      break
    case 'ArrowRight':
      if (isItem(row) && hasSubmenu(row) && !isDisabled(row)) {
        e.preventDefault()
        openSubmenu(activeIndex.value, true)
      }
      break
    case 'ArrowLeft':
      if (props.level === 1) {
        e.preventDefault()
        e.stopPropagation()
        emit('back')
      }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!isItem(row) || isDisabled(row)) break
      if (hasSubmenu(row)) openSubmenu(activeIndex.value, true)
      // A click, not an emit: a link item has to navigate, and preventDefault
      // above has already stopped the browser from doing it.
      else itemEl(activeIndex.value)?.click()
      break
    case 'Escape':
      e.preventDefault()
      // One level at a time (WAI-ARIA APG menu pattern). Stop it here so the
      // host's window listener, or a modal's, does not close everything.
      if (props.level === 1) {
        e.stopPropagation()
        emit('back')
      } else emit('close', true)
      break
    case 'Tab':
      e.preventDefault()
      emit('close', true)
      break
    default:
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        typeahead(e.key)
      }
  }
}

const itemBindings = (row: KunContextMenuItem) => {
  if (!row.href) return { type: 'button', disabled: row.disabled }
  return typeof config.linkComponent === 'string' ? { href: row.href } : { to: row.href }
}

const focusTint: Record<KunUIColor, string> = {
  default: 'focus:bg-default/20 aria-expanded:bg-default/20',
  primary: 'focus:bg-primary/20 aria-expanded:bg-primary/20',
  secondary: 'focus:bg-secondary/20 aria-expanded:bg-secondary/20',
  success: 'focus:bg-success/20 aria-expanded:bg-success/20',
  warning: 'focus:bg-warning/20 aria-expanded:bg-warning/20',
  danger: 'focus:bg-danger/20 aria-expanded:bg-danger/20',
  info: 'focus:bg-info/20 aria-expanded:bg-info/20',
}

const itemClass = (row: KunContextMenuItem) =>
  cn(
    // `text-left`: a native <button> defaults to text-align:center, which the
    // flex-1 label span inherits — so short labels would sit centered. Reset it.
    'relative flex w-full cursor-pointer items-center justify-start gap-2 overflow-hidden rounded-kun-md px-3 py-1.5 text-left text-sm font-medium outline-none transition-colors',
    kunVariantClasses('light', row.color || 'default'),
    focusTint[row.color || 'default'],
    isDisabled(row) && 'pointer-events-none cursor-not-allowed opacity-50'
  )

defineExpose({ focusFirst, focusLast, focusMenu })
</script>

<template>
  <div
    ref="rootRef"
    role="menu"
    aria-orientation="vertical"
    tabindex="-1"
    :data-kun-menu-tree="treeId"
    @keydown="onKeydown"
  >
    <template v-for="(row, i) in rows" :key="row.key ?? `separator-${i}`">
      <div
        v-if="row.type === 'separator'"
        role="separator"
        aria-orientation="horizontal"
        class="border-kun -mx-1 my-1 border-t"
      />
      <KunMenuSubTrigger
        v-else-if="hasSubmenu(row)"
        v-slot="{ handlers }"
        :open="openSub === i"
        :panel="subPanel"
        @update:open="(value: boolean) => setSubOpen(i, value)"
      >
        <button
          :id="`${uid}-${i}`"
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          :aria-expanded="openSub === i"
          :aria-controls="openSub === i ? subId : undefined"
          :aria-disabled="isDisabled(row) || undefined"
          :disabled="isDisabled(row)"
          :data-kun-menu-index="i"
          :tabindex="i === activeIndex ? 0 : -1"
          :class="itemClass(row)"
          v-on="isDisabled(row) ? {} : handlers"
          @click="onItemClick($event, row, i)"
          @mouseenter="!isDisabled(row) && focusItem(i)"
        >
          <KunIcon v-if="row.icon" :name="row.icon" class="shrink-0 text-base" />
          <span class="min-w-0 flex-1 truncate">{{ row.label }}</span>
          <KunIcon name="lucide:chevron-right" class="-mr-1 shrink-0 text-base opacity-60" />
        </button>
      </KunMenuSubTrigger>
      <component
        :is="row.href ? config.linkComponent : 'button'"
        v-else
        v-bind="itemBindings(row)"
        role="menuitem"
        :aria-disabled="isDisabled(row) || undefined"
        :aria-labelledby="row.shortcut ? `${uid}-${i}` : undefined"
        :aria-describedby="row.shortcut ? `${uid}-${i}-kbd` : undefined"
        :data-kun-menu-index="i"
        :tabindex="i === activeIndex ? 0 : -1"
        :class="itemClass(row)"
        @click="onItemClick($event, row, i)"
        @mouseenter="!isDisabled(row) && focusItem(i)"
      >
        <KunIcon v-if="row.icon" :name="row.icon" class="shrink-0 text-base" />
        <span :id="`${uid}-${i}`" class="min-w-0 flex-1 truncate">{{ row.label }}</span>
        <KunKbd
          v-if="row.shortcut"
          :id="`${uid}-${i}-kbd`"
          :keys="row.shortcut"
          variant="plain"
          class="ml-4 shrink-0"
        />
      </component>
    </template>

    <Teleport v-if="level === 0" to="body">
      <Transition
        enter-active-class="transition duration-kun-base ease-kun-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-kun-exit ease-kun-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <KunMenuList
          v-if="openSub >= 0"
          :id="subId"
          :ref="setSubList"
          :entries="subEntries"
          :tree-id="treeId"
          :level="1"
          :trigger="trigger"
          :min-width="minWidth"
          :aria-labelledby="`${uid}-${openSub}`"
          data-kun-overlay
          class="bg-content1 z-kun-popover rounded-kun-lg p-1 text-sm shadow-kun-md outline-none"
          :style="[subStyles, { minWidth: `${minWidth}px`, transformOrigin: subOrigin }]"
          @select="(item: KunContextMenuItem) => emit('select', item)"
          @close="(returnFocus: boolean) => emit('close', returnFocus)"
          @back="closeSubmenu(true)"
        />
      </Transition>
    </Teleport>
  </div>
</template>
