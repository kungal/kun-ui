<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { useKunOverlayZIndex } from '../composables/useKunOverlayZIndex'
import { useKunBackgroundInert } from '../composables/useKunBackgroundInert'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunModalProps, KunModalSize } from './types'

// Nuxt-decoupled Modal. Same behaviour as the Nuxt original — Teleport to
// body, focus trap, refcounted body scroll-lock, Escape-to-close — but every
// dependency is an explicit import (vue / @vueuse / @kungal/ui-core / siblings)
// instead of a Nuxt auto-import.
defineOptions({ name: 'KunModal' })

const props = withDefaults(defineProps<KunModalProps>(), {
  className: '',
  innerClassName: '',
  isDismissable: true,
  isShowCloseButton: true,
  withContainer: true,
  rounded: undefined,
  size: 'md',
  scrollBehavior: 'inside',
  placement: 'center',
  role: 'dialog',
})

// Uniform corner radius: defers to the global config.rounded (default 'md')
// like every other KunUI surface — set config.rounded once to restyle them all.
const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

// Max width of the panel (content-driven up to the cap; `full` ≈ whole screen).
const sizeClassMap: Record<KunModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'w-[calc(100vw-1.5rem)] max-w-none',
}
const sizeClass = computed(() => sizeClassMap[props.size])
// Overlay alignment + which element scrolls when content overflows.
const overlayClass = computed(() => [
  props.placement === 'top' ? 'items-start' : 'items-center',
  props.scrollBehavior === 'outside' ? 'overflow-y-auto' : '',
])
const panelScrollClass = computed(() =>
  props.scrollBehavior === 'inside' ? 'max-h-[90vh] overflow-y-auto' : 'my-8'
)

const modelValue = defineModel<boolean>({ required: true })

const emits = defineEmits<{
  close: []
}>()

// The singleton lock counter lives in useBodyScrollLock; `locked` here is
// per-instance and guarantees onUnmounted releases exactly once regardless
// of how many times modelValue toggled.
const { lock, unlock } = useBodyScrollLock()
let locked = false
const applyLock = (shouldLock: boolean) => {
  if (shouldLock && !locked) {
    lock()
    locked = true
  } else if (!shouldLock && locked) {
    unlock()
    locked = false
  }
}

// Claim a fresh z-index on open so the most-recently-opened modal always wins
// the stack, regardless of template/DOM order. `claimed` keeps claim/release
// symmetric across modelValue toggles, exactly like `locked` above.
const { zIndex, claim, release, isTopmost } = useKunOverlayZIndex()
let claimed = false
const applyZIndex = (shouldClaim: boolean) => {
  if (shouldClaim && !claimed) {
    claim()
    claimed = true
  } else if (!shouldClaim && claimed) {
    release()
    claimed = false
  }
}

// Mark the page background `inert` while open (stronger than aria-modal alone).
// `inerted` keeps the refcount symmetric across modelValue toggles.
const { activate: inertOn, deactivate: inertOff } = useKunBackgroundInert()
let inerted = false
const applyInert = (shouldInert: boolean) => {
  if (shouldInert && !inerted) {
    inertOn()
    inerted = true
  } else if (!shouldInert && inerted) {
    inertOff()
    inerted = false
  }
}

// Focus trap on the modal container — focus can't escape via Tab/Shift+Tab
// while open. `escapeDeactivates: false` because Modal owns the Escape
// handler below. `returnFocusOnDeactivate` restores focus on close.
const trapEl = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(trapEl, {
  immediate: false,
  escapeDeactivates: false,
  allowOutsideClick: true,
  returnFocusOnDeactivate: true,
})

const handleCloseKunModal = () => {
  if (props.isDismissable) {
    modelValue.value = false
    emits('close')
  }
}

