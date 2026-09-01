<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { useKunOverlayZIndex } from '../composables/useKunOverlayZIndex'
import { useKunBackgroundInert } from '../composables/useKunBackgroundInert'
import { useKunCloseRequest } from '../composables/useKunCloseRequest'
import { useKunFloatingLayerStack } from '../composables/useKunFloatingLayer'
import { useKunSwipeDismiss } from '../composables/useKunSwipeDismiss'
import { useKunUniqueId } from '../composables/useKunUniqueId'
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
  title: '',
  description: '',
  ariaLabel: '',
  // Deliberately `undefined` and not `true`: the default depends on `role` (see
  // `isDismissable` below). Vue casts an ABSENT Boolean prop to `false`, but
  // only when no `default` key is declared — spelling out `undefined` keeps the
  // three states (unset / true / false) distinguishable.
  isDismissable: undefined,
  isCloseRequestDismissable: true,
  isSwipeDismissable: true,
  isShowCloseButton: true,
  withContainer: true,
  rounded: undefined,
  size: 'md',
  scrollBehavior: 'inside',
  placement: 'auto',
  role: 'dialog',
})

// An `alertdialog` interrupts the user to demand an answer, and a click that
// happens to land on the backdrop is not one — so it stops dismissing, which is
// exactly what Radix's and Reka's AlertDialog do (`@pointer-down-outside.prevent
// @interact-outside.prevent`) and what APG asks for. Escape is deliberately NOT
// included: both libraries leave it alone, because "cancel" is a real answer and
// Escape is how a keyboard gives it. `:is-dismissable="true"` opts the backdrop
// back in; `false` still turns both off.
const isBackdropDismissable = computed(
  () => props.isDismissable ?? props.role !== 'alertdialog'
)
const isEscapeDismissable = computed(() => props.isDismissable ?? true)

// A dialog needs an accessible name, and the name should be the visible title —
// `aria-labelledby` pointing at the rendered <h2>, which is what every library
// with a title slot/prop does (Reka, Zag, react-aria, Nuxt UI). `ariaLabel` stays
// as the escape hatch for a dialog whose title is drawn some other way.
const uniqueId = useKunUniqueId('kun-modal')
const titleId = computed(() => `${uniqueId.value}-title`)
const descriptionId = computed(() => `${uniqueId.value}-description`)
const labelledBy = computed(() => (props.title ? titleId.value : undefined))
const describedBy = computed(() =>
  props.description ? descriptionId.value : undefined
)
const label = computed(() =>
  props.title ? undefined : props.ariaLabel || undefined
)

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
  props.scrollBehavior === 'outside' ? 'overflow-y-auto overscroll-contain' : '',
])

// Below `md` an `auto` panel spans the full width like a sheet. `min-w-0` lifts
// the 20rem floor, which on its own overflows a 320px-wide phone.
const panelPlacementClass = computed(() =>
  props.placement === 'auto' ? 'max-md:w-full max-md:min-w-0' : ''
)

