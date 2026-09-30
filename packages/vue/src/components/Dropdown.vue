<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useId, type ComponentPublicInstance } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn } from '@kungal/ui-core'
import KunMenuList from './MenuList.vue'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import type { KunDropdownItem, KunMenuEntry } from './types'

type KunMenuListApi = { focusFirst: () => void; focusLast: () => void; focusMenu: () => void }

// Click-triggered action menu (WAI-ARIA menu-button pattern). Deliberately
// NOT built on KunPopover — a menu needs role=menu/menuitem, roving
// tabindex and arrow-key nav that Popover (role=dialog) can't surface — so
// it wraps @floating-ui/vue directly while owning its interaction + a11y
// layer. `useId` is Vue 3.5 native (was a Nuxt auto-import).
defineOptions({ name: 'KunDropdown' })

const props = withDefaults(
  defineProps<{
    /** Items and separators; an item with `children` opens a submenu. */
    items?: KunMenuEntry[]
    position?: Placement
    triggerClass?: string
    menuClass?: string
    minWidth?: number
    disabled?: boolean
  }>(),
  {
    items: () => [],
    position: 'bottom-start',
    triggerClass: '',
    menuClass: '',
    minWidth: 192,
    disabled: false,
  }
)

const emit = defineEmits<{
  /** The item the user activated. A disabled item never emits. */
  (e: 'select', item: KunDropdownItem): void
  /** The menu opened. */
  (e: 'open'): void
  /** The menu closed, for any reason. */
  (e: 'close'): void
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = shallowRef<HTMLElement | null>(null)
const list = shallowRef<KunMenuListApi | null>(null)
const setList = (c: Element | ComponentPublicInstance | null) => {
  list.value = c as unknown as KunMenuListApi | null
  menuRef.value = ((c as ComponentPublicInstance | null)?.$el as HTMLElement | null) ?? null
}
useKunFloatingLayer(menuRef, { trigger: triggerRef })
const menuId = `kun-dropdown-${useId()}`

const hasItems = computed(() => props.items.some((entry) => entry.type !== 'separator'))

// Grow the menu out of its trigger corner (post-flip aware).
const { floatingStyles, transformOrigin } = useKunFloating(triggerRef, menuRef, {
  placement: () => props.position as Placement,
  open: isOpen,
  offset: 6,
  maxSize: true,
})

const open = (focus: 'first' | 'last' | 'none' = 'none') => {
  if (props.disabled || !hasItems.value) return
  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }
  nextTick(() => {
    if (focus === 'first') list.value?.focusFirst()
    else if (focus === 'last') list.value?.focusLast()
    else list.value?.focusMenu()
  })
}

const close = (returnFocus = false) => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
  if (returnFocus) nextTick(() => triggerRef.value?.focus({ preventScroll: true }))
}

const toggle = () => (isOpen.value ? close() : open('none'))

const onSelect = (item: KunDropdownItem) => {
  emit('select', item)
  close(true)
}

const onTriggerKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowDown':
    case 'Enter':
    case ' ':
      e.preventDefault()
      open('first')
      break
    case 'ArrowUp':
      e.preventDefault()
      open('last')
      break
  }
}

const inMenu = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest(`[data-kun-menu-tree="${menuId}"]`)

onClickOutside(triggerRef, (e) => {
  if (inMenu(e.target)) return
  close()
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close(true)
})

defineExpose({
  open: () => open('none'),
  close: () => close(),
  toggle,
})
</script>

<template>
  <div class="relative inline-flex">
    <div
      ref="triggerRef"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :class="
        cn(
          'inline-flex cursor-pointer items-center',
          disabled && 'cursor-not-allowed opacity-50',
          triggerClass
        )
      "
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || undefined"
      :aria-controls="isOpen ? menuId : undefined"
      @click="disabled || toggle()"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" />
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
        <KunMenuList
          v-if="isOpen && hasItems"
          :id="menuId"
          :ref="setList"
          :entries="items"
          :tree-id="menuId"
          :trigger="triggerRef"
          :min-width="minWidth"
          data-kun-overlay
          :class="
            cn(
              'bg-content1 z-kun-popover rounded-kun-lg p-1 text-sm shadow-kun-md outline-none',
              menuClass
            )
          "
          :style="[floatingStyles, { minWidth: `${minWidth}px`, transformOrigin }]"
          @select="onSelect"
          @close="close"
        />
      </Transition>
    </Teleport>
  </div>
</template>
