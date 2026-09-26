<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunPointerMenu } from '../composables/useKunPointerMenu'
import { useKunFloatingLayer } from '../composables/useKunFloatingLayer'
import type { KunHoverCardProps } from './types'

// A preview for sighted pointer and keyboard users that leaves the trigger's
// own semantics alone: the slotted link stays the one accessible interface.
// The card has no role and takes no focus, a click is never intercepted, and
// touch never opens it. Radix HoverCard, Reka HoverCard, zag hover-card and
// Base UI PreviewCard draw the same line.
defineOptions({ name: 'KunHoverCard' })

const props = withDefaults(defineProps<KunHoverCardProps>(), {
  position: 'bottom-start',
  innerClass: '',
  autoPosition: true,
  rounded: undefined,
  showArrow: false,
  opaque: false,
  openDelay: 600,
  closeDelay: 300,
  group: undefined,
  disabled: false,
})

defineSlots<{
  /** The element the card previews, usually a link. The card anchors to its
   *  first element. */
  trigger(): unknown
  /** The card. Mounted only while open, so a fetch in its setup runs on open. */
  default(props: { close: () => void }): unknown
}>()

/** Whether the card is open. Bind `v-model:open` to prefetch or track it, or
 *  to close it from outside. */
const isOpen = defineModel<boolean>('open', { default: false })

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
useKunFloatingLayer(panelRef, { trigger: triggerRef })

// The wrapper is `display: contents` and has no box to measure.
const anchor = computed(() =>
  isOpen.value ? (triggerRef.value?.firstElementChild ?? null) : null
)

const { floatingStyles, transformOrigin, arrowRef, arrowStyles } = useKunFloating(
  anchor,
  panelRef,
  {
    placement: () => props.position as Placement,
    open: isOpen,
    offset: 8,
    constrain: props.autoPosition,
    maxSize: props.autoPosition && !props.showArrow,
    arrow: props.showArrow,
  }
)

const { triggerHandlers, panelHandlers, requestOpen, close } =
  useKunPointerMenu(panelRef, {
    open: isOpen,
    openDelay: props.openDelay,
    closeDelay: props.closeDelay,
    group: props.group,
  })

// A mouse click also focuses the link; only keyboard focus opens the card.
const onFocusin = (e: FocusEvent) => {
  if ((e.target as Element).matches(':focus-visible')) requestOpen()
}

// The panel's tabindex="-1" makes a click on the card's plain text move focus
// to the panel, so `relatedTarget` is inside it. Without it focus goes to
// <body> and a keyboard-opened card closed as soon as its text was clicked.
const onFocusout = (e: FocusEvent) => {
  const next = e.relatedTarget as Node | null
  if (next && (triggerRef.value?.contains(next) || panelRef.value?.contains(next)))
    return
  close()
}

const triggerListeners = computed(() =>
  props.disabled
    ? {}
    : { ...triggerHandlers, focusin: onFocusin, focusout: onFocusout, click: close }
)

watch(
  () => props.disabled,
  (disabled) => disabled && close()
)

useEventListener(
  () => (isOpen.value ? document : null),
  'pointerdown',
  (e: PointerEvent) => {
    const target = e.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target))
      return
    close()
  },
  { capture: true, passive: true }
)

useEventListener(
  () => (isOpen.value ? window : null),
  'keydown',
  (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
)

defineExpose({
  open: () => {
    if (!props.disabled) isOpen.value = true
  },
  close,
})
</script>

<template>
  <div ref="triggerRef" :style="{ display: 'contents' }" v-on="triggerListeners">
    <slot name="trigger" />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-kun-base ease-kun-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-kun-exit ease-kun-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen && !disabled"
          ref="panelRef"
          data-kun-overlay
          tabindex="-1"
          :class="
            cn(
              opaque ? 'bg-[oklch(var(--content1))]' : 'bg-content1',
              'z-kun-popover shadow-kun-md focus:outline-none',
              roundedClass,
              innerClass
            )
          "
          :style="[floatingStyles, { transformOrigin }]"
          v-on="panelHandlers"
        >
          <slot :close="close" />
          <div
            v-if="showArrow"
            ref="arrowRef"
            class="bg-content1 size-2 rotate-45"
            :style="arrowStyles"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
