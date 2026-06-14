<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { cn, kunVariantClasses, type KunUIColor } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunUIConfig } from '../config/useKunUIConfig'
import type { KunContextMenuItem, KunContextMenuProps } from './types'

// Right-click style menu positioned at an x/y point, clamped into the viewport.
// Controlled via `visible` + `position`. Implements the WAI-ARIA menu pattern
// (role=menu/menuitem, roving tabindex, arrow / Home / End / Enter / Escape) and
// focuses the first item on open + restores focus on close — the same a11y
// layer as KunDropdown.
defineOptions({ name: 'KunContextMenu' })

const props = withDefaults(defineProps<KunContextMenuProps>(), {
  items: () => [],
  position: () => ({ x: 0, y: 0 }),
  width: 192,
  padding: 12,
})

const emit = defineEmits<{
  (event: 'select', item: KunContextMenuItem): void
  (event: 'close'): void
}>()

const config = useKunUIConfig()

const menuRef = ref<HTMLDivElement | null>(null)
const activeIndex = ref(-1)
const menuPosition = ref({
  x: props.position?.x ?? 0,
  y: props.position?.y ?? 0,
})
let lastFocused: HTMLElement | null = null

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(max, min))

const enabledIndices = () =>
  props.items.reduce<number[]>((acc, item, i) => {
    if (!item.disabled) acc.push(i)
    return acc
  }, [])

const itemEls = () =>
  Array.from(
    menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
  )

const focusItem = (index: number) => {
  activeIndex.value = index
  itemEls()[index]?.focus({ preventScroll: true })
}

const move = (delta: number) => {
  const enabled = enabledIndices()
  if (!enabled.length) return
  const pos = enabled.indexOf(activeIndex.value)
  const nextPos = (pos + delta + enabled.length) % enabled.length
  focusItem(enabled[nextPos === -1 ? enabled.length - 1 : nextPos]!)
}

const updateMenuPosition = async () => {
  if (!props.visible || typeof window === 'undefined') return
  await nextTick()
  const menuWidth = menuRef.value?.offsetWidth || props.width
  const menuHeight = menuRef.value?.offsetHeight || 60
  const padding = props.padding
  const rawX = props.position?.x ?? 0
  const rawY = props.position?.y ?? 0
  const maxX = window.innerWidth - menuWidth - padding
  const maxY = window.innerHeight - menuHeight - padding
  menuPosition.value = {
    x: clamp(rawX, padding, maxX),
    y: clamp(rawY, padding, maxY),
  }
}

const closeMenu = (returnFocus = false) => {
  emit('close')
  if (returnFocus) nextTick(() => lastFocused?.focus({ preventScroll: true }))
}

watch(
  () => [props.visible, props.position?.x, props.position?.y],
  () => {
    if (props.visible) {
      updateMenuPosition().then(() => {
        // The immediate watcher runs during setup(); guard the browser-only
        // focus work so SSR with :visible="true" doesn't touch `document`.
        if (typeof document === 'undefined') return
        lastFocused = (document.activeElement as HTMLElement) ?? null
        const first = enabledIndices()[0]
        if (first !== undefined) focusItem(first)
        else menuRef.value?.focus({ preventScroll: true })
      })
    } else {
      activeIndex.value = -1
    }
  },
  { immediate: true }
)

const handlePointerDown = (event: Event) => {
  if (!props.visible) return
  const target = event.target as Node
  if (menuRef.value && !menuRef.value.contains(target)) closeMenu()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') closeMenu(true)
}

const handleScroll = () => {
  if (props.visible) closeMenu()
}

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDown, true)
  window.addEventListener('contextmenu', handlePointerDown, true)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handlePointerDown, true)
  window.removeEventListener('contextmenu', handlePointerDown, true)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

const menuStyle = computed(() => ({
  top: `${menuPosition.value.y}px`,
  left: `${menuPosition.value.x}px`,
  minWidth: `${props.width}px`,
  transformOrigin: 'top left',
}))

const handleSelect = (item: KunContextMenuItem) => {
  if (item.disabled) return
  emit('select', item)
  closeMenu(true)
}

// Items with `href` render a real <a role="menuitem"> (crawlable); the link
// navigates natively. Disabled links can't use [disabled], so block in JS.
const itemBindings = (item: KunContextMenuItem) => {
  if (!item.href) return { type: 'button', disabled: item.disabled }
  return typeof config.linkComponent === 'string'
    ? { href: item.href }
    : { to: item.href }
}

const onItemClick = (e: MouseEvent, item: KunContextMenuItem) => {
  if (item.disabled) {
    e.preventDefault()
    return
  }
  handleSelect(item)
}

const onMenuKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(-1)
      break
    case 'Home': {
      e.preventDefault()
      const first = enabledIndices()[0]
      if (first !== undefined) focusItem(first)
      break
    }
    case 'End': {
      e.preventDefault()
      const enabled = enabledIndices()
      if (enabled.length) focusItem(enabled[enabled.length - 1]!)
      break
    }
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (activeIndex.value >= 0) handleSelect(props.items[activeIndex.value]!)
      break
    case 'Escape':
      e.preventDefault()
      closeMenu(true)
      break
    case 'Tab':
      e.preventDefault()
      closeMenu(true)
      break
  }
}

const focusTint: Record<KunUIColor, string> = {
  default: 'focus:bg-default/20',
  primary: 'focus:bg-primary/20',
  secondary: 'focus:bg-secondary/20',
  success: 'focus:bg-success/20',
  warning: 'focus:bg-warning/20',
  danger: 'focus:bg-danger/20',
  info: 'focus:bg-info/20',
}

const itemClass = (item: KunContextMenuItem) =>
  cn(
    'relative flex w-full cursor-pointer items-center justify-start gap-2 overflow-hidden rounded-kun-md px-3 py-1.5 text-sm font-medium outline-none transition-colors',
    kunVariantClasses('light', item.color || 'default'),
    focusTint[item.color || 'default'],
    item.disabled && 'pointer-events-none cursor-not-allowed opacity-50'
  )
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-kun-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-kun-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible && items.length"
        ref="menuRef"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        class="border-kun bg-background/95 fixed z-kun-popover rounded-kun-lg border p-1 text-sm shadow-2xl outline-none backdrop-blur"
        :style="menuStyle"
        @click.stop
        @keydown="onMenuKeydown"
      >
        <component
          :is="item.href ? config.linkComponent : 'button'"
          v-for="(item, i) in items"
          :key="item.key"
          v-bind="itemBindings(item)"
          role="menuitem"
          :tabindex="i === activeIndex ? 0 : -1"
          :aria-disabled="item.disabled || undefined"
          :class="itemClass(item)"
          @click="onItemClick($event, item)"
          @mouseenter="!item.disabled && focusItem(i)"
        >
          <KunIcon v-if="item.icon" :name="item.icon" class="text-base" />
          <span>{{ item.label }}</span>
        </component>
      </div>
    </Transition>
  </Teleport>
</template>
