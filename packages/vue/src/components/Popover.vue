<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useEventListener, onClickOutside } from '@vueuse/core'
import { type Placement } from '@floating-ui/vue'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useKunFloating } from '../composables/useKunFloating'
import { useKunUniqueId } from '../composables/useKunUniqueId'
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
  autoPosition: false,
  rounded: undefined,
  showArrow: false,
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
  <div class="relative inline-block">
    <!-- The wrapper opens the popover on click but does NOT claim button
         semantics — the slotted trigger keeps its own role/label. -->
    <div
      ref="triggerRef"
      class="inline-block"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? popoverId : undefined"
      @click="toggle"
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
          :id="popoverId"
          role="dialog"
          tabindex="-1"
          :aria-label="ariaLabel || 'popover'"
          :class="
            cn(
              'bg-content1 z-kun-popover shadow-kun-md focus:outline-none',
              roundedClass,
              innerClass
            )
          "
          :style="[floatingStyles, { transformOrigin }]"
          @keydown.escape="close()"
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