// `min(Ndvh, 100%)`: Ndvh is the design cap and wins in the ordinary case (the
// overlay's own padding already makes 100% the larger of the two). When the
// keyboard shrinks the overlay to the visual viewport, 100% becomes the smaller
// and keeps the panel inside what's actually on screen. `vh` was wrong on phones
// even before the keyboard — it resolves against the *large* viewport, so a
// 90vh panel already ran under the address bar.
//
// N is 85 for a sheet and 90 everywhere else, because the leftover is spent
// differently in the two shapes. A centred dialog splits it into two strips
// (~37px each on a 750px viewport — ordinary padding). A bottom sheet puts all
// of it in one strip at the top, and that strip is doing two jobs: signalling
// that this is a layer over the page, and being the only tap-to-dismiss target.
// At 90dvh it is 71px on a 750px viewport and 48px on an iPhone SE — past the
// 44px minimum with nothing to spare. 85dvh makes it 108px / 74px.
//
// For reference, HeroUI is `calc(100% - 8rem)` at every width, which is really
// its desktop `sm:my-16` margins in disguise; on a phone (`my-1`) it just leaves
// 124px unused, landing at 83% of a 750px viewport and 75% of an SE. shadcn's
// vaul drawer is `max-h-[80vh]` with a 96px floor. 85 sits between them.
//
// `overscroll-contain` stops the panel handing its leftover scroll to the page
// underneath once it hits an end — the body lock catches that on desktop, but a
// nested scroller inside the panel would still chain past it, and on iOS the
// chain is what drags the page out from under a bottom sheet.
const panelScrollClass = computed(() => {
  if (props.scrollBehavior === 'inside') {
    return props.placement === 'auto'
      ? 'max-h-[min(85dvh,100%)] md:max-h-[min(90dvh,100%)] overflow-y-auto overscroll-contain'
      : 'max-h-[min(90dvh,100%)] overflow-y-auto overscroll-contain'
  }
  // Scrolling outside: the panel's own margin sets the gap, so an `auto` sheet
  // has to drop it below `md` or it floats 2rem off the bottom edge.
  return props.placement === 'auto' ? 'my-8 max-md:my-0' : 'my-8'
})

const modelValue = defineModel<boolean>({ required: true })

const emits = defineEmits<{
  close: []
}>()

// `process.env.NODE_ENV` and NOT `import.meta.env.DEV`: Vite folds the latter to
// `false` while building THIS package, which strips the warning out of the
// published bundle so it could never reach the app that needs it. NODE_ENV is
// substituted by the CONSUMER's bundler instead, so the check survives into
// dist, warns in their dev build, and folds away in their production one — the
// same idiom Reka UI uses for its DialogTitle warning.
if (process.env.NODE_ENV !== 'production') {
  watchEffect(() => {
    if (modelValue.value && !props.title && !props.ariaLabel) {
      console.warn(
        '[KunModal] this dialog has no accessible name, so a screen reader announces it as just "dialog". Pass `title` (rendered, and wired to aria-labelledby) or `aria-label`.'
      )
    }
  })
}

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
//
// `fallbackFocus` is what lets the backdrop stay OUT of the tab order. focus-trap
// refuses to activate on a container with no tabbable node, and a modal whose
// body is pure text has none — the old fix was `tabindex="0"` on the backdrop,
// which bought that at the price of making the dim area itself a tab stop that
// AT announces. Pointing the fallback at the panel (`tabindex="-1"`: focusable
// programmatically, never by Tab) gives focus-trap its target and gives the
// backdrop nothing.
//
// The teleported panels of any popup opened from inside this modal join the
// trap as extra containers, or focus-trap pulls focus straight back out of them
// (see useKunFloatingLayer). `trapEl` stays FIRST so it keeps deciding initial
// focus and tab order. One inherited constraint: focus-trap throws
// "positive tabindexes are only supported in single-container focus-traps", so
// a positive tabindex inside a modal, already an anti-pattern, is now fatal
// rather than merely wrong.
//
// `preventScroll` because every pull-back focus() this trap performs would
// otherwise scroll the document to wherever it thinks the node is — and a
// floating panel is at the document origin until Floating UI has positioned it.
const trapEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const { panels: floatingPanels, hasOpenLayer } =
  useKunFloatingLayerStack(trapEl)
const trapContainers = computed(() =>
  trapEl.value ? [trapEl.value, ...floatingPanels.value] : []
)
const { activate, deactivate } = useFocusTrap(trapContainers, {
  immediate: false,
  escapeDeactivates: false,
  allowOutsideClick: true,
  returnFocusOnDeactivate: true,
  preventScroll: true,
  fallbackFocus: () => panelEl.value ?? (trapEl.value as HTMLElement),
})

const dismiss = () => {
  modelValue.value = false
  emits('close')
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
  if (
    isBackdropDismissable.value &&
    e.target === e.currentTarget &&
    pressedOnBackdrop.value
  ) {
    dismiss()
  }
}