// Backdrop dismissal must require that the press STARTED on the backdrop, not
// merely that the release landed there. A `click` fires on the nearest common
// ancestor of its mousedown + mouseup, so pressing INSIDE the modal (e.g.
// selecting text in an input), dragging out, and releasing on the backdrop
// fires a click ON the backdrop — which would close the modal ("I let go of
// the mouse and it vanished"). Track where the press began and only treat the
// click as a dismiss when it began on the backdrop itself.
const pressedOnBackdrop = ref(false)
const onBackdropPointerDown = (e: Event) => {
  pressedOnBackdrop.value = e.target === e.currentTarget
}
const onBackdropClick = (e: Event) => {
  if (e.target === e.currentTarget && pressedOnBackdrop.value) {
    handleCloseKunModal()
  }
}

useEventListener('keydown', (e: KeyboardEvent) => {
  // Only the topmost overlay reacts to Escape, so a stacked Esc dismisses one
  // layer at a time instead of closing every open modal/drawer at once.
  if (e.key === 'Escape' && modelValue.value && isTopmost.value) {
    handleCloseKunModal()
  }
})

watch(modelValue, async (v) => {
  applyLock(v)
  applyZIndex(v)
  if (v) {
    // nextTick so the trap element is mounted before activate() walks its
    // children for focusable nodes. inert AFTER activate() so the focus trap
    // captures the trigger as its return target before inert blurs it.
    await nextTick()
    activate()
    applyInert(true)
  } else {
    applyInert(false)
    deactivate()
  }
})

onMounted(async () => {
  if (modelValue.value) {
    applyLock(true)
    applyZIndex(true)
    await nextTick()
    activate()
    applyInert(true)
  }
})

onUnmounted(() => {
  applyLock(false)
  applyZIndex(false)
  applyInert(false)
  deactivate()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="kun-modal">
      <div
        v-if="modelValue"
        ref="trapEl"
        data-kun-overlay
        :class="
          cn(
            'bg-default-800/70 dark:bg-background/70 fixed top-0 left-0 z-kun-modal flex h-full w-full justify-center p-3',
            overlayClass,
            className
          )
        "
        :style="{ zIndex }"
        @pointerdown="onBackdropPointerDown"
        @click="onBackdropClick"
        tabindex="0"
      >
        <div
          v-if="withContainer"
          :role="role"
          aria-modal="true"
          :aria-label="ariaLabel || '对话框'"
          :class="
            cn(
              'kun-modal-panel bg-content1 scrollbar-hide shadow-kun-lg kun-backdrop relative mx-auto min-w-80 p-6',
              sizeClass,
              panelScrollClass,
              roundedClass,
              innerClassName
            )
          "
          @click.stop
        >
          <slot />

          <KunButton
            v-if="isShowCloseButton"
            color="default"
            variant="light"
            class-name="absolute top-1 right-1"
            rounded="full"
            :is-icon-only="true"
            aria-label="关闭"
            @click="
              () => {
                modelValue = false
                emits('close')
              }
            "
          >
            <KunIcon class="icon" name="lucide:x" />
          </KunButton>
        </div>

        <slot v-else />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop fades (opacity only — never scale a full-screen backdrop or its
   edges uncover). The panel rises + scales in on top of it. */
.kun-modal-enter-active {
  transition: opacity var(--kun-dur-base) var(--ease-kun-out);
}
.kun-modal-leave-active {
  transition: opacity var(--kun-dur-exit) var(--ease-kun-in);
}
.kun-modal-enter-from,
.kun-modal-leave-to {
  opacity: 0;
}

.kun-modal-enter-active .kun-modal-panel {
  transition: transform var(--kun-dur-base) var(--ease-kun-out);
}
.kun-modal-leave-active .kun-modal-panel {
  transition: transform var(--kun-dur-exit) var(--ease-kun-in);
}
.kun-modal-enter-from .kun-modal-panel,
.kun-modal-leave-to .kun-modal-panel {
  transform: translateY(8px) scale(0.96);
}
</style>
