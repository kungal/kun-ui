<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import KunMenuList from './MenuList.vue'
import type { KunContextMenuItem, KunContextMenuProps } from './types'

type KunMenuListApi = { focusFirst: () => void; focusLast: () => void; focusMenu: () => void }

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
  /** The item the user activated. A disabled item never emits. */
  (event: 'select', item: KunContextMenuItem): void
  /** The menu closed, for any reason. */
  (event: 'close'): void
}>()

const menuRef = shallowRef<HTMLElement | null>(null)
const list = shallowRef<KunMenuListApi | null>(null)
const setList = (c: Element | ComponentPublicInstance | null) => {
  list.value = c as unknown as KunMenuListApi | null
  menuRef.value = ((c as ComponentPublicInstance | null)?.$el as HTMLElement | null) ?? null
}
useKunFloatingLayer(menuRef)
const treeId = `kun-context-menu-${useId()}`
const menuPosition = ref({
  x: props.position?.x ?? 0,
  y: props.position?.y ?? 0,
})
let lastFocused: HTMLElement | null = null

const hasItems = computed(() => props.items.some((entry) => entry.type !== 'separator'))

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(max, min))

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
    if (!props.visible) return
    updateMenuPosition().then(() => {
      // The immediate watcher runs during setup(); guard the browser-only
      // focus work so SSR with :visible="true" doesn't touch `document`.
      if (typeof document === 'undefined') return
      lastFocused = (document.activeElement as HTMLElement) ?? null
      list.value?.focusFirst()
    })
  },
  { immediate: true }
)

// The submenu is teleported on its own, so "inside the menu" is the tree, not
// the root element's subtree.
const inMenu = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest(`[data-kun-menu-tree="${treeId}"]`)

const handlePointerDown = (event: Event) => {
  if (props.visible && !inMenu(event.target)) closeMenu()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') closeMenu(true)
}

const handleScroll = (event: Event) => {
  if (props.visible && !inMenu(event.target)) closeMenu()
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
  emit('select', item)
  closeMenu(true)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-kun-base ease-kun-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-kun-exit ease-kun-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <KunMenuList
        v-if="visible && hasItems"
        :ref="setList"
        :entries="items"
        :tree-id="treeId"
        :min-width="width"
        data-kun-overlay
        class="bg-content1 fixed z-kun-popover rounded-kun-lg p-1 text-sm shadow-kun-md outline-none"
        :style="menuStyle"
        @click.stop
        @select="handleSelect"
        @close="closeMenu"
      />
    </Transition>
  </Teleport>
</template>
