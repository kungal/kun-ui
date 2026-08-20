<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useScroll, useElementSize, useEventListener } from '@vueuse/core'
import { cn } from '@kungal/ui-core'
import { wheelDeltaPx } from '../utils/wheelDeltaPx'
import type { KunScrollShadowProps } from './types'

// Edge fade-out shadows that appear when content is scrolled off either end of a
// scroll container. Optionally lets mouse users reach a horizontal strip via the
// wheel or by dragging. Pure @vueuse + CSS; no Nuxt coupling.
//
// PERFORMANCE: the wheel/drag handlers do O(1) work per event and read NO layout
// in the hot path — scroll bounds come from the ResizeObserver-backed sizes
// (`useElementSize`), and we only touch the cheap `scrollLeft/Top` + assign it
// (the compositor does the actual scroll). The non-passive wheel listener is bound
// ONLY when `wheel` is on (so it never costs idle scrollers the passive fast-path),
// and it `preventDefault`s only while it actually consumes the wheel — at an edge
// it releases, so the page keeps scrolling (no scroll-trapping).
defineOptions({ name: 'KunScrollShadow' })

const props = withDefaults(defineProps<KunScrollShadowProps>(), {
  axis: 'horizontal',
  shadowColor: 'var(--color-background)',
  shadowSize: '2rem',
  className: '',
  contentClass: '',
  ariaLabel: 'scrollable content',
  wheel: false,
  draggable: false,
  scrollbar: 'hide',
})

const scrollContainer = ref<HTMLElement | null>(null)
const contentWrapper = ref<HTMLElement | null>(null)

const { x: scrollLeft, y: scrollTop } = useScroll(scrollContainer, {
  throttle: 50,
})
const { width: contentWidth, height: contentHeight } =
  useElementSize(contentWrapper)
const { width: containerWidth, height: containerHeight } =
  useElementSize(scrollContainer)

// Max scroll along each axis — derived from the reactive sizes, so the wheel/drag
// handlers never have to read layout (scrollWidth/clientWidth) themselves.
const maxX = computed(() => Math.max(0, contentWidth.value - containerWidth.value))
const maxY = computed(() => Math.max(0, contentHeight.value - containerHeight.value))

const showStartShadow = ref(false)
const showEndShadow = ref(false)

watchEffect(() => {
  if (!scrollContainer.value) return
  const epsilon = 1
  if (props.axis === 'horizontal') {
    showStartShadow.value = scrollLeft.value > epsilon
    showEndShadow.value = maxX.value - scrollLeft.value > epsilon
  } else {
    showStartShadow.value = scrollTop.value > epsilon
    showEndShadow.value = maxY.value - scrollTop.value > epsilon
  }
})

// ── wheel → axis scroll ──────────────────────────────────────────────────────
// Only meaningful for a horizontal strip (a vertical one already scrolls on the
// wheel). Bind the non-passive listener ONLY when enabled.
const wheelTarget = computed(() =>
  props.wheel && props.axis === 'horizontal' ? scrollContainer.value : null
)
function onWheel(e: WheelEvent) {
  const el = scrollContainer.value
  if (!el) return
  const max = maxX.value
  if (max <= 0) return // nothing to scroll → let the page handle it
  const delta = wheelDeltaPx(e, el.clientWidth)
  if (!delta) return
  const cur = el.scrollLeft
  // At a wall in the requested direction?
  if ((delta < 0 && cur <= 0) || (delta > 0 && cur >= max - 1)) {
    // 'contain' keeps the wheel here so the page doesn't scroll on past; the
    // default releases so scrolling chains to the page as usual.
    if (props.wheel === 'contain') e.preventDefault()
    return
  }
  el.scrollLeft = cur + delta
  e.preventDefault() // only now, because we actually consumed it
}
useEventListener(wheelTarget, 'wheel', onWheel, { passive: false })

// ── drag → scroll ────────────────────────────────────────────────────────────
// Grab-and-drag for mouse/pen (touch already scrolls natively). A move past a
// small threshold becomes a drag and then swallows the trailing click so cards
// inside still respond to a normal (non-drag) click.
const dragTarget = computed(() => (props.draggable ? scrollContainer.value : null))
let dragging = false
let moved = false
let startPos = 0
let startScroll = 0
let activeId = -1

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch') return // native touch scrolling handles it
  if (e.pointerType === 'mouse' && e.button !== 0) return // left button only
  const el = scrollContainer.value
  if (!el) return
  const max = props.axis === 'horizontal' ? maxX.value : maxY.value
  if (max <= 0) return // nothing to scroll
  dragging = true
  moved = false
  activeId = e.pointerId
  startPos = props.axis === 'horizontal' ? e.clientX : e.clientY
  startScroll = props.axis === 'horizontal' ? el.scrollLeft : el.scrollTop
}