// Drag the phone sheet down to dismiss it. Gated on `isBackdropDismissable`
// rather than on Escape: a swipe is a pointer dismissal, so it goes with the
// backdrop — which also gives `role="alertdialog"` the right answer, since an
// alert must not be swiped away any more than it can be clicked away.
//
// `placement === 'auto'` is only HALF the sheet test: `auto` is a sheet below
// `md` and a centred dialog above it, and the split lives in breakpoint classes
// with no reactive counterpart. Reading matchMedia HERE, at the start of a
// gesture, is what makes that safe — a `useMediaQuery` ref would be `false`
// during SSR and would have to render something on the strength of it.
const isSwipeEnabled = () =>
  props.isSwipeDismissable &&
  isBackdropDismissable.value &&
  props.placement === 'auto' &&
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 47.99rem)').matches

useKunSwipeDismiss(panelEl, { enabled: isSwipeEnabled, onDismiss: dismiss })

// Android's back button/gesture closes this dialog instead of leaving the page.
// Gated on the same `isEscapeDismissable` as the keydown handler below: back IS
// Android's Escape, so a dialog that refuses to cancel on one must refuse on
// the other.
const { isWatching: isWatchingCloseRequests } = useKunCloseRequest(
  () =>
    modelValue.value &&
    isTopmost.value &&
    isEscapeDismissable.value &&
    props.isCloseRequestDismissable,
  dismiss
)

useEventListener('keydown', (e: KeyboardEvent) => {
  // Only the topmost overlay reacts to Escape, so a stacked Esc dismisses one
  // layer at a time instead of closing every open modal/drawer at once.
  //
  // Stand down while a close watcher is live: Escape is a close request too, so
  // the watcher is already going to handle this exact key press, and running
  // both closes two layers at once (see useKunCloseRequest).
  //
  // Stand down for the same reason while a popup opened from inside this modal
  // is on screen — its own Escape handler is about to close it, and both
  // running took the modal down with the popover in one press.
  if (
    e.key === 'Escape' &&
    modelValue.value &&
    isTopmost.value &&
    isEscapeDismissable.value &&
    !isWatchingCloseRequests.value &&
    !hasOpenLayer.value
  ) {
    dismiss()
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
        tabindex="-1"
      >
        <div
          v-if="withContainer"
          ref="panelEl"
          :role="role"
          aria-modal="true"
          :aria-label="label"
          :aria-labelledby="labelledBy"
          :aria-describedby="describedBy"
          tabindex="-1"
          :class="
            cn(
              'kun-modal-panel bg-content1 scrollbar-hide shadow-kun-lg kun-backdrop relative mx-auto min-w-80 p-6 focus:outline-none',
              sizeClass,
              panelPlacementClass,
              panelScrollClass,
              roundedClass,
              innerClassName
            )
          "
          @click.stop
        >
          <!-- Drag affordance. Absolutely positioned inside the panel's own
               p-6, so it costs the content no room and moves no existing
               layout. Purely CSS-gated to where the gesture actually exists —
               the sheet form below `md`, on a touch-primary pointer — because a
               media-query ref would render differently on the server. It is
               decorative: the gesture it advertises has a keyboard/AT
               equivalent in Escape and the close button, so it is aria-hidden
               and never a tab stop. -->
          <div
            v-if="isSwipeDismissable && isBackdropDismissable && placement === 'auto'"
            aria-hidden="true"
            class="bg-default-300 dark:bg-default-600 absolute top-2 left-1/2 hidden h-1 w-9 -translate-x-1/2 rounded-full max-md:pointer-coarse:block"
          />

          <!-- Rendered only when asked for, so a caller who draws their own
               heading in the slot keeps the exact layout they had. -->
          <div
            v-if="title || description"
            :class="$slots.default ? 'mb-4' : ''"
          >
            <h2
              v-if="title"
              :id="titleId"
              class="text-foreground pr-8 text-lg font-semibold"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              :id="descriptionId"
              class="text-default-600 mt-2 text-sm"
            >
              {{ description }}
            </p>
          </div>

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
