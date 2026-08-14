<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { useKunOverlayZIndex } from '../composables/useKunOverlayZIndex'
import { useKunBackgroundInert } from '../composables/useKunBackgroundInert'
import { useVisualViewportHeight } from '../composables/useVisualViewportHeight'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunModalPlacement, KunModalProps, KunModalSize } from './types'

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
  placement: 'auto',
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

// Where the panel sits, and how big a gap it leaves against the viewport edge.
//
// `auto` is the responsive one — a bottom sheet on phones, a centred dialog from
// `md` up — and it is expressed purely in breakpoint classes, deliberately. The
// obvious alternative, a `useMediaQuery` ref, evaluates to `false` on the server
// (VueUse has no width to test unless the app calls `provideSSRWidth`), so a
// dialog that is open in the SSR markup would ship centred and snap to the
// bottom on hydration. Static classes render the same on both sides.
//
// The tighter mobile gap (`p-1`) is what makes a sheet read as a sheet rather
// than a card that happens to be low; `md:p-3` restores the desktop inset.
const placementClassMap: Record<KunModalPlacement, string> = {
  auto: 'items-end p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:items-center md:p-3',
  center: 'items-center p-3',
  top: 'items-start p-3',
}
const overlayClass = computed(() => [
  placementClassMap[props.placement],
  props.scrollBehavior === 'outside' ? 'overflow-y-auto' : '',
])

// Below `md` an `auto` panel spans the full width like a sheet. `min-w-0` lifts
// the 20rem floor, which on its own overflows a 320px-wide phone.
const panelPlacementClass = computed(() =>
  props.placement === 'auto' ? 'max-md:w-full max-md:min-w-0' : ''
)

// `min(90dvh, 100%)`: 90dvh is the design cap and wins in the ordinary case
// (the overlay's own padding already makes 100% the larger of the two). When the
// keyboard shrinks the overlay to the visual viewport, 100% becomes the smaller
// and keeps the panel inside what's actually on screen. `vh` was wrong on phones
// even before the keyboard — it resolves against the *large* viewport, so a
// 90vh panel already ran under the address bar.
const panelScrollClass = computed(() => {
  if (props.scrollBehavior === 'inside') {
    return 'max-h-[min(90dvh,100%)] overflow-y-auto'
  }
  // Scrolling outside: the panel's own margin sets the gap, so an `auto` sheet
  // has to drop it below `md` or it floats 2rem off the bottom edge.
  return props.placement === 'auto' ? 'my-8 max-md:my-0' : 'my-8'
})

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

// Track the visible viewport while open so the on-screen keyboard shrinks the
// overlay instead of covering it — see useVisualViewportHeight for why `dvh`
// can't do this. Null until measured, hence the CSS fallback in the style below.
const visualViewportHeight = useVisualViewportHeight(() => modelValue.value)

const overlayStyle = computed(() => ({
  zIndex: zIndex.value,
  height: 'var(--kun-visual-viewport-height, 100dvh)',
  ...(visualViewportHeight.value === null
    ? {}
    : { '--kun-visual-viewport-height': `${visualViewportHeight.value}px` }),
}))

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
        :data-placement="placement"
        :class="
          cn(
            'bg-default-800/70 dark:bg-background/70 z-kun-modal fixed top-0 left-0 flex w-full justify-center',
            overlayClass,
            className
          )
        "
        :style="overlayStyle"
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
              panelPlacementClass,
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

/* `auto` below md: the panel is a sheet anchored to the bottom edge, so it rises
   from that edge instead of scaling in place — scaling a full-width sheet reads
   as the whole screen twitching. 5rem of travel rather than the panel's own
   height keeps the exit short; it's the distance HeroUI settled on too. */
@media (width < 48rem) {
  .kun-modal-enter-from[data-placement='auto'] .kun-modal-panel,
  .kun-modal-leave-to[data-placement='auto'] .kun-modal-panel {
    transform: translateY(5rem) scale(1);
  }
}
</style>