function onPointerMove(e: PointerEvent) {
  if (!dragging || e.pointerId !== activeId) return
  const el = scrollContainer.value
  if (!el) return
  const pos = props.axis === 'horizontal' ? e.clientX : e.clientY
  const d = pos - startPos
  if (!moved) {
    if (Math.abs(d) < 6) return // still within click threshold
    moved = true
    try {
      el.setPointerCapture(e.pointerId)
    } catch {
      /* pointer already gone / not capturable — dragging still works */
    }
    el.style.userSelect = 'none'
    el.style.cursor = 'grabbing'
  }
  if (props.axis === 'horizontal') el.scrollLeft = startScroll - d
  else el.scrollTop = startScroll - d
}

function endDrag(e: PointerEvent) {
  if (!dragging) return
  dragging = false
  activeId = -1
  const el = scrollContainer.value
  if (el) {
    el.style.userSelect = ''
    el.style.cursor = ''
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
  }
}

// Capture-phase: if the gesture was a real drag, eat the click it would emit so a
// drag-to-scroll never fires a card's click. `moved` is reset on the next press.
function onClickCapture(e: MouseEvent) {
  if (moved) {
    e.stopPropagation()
    e.preventDefault()
    moved = false
  }
}
// Stop the browser's native image/text drag from hijacking the gesture.
function onDragStart(e: Event) {
  if (dragging) e.preventDefault()
}

useEventListener(dragTarget, 'pointerdown', onPointerDown)
useEventListener(dragTarget, 'pointermove', onPointerMove)
useEventListener(dragTarget, 'pointerup', endDrag)
useEventListener(dragTarget, 'pointercancel', endDrag)
useEventListener(dragTarget, 'dragstart', onDragStart)
useEventListener(dragTarget, 'click', onClickCapture, { capture: true })

// ── shadow presentation ──────────────────────────────────────────────────────
const startShadowClasses = computed(() =>
  props.axis === 'horizontal' ? 'left-0 top-0 bottom-0' : 'top-0 left-0 right-0'
)
const endShadowClasses = computed(() =>
  props.axis === 'horizontal' ? 'right-0 top-0 bottom-0' : 'bottom-0 left-0 right-0'
)
const shadowStyles = computed(() => {
  const sizeProperty = props.axis === 'horizontal' ? 'width' : 'height'
  const startGradient =
    props.axis === 'horizontal'
      ? `linear-gradient(to right, ${props.shadowColor}, transparent)`
      : `linear-gradient(to bottom, ${props.shadowColor}, transparent)`
  const endGradient =
    props.axis === 'horizontal'
      ? `linear-gradient(to left, ${props.shadowColor}, transparent)`
      : `linear-gradient(to top, ${props.shadowColor}, transparent)`

  return {
    start: {
      [sizeProperty]: props.shadowSize,
      backgroundImage: startGradient,
    } as Record<string, string>,
    end: {
      [sizeProperty]: props.shadowSize,
      backgroundImage: endGradient,
    } as Record<string, string>,
  }
})
</script>

<template>
  <div class="relative">
    <div
      aria-hidden="true"
      :class="
        cn(
          'pointer-events-none absolute z-10 transition-opacity',
          startShadowClasses,
          showStartShadow ? 'opacity-100' : 'opacity-0'
        )
      "
      :style="shadowStyles.start"
    />

    <div
      ref="scrollContainer"
      tabindex="0"
      role="region"
      :aria-label="ariaLabel"
      :class="
        cn(
          scrollbar === 'thin' ? 'kun-scroll-thin' : scrollbar === 'auto' ? '' : 'scrollbar-hide',
          axis === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto',
          draggable && 'cursor-grab',
          props.className
        )
      "
    >
      <div
        ref="contentWrapper"
        :class="
          cn(
            axis === 'horizontal' ? 'flex w-max gap-3' : 'flex w-full flex-col gap-3',
            props.contentClass
          )
        "
      >
        <slot />
      </div>
    </div>

    <div
      aria-hidden="true"
      :class="
        cn(
          'pointer-events-none absolute z-10 transition-opacity',
          endShadowClasses,
          showEndShadow ? 'opacity-100' : 'opacity-0'
        )
      "
      :style="shadowStyles.end"
    />
  </div>
</template>

<style scoped>
/* A thin, theme-aware scrollbar — the dependency-free alternative to an overlay-
   scrollbar library. Standards first (scrollbar-width/color); the -webkit block
   covers Safari / older Chromium that predate scrollbar-color (newer engines
   ignore ::-webkit-scrollbar once scrollbar-color is set, which is what we want). */
.kun-scroll-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--color-default-300) transparent;
}
.kun-scroll-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.kun-scroll-thin::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: var(--color-default-300);
}
.kun-scroll-thin::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-default-400);
}
.kun-scroll-thin::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
