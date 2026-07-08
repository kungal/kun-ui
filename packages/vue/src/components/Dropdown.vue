<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn, kunVariantClasses, type KunUIColor } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUIConfig } from '../config/useKunUIConfig'
import type { KunDropdownItem } from './types'

// Click-triggered action menu (WAI-ARIA menu-button pattern). Deliberately
// NOT built on KunPopover — a menu needs role=menu/menuitem, roving
// tabindex and arrow-key nav that Popover (role=dialog) can't surface — so
// it wraps @floating-ui/vue directly while owning its interaction + a11y
// layer. `useId` is Vue 3.5 native (was a Nuxt auto-import).
defineOptions({ name: 'KunDropdown' })

const props = withDefaults(
  defineProps<{
    items?: KunDropdownItem[]
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
  (e: 'select', item: KunDropdownItem): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const isOpen = ref(false)
const activeIndex = ref(-1)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuId = `kun-dropdown-${useId()}`

// Grow the menu out of its trigger corner (post-flip aware).
const { floatingStyles, transformOrigin } = useKunFloating(triggerRef, menuRef, {
  placement: () => props.position as Placement,
  open: isOpen,
  offset: 6,
  maxSize: true,
})

const enabledIndices = () =>
  props.items.reduce<number[]>((acc, item, i) => {
    if (!item.disabled) acc.push(i)
    return acc
  }, [])

const itemButtons = () =>
  Array.from(
    menuRef.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []
  )

const focusItem = (index: number) => {
  activeIndex.value = index
  // preventScroll: the teleported menu is focused inside the open() nextTick,
  // before floating-ui's async computePosition has moved it off its initial
  // top:0/left:0 — focusing it there would scroll the document to the top
  // (very visible on mobile: tapping a trigger low on the page yanks it up).
  itemButtons()[index]?.focus({ preventScroll: true })
}

const open = (focus: 'first' | 'last' | 'none' = 'none') => {
  if (props.disabled || props.items.length === 0) return
  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }
  nextTick(() => {
    const enabled = enabledIndices()
    if (focus === 'first' && enabled.length) {
      focusItem(enabled[0]!)
    } else if (focus === 'last' && enabled.length) {
      focusItem(enabled[enabled.length - 1]!)
    } else {
      activeIndex.value = -1
      menuRef.value?.focus({ preventScroll: true })
    }
  })
}

const close = (returnFocus = false) => {
  if (!isOpen.value) return
  isOpen.value = false
  activeIndex.value = -1
  emit('close')
  if (returnFocus) nextTick(() => triggerRef.value?.focus({ preventScroll: true }))
}

const toggle = () => (isOpen.value ? close() : open('none'))

const move = (delta: number) => {
  const enabled = enabledIndices()
  if (!enabled.length) return
  const pos = enabled.indexOf(activeIndex.value)
  const nextPos = (pos + delta + enabled.length) % enabled.length
  focusItem(enabled[nextPos === -1 ? enabled.length - 1 : nextPos]!)
}

// Type-ahead: typing letters jumps to the next item whose label starts with
// the typed run (cleared after a short pause). WAI-ARIA menu recommendation.
let typeBuffer = ''
let typeTimer: ReturnType<typeof setTimeout> | null = null
const typeahead = (char: string) => {
  typeBuffer += char.toLowerCase()
  if (typeTimer) clearTimeout(typeTimer)
  typeTimer = setTimeout(() => (typeBuffer = ''), 600)
  const i = props.items.findIndex(
    (it) => !it.disabled && it.label.toLowerCase().startsWith(typeBuffer)
  )
  if (i >= 0) focusItem(i)
}

const selectItem = (item: KunDropdownItem) => {
  if (item.disabled) return
  emit('select', item)
  close(true)
}

// Items with `href` render a real <a role="menuitem"> (crawlable). The link
// navigates natively; selectItem still emits/closes. Disabled items can't be
// <a disabled>, so block their navigation in JS.
const config = useKunUIConfig()
const itemBindings = (item: KunDropdownItem) => {
  if (!item.href) return { type: 'button', disabled: item.disabled }
  return typeof config.linkComponent === 'string'
    ? { href: item.href }
    : { to: item.href }
}
const onItemClick = (e: MouseEvent, item: KunDropdownItem) => {
  if (item.disabled) {
    e.preventDefault()
    return
  }
  selectItem(item)
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
      if (activeIndex.value >= 0) selectItem(props.items[activeIndex.value]!)
      break
    case 'Escape':
      e.preventDefault()
      close(true)
      break
    case 'Tab':
      e.preventDefault()
      close(true)
      break
    default:
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        typeahead(e.key)
      }
  }
}

onClickOutside(triggerRef, (e) => {
  if (menuRef.value?.contains(e.target as Node)) return
  close()
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close(true)
})

// Keyboard focus highlight (the light variant only defines hover:).
const focusTint: Record<KunUIColor, string> = {
  default: 'focus:bg-default/20',
  primary: 'focus:bg-primary/20',
  secondary: 'focus:bg-secondary/20',
  success: 'focus:bg-success/20',
  warning: 'focus:bg-warning/20',
  danger: 'focus:bg-danger/20',
  info: 'focus:bg-info/20',
}

const itemClass = (item: KunDropdownItem) =>
  cn(
    // `text-left`: a native <button> defaults to text-align:center, which the
    // flex-1 label span inherits — so short labels would sit centered. Reset it.
    'relative flex w-full cursor-pointer items-center justify-start gap-2 overflow-hidden rounded-kun-md px-3 py-1.5 text-left text-sm font-medium outline-none transition-colors',
    kunVariantClasses('light', item.color || 'default'),
    focusTint[item.color || 'default'],
    item.disabled && 'pointer-events-none cursor-not-allowed opacity-50'
  )

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
        <div
          v-if="isOpen && items.length"
          ref="menuRef"
          :id="menuId"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
          :class="
            cn(
              'bg-content1 z-kun-popover rounded-kun-lg p-1 text-sm shadow-kun-md outline-none',
              menuClass
            )
          "
          :style="[floatingStyles, { minWidth: `${minWidth}px`, transformOrigin }]"
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
            <KunIcon v-if="item.icon" :name="item.icon" class="shrink-0 text-base" />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
          </component>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
