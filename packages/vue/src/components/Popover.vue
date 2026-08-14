<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useEventListener, onClickOutside } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunPointerMenu } from '../composables/useKunPointerMenu'
import type { KunPopoverProps } from './types'

// Nuxt-decoupled Popover. A non-modal dialog anchored to its trigger: it moves
// focus into the panel on open and returns it to the trigger on close (so it
// isn't a "dialog" in name only). The trigger slot keeps its OWN semantics —
// the wrapper no longer forces role="button"/aria-label onto it, so passing a
// <KunButton> no longer nests a button inside a button.
defineOptions({ name: 'KunPopover' })

const props = withDefaults(defineProps<KunPopoverProps>(), {
  position: 'bottom-start',
  innerClass: '',
  autoPosition: true,
  rounded: undefined,
  showArrow: false,
  opaque: false,
  fullWidth: false,
  trigger: 'click',
  openDelay: 100,
  closeDelay: 120,
  group: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const popoverId = useKunUniqueId('kun-popover')

const { floatingStyles, transformOrigin, arrowRef, arrowStyles } = useKunFloating(
  triggerRef,
  popoverRef,
  {
    placement: () => props.position as Placement,
    open: isOpen,
    offset: 8,
    constrain: props.autoPosition,
    // maxSize sets overflow:auto on the panel, which would clip the arrow (it sits
    // half outside the panel edge) — so only cap size when there's no caret.
    maxSize: props.autoPosition && !props.showArrow,
    arrow: props.showArrow,
  }
)

// Remember what had focus so we can restore it when the popover closes.
let lastFocused: HTMLElement | null = null

const focusPanel = () => {
  const panel = popoverRef.value
  if (!panel) return
  const focusable = panel.querySelector<HTMLElement>(
    'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
  )
  ;(focusable ?? panel).focus({ preventScroll: true })
}

const open = () => {
  if (isOpen.value) return
  lastFocused = (document.activeElement as HTMLElement) ?? null
  isOpen.value = true
  nextTick(focusPanel)
}

const close = (returnFocus = true) => {
  if (!isOpen.value) return
  isOpen.value = false
  if (returnFocus) nextTick(() => lastFocused?.focus({ preventScroll: true }))
}

const toggle = () => (isOpen.value ? close() : open())

// Hover mode (navigation menus). Drives `isOpen` directly — so a hover-open never
// steals focus the way the click `open()` intentionally does — with a coordinate
// safe-triangle that survives the teleported panel. Click / keyboard / Esc /
// click-outside all keep working; touch falls back to click.
const { triggerHandlers, panelHandlers } = useKunPointerMenu(popoverRef, {
  open: isOpen,
  enabled: props.trigger === 'hover',
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  group: props.group,
})

// Focus-restore backstop: whenever we close, if focus is still inside the panel
// (e.g. a hover-group sibling stole the menu via a path that doesn't restore
// focus), pull it back to the trigger so it never lands on a detached node.
watch(isOpen, (open) => {
  if (open) return
  const panel = popoverRef.value
  if (!panel || !panel.contains(document.activeElement)) return
  triggerRef.value
    ?.querySelector<HTMLElement>(
      'button,a[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
    )
    ?.focus({ preventScroll: true })
})

onClickOutside(triggerRef, (event) => {
  if (popoverRef.value?.contains(event.target as Node)) return
  close(false)
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
})

defineExpose({
  open,
  close: () => close(),
  toggle,
})
</script>

<template>
  <div :class="['relative', fullWidth ? 'block w-full' : 'inline-block']">
    <!-- The wrapper opens the popover on click but does NOT claim button
         semantics — the slotted trigger keeps its own role/label. -->
    <div
      ref="triggerRef"
      :class="fullWidth ? 'block w-full' : 'inline-block'"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? popoverId : undefined"
      @click="toggle"
      v-on="triggerHandlers"
    >
      <slot name="trigger" />
    </div>

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
          v-if="isOpen"
          ref="popoverRef"
          data-kun-overlay
          :id="popoverId"
          role="dialog"
          tabindex="-1"
          :aria-label="ariaLabel || 'popover'"
          :class="
            cn(
              // opaque: solid content1 from its raw channels (no surface-opacity
              // alpha), so a globally-frosted site still gets a readable menu.
              opaque ? 'bg-[oklch(var(--content1))]' : 'bg-content1',
              'z-kun-popover shadow-kun-md focus:outline-none',
              roundedClass,
              innerClass
            )
          "
          :style="[floatingStyles, { transformOrigin }]"
          @keydown.escape="close()"
          v-on="panelHandlers"
        >
          <slot />
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
