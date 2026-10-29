<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  computed,
  h,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  useId,
  useSlots,
  type ComponentPublicInstance,
  type FunctionalComponent,
  type VNode,
} from 'vue'
import { onClickOutside, unrefElement, useEventListener } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn } from '@kungal/ui-core'
import KunButton from './Button.vue'
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
    /**
     * Make the trigger slot's root element the menu button itself, instead of
     * wrapping it in a focusable `role="button"` element. Unset, this happens
     * automatically when the root is a `KunButton`, `<button>` or `<a>` — a
     * button inside a button is two tab stops and invalid HTML. Set `true` for
     * your own button component (it must render one focusable element and
     * forward attrs and `ref` to it); `false` keeps the wrapper.
     * @default undefined
     */
    asChild?: boolean
  }>(),
  {
    items: () => [],
    position: 'bottom-start',
    triggerClass: '',
    menuClass: '',
    minWidth: 192,
    disabled: false,
    asChild: undefined,
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

const slots = useSlots()
const setTrigger = (el: Element | ComponentPublicInstance | null) => {
  triggerRef.value = (unrefElement(el as HTMLElement | ComponentPublicInstance | null) as HTMLElement | null) ?? null
}

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) return flatten(node.children as VNode[])
    if (node.type === Comment) return []
    if (node.type === Text && !String(node.children).trim()) return []
    return [node]
  })

const isInteractive = (node: VNode) =>
  node.type === KunButton || node.type === 'button' || node.type === 'a'

let renderedAsChild = false

const TriggerRoot: FunctionalComponent = () => {
  const nodes = flatten(slots.trigger?.() ?? [])
  const child = nodes.length === 1 ? nodes[0] : undefined
  const asChild = props.asChild ?? (!!child && isInteractive(child))
  renderedAsChild = asChild && !!child
  const menuButton = {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen.value,
    'aria-controls': isOpen.value ? menuId : undefined,
    onClick: () => props.disabled || toggle(),
    onKeydown: onTriggerKeydown,
  }
  if (asChild && child) {
    return cloneVNode(
      child,
      {
        ...menuButton,
        ref: setTrigger,
        class: props.triggerClass || undefined,
        ...(props.disabled ? { disabled: true, 'aria-disabled': true } : {}),
      },
      true
    )
  }
  return h(
    'div',
    {
      ...menuButton,
      ref: setTrigger,
      role: 'button',
      tabindex: props.disabled ? -1 : 0,
      class: cn(
        'inline-flex cursor-pointer items-center',
        props.disabled && 'cursor-not-allowed opacity-50',
        props.triggerClass
      ),
      'aria-disabled': props.disabled || undefined,
    },
    nodes
  )
}

if (process.env.NODE_ENV !== 'production') {
  onMounted(() => {
    if (props.asChild !== undefined || renderedAsChild) return
    if (triggerRef.value?.querySelector('button, a[href], input, select, textarea, [tabindex]')) {
      console.warn(
        '[KunDropdown] the trigger slot holds a focusable element, which ends up nested inside the dropdown\'s own role="button" wrapper (two tab stops, invalid HTML). Make it the slot\'s single root and pass `as-child`, or slot non-interactive content.'
      )
    }
  })
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
    <TriggerRoot />

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
