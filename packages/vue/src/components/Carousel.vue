<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { cn } from '@kungal/ui-core'
import { KUN_CAROUSEL } from '../composables/carouselContext'
import KunIcon from './Icon.vue'
import type { KunCarouselProps } from './types'

// Horizontal slider on native CSS scroll-snap (touch swipe + momentum + SSR for
// free). `loop` adds a SEAMLESS infinite loop via the reposition ("treadmill")
// technique — NO cloned DOM. Each slide gets a CSS `order` so it forms a ring:
// the active slide sits at a fixed "home" scroll position with the others
// wrapping around it, so the slide physically to its right is always the next
// one (slide 0 sits right after the last). After every scroll settles we re-home
// — jump scrollLeft back by the distance travelled while shifting the (off-screen)
// slides the same amount via `order`, so the visible pixels are unchanged and the
// reset is invisible. Result: autoplay just keeps gliding forward past the end
// into the start. Reposition (not cloning) means no duplicate nodes and nothing
// for a screen reader to read twice. `order` only reorders the flex layout, never
// the DOM, so Vue never fights it.
defineOptions({ name: 'KunCarousel' })

const props = withDefaults(defineProps<KunCarouselProps>(), {
  slidesPerView: 1,
  gap: '1rem',
  showArrows: true,
  showIndicators: true,
  autoplay: 0,
  loop: true,
  ariaLabel: '轮播',
  className: '',
})

provide(KUN_CAROUSEL, {
  slidesPerView: computed(() => Math.max(1, props.slidesPerView)),
  gap: computed(() => props.gap),
})

const trackRef = ref<HTMLElement | null>(null)
const count = ref(0)
// Visual scroll position (left-most visible slot), read from scrollLeft. In loop
// mode it drifts ±1 from `home` between re-homings.
const scrollIndex = ref(0)
// Logical "first" slide (0..count-1) — what the dots reflect. Only changes when
// the scroll settles (re-home), so it survives the invisible scrollLeft reset.
const logicalActive = ref(0)

const mod = (n: number, m: number) => (m <= 0 ? 0 : ((n % m) + m) % m)

// performance.now() in the browser; only the client ever runs the scroll code.
const now = () => (typeof performance !== 'undefined' ? performance.now() : 0)

// Re-entrancy guard — the structural fix for the "runaway auto-advance" flicker.
// The seamless loop works by programmatically writing scrollLeft (recenter /
// relayout / resize). Those writes emit scroll + scrollend events; without this
// guard the handler reads them back as if the USER scrolled and re-homes again →
// the browser nudges scrollLeft after the reflow → re-home again → a per-frame
// feedback loop. overflow-anchor:none closes ONE drift source (Chromium scroll-
// anchoring); snap-mandatory re-alignment after the `order` reflow is another.
// Rather than chase each one, we suppress scroll handling for a short window after
// every self-induced write, so a programmatic write can NEVER trigger a re-home.
let scrollLockUntil = 0
const lockScroll = () => {
  scrollLockUntil = now() + 250
}
const scrollLocked = () => now() < scrollLockUntil

// Circuit breaker — last-resort guarantee. A healthy carousel re-homes at most a
// few times per second (one per autoplay tick or user swipe). If reorders ever
// spike (some unreproduced quirk reopening the loop past the guard above), trip
// out of loop mode into a plain bounded slider rather than let a user watch it
// flicker. With the lock in place this should never fire — it's pure insurance.
let reorderStamps: number[] = []
const loopBroken = ref(false)

const maxIndex = computed(() => Math.max(0, count.value - props.slidesPerView))
// Loop needs ≥2 reachable scroll positions so the home slide has a neighbour on
// each side to glide into; otherwise fall back to a plain (bounded) slider.
const loopActive = computed(
  () => props.loop && maxIndex.value >= 2 && !loopBroken.value
)
// The scroll index the active slide always returns to — centred for maximum
// runway before a fast fling can reach a physical edge.
const home = computed(() =>
  Math.min(Math.max(1, Math.floor(maxIndex.value / 2)), Math.max(1, maxIndex.value - 1))
)

const arrowsVisible = computed(
  () => props.showArrows && count.value > props.slidesPerView
)
const dotsVisible = computed(
  () => props.showIndicators && count.value > props.slidesPerView
)
// One dot per slide when looping a single-up carousel; otherwise one per page.
const perSlideDots = computed(() => loopActive.value && props.slidesPerView <= 1)
const dotCount = computed(() =>
  perSlideDots.value ? count.value : maxIndex.value + 1
)
const activeDot = computed(() =>
  perSlideDots.value
    ? mod(logicalActive.value + (scrollIndex.value - home.value), count.value)
    : scrollIndex.value
)

let reduced = false
const stride = (t: HTMLElement) => {
  const first = t.children[0] as HTMLElement | undefined
  if (!first) return 0
  const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0
  return first.getBoundingClientRect().width + gap
}

// Ring the slides via `order` so slide `logicalActive` sits at visual `home`.
const applyOrders = () => {
  const t = trackRef.value
  if (!t) return
  const n = count.value
  if (!loopActive.value || n === 0) {
    for (const el of Array.from(t.children)) (el as HTMLElement).style.order = ''
    return
  }
  const rot = mod(home.value - logicalActive.value, n)
  Array.from(t.children).forEach((el, i) => {
    ;(el as HTMLElement).style.order = String(mod(i + rot, n))
  })
}

const goTo = (i: number, smooth = true) => {
  const t = trackRef.value
  if (!t) return
  const s = stride(t)
  const clamped = Math.max(0, Math.min(i, maxIndex.value))
  t.scrollTo({
    left: clamped * s,
    behavior: smooth && !reduced ? 'smooth' : 'auto',
  })
}
const prev = () => goTo(scrollIndex.value - 1)
const next = () => goTo(scrollIndex.value + 1)
const goToDot = (dot: number) => {
  if (!perSlideDots.value) return goTo(dot)
  const n = count.value
  const rot = mod(home.value - logicalActive.value, n)
  goTo(mod(dot + rot, n)) // dot's current visual position; re-home makes it active
}

// Re-home: adopt whatever slide we settled on as the logical active, re-ring the
// orders, and reset scrollLeft to `home` — all synchronously, so only off-screen
// slides shuffle and the visible pixels never change. The invisible "reset" that
// makes the loop seamless.
const recenter = () => {
  const t = trackRef.value
  // scrollLocked(): this scroll settled from OUR OWN write, not the user — never
  // re-home off a self-induced scroll (that's the feedback loop).
  if (!t || !loopActive.value || scrollLocked()) return
  const s = stride(t)
  if (!s) return
  const delta = Math.round(t.scrollLeft / s) - home.value
  if (!delta) return
  // Circuit breaker: a burst of reorders means the loop reopened despite the
  // guard. Drop to a plain (non-loop) slider so it physically cannot flicker.
  reorderStamps = reorderStamps.filter((ts) => now() - ts < 1000)
  reorderStamps.push(now())
  if (reorderStamps.length > 12) {
    loopBroken.value = true
    stopAutoplay()
    applyOrders() // loopActive is false now ⇒ clears the ring back to natural order
    if (typeof console !== 'undefined') {
      console.warn(
        '[KunCarousel] runaway re-homing detected (browser scroll feedback); ' +
          'falling back to a non-looping slider.'
      )
    }
    return
  }
  logicalActive.value = mod(logicalActive.value + delta, count.value)
  applyOrders()
  // Lock BEFORE the write so the scroll/scrollend it emits is ignored.
  lockScroll()
  t.scrollLeft = home.value * s
  scrollIndex.value = home.value
}

let settleTimer: ReturnType<typeof setTimeout> | undefined
const scheduleRecenter = () => {
  if (!loopActive.value || scrollLocked()) return
  clearTimeout(settleTimer)
  settleTimer = setTimeout(recenter, 130)
}

let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    // Ignore the scroll our own programmatic write just emitted.
    if (scrollLocked()) return
    const t = trackRef.value
    if (!t) return
    const s = stride(t)
    if (s > 0) scrollIndex.value = Math.round(t.scrollLeft / s)
    scheduleRecenter()
  })
}

let timer: ReturnType<typeof setInterval> | undefined
const canAutoplay = () =>
  props.autoplay > 0 && !reduced && count.value > props.slidesPerView
const startAutoplay = () => {
  stopAutoplay()
  if (!canAutoplay()) return
  timer = setInterval(() => {
    if (loopActive.value) {
      // Self-heal: a stray scroll drift could have parked us off-home — worst case
      // at a physical edge, where next() would clamp and the carousel would sit
      // still. Re-home first (keeps the visible slide, restores runway) so autoplay
      // can always glide on. Idempotent when already home.
      const t = trackRef.value
      const s = t ? stride(t) : 0
      if (t && s && Math.round(t.scrollLeft / s) !== home.value) recenter()
      next()
    } else {
      goTo(scrollIndex.value >= maxIndex.value ? 0 : scrollIndex.value + 1)
    }
  }, props.autoplay)
}
const stopAutoplay = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}

// (Re)build the ring and park at home. Called on mount and whenever slides change.
const relayout = () => {
  const t = trackRef.value
  count.value = t?.children.length ?? 0
  if (count.value > 0) logicalActive.value = mod(logicalActive.value, count.value)
  applyOrders()
  if (t && loopActive.value) {
    const s = stride(t)
    if (s) {
      lockScroll()
      t.scrollLeft = home.value * s
      scrollIndex.value = home.value
    }
  }
}

const onResize = () => {
  const t = trackRef.value
  if (t && loopActive.value) {
    const s = stride(t)
    if (s) {
      lockScroll()
      t.scrollLeft = home.value * s
    }
  }
}

let observer: MutationObserver | null = null
onMounted(() => {
  reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  relayout()
  const t = trackRef.value
  if (t) {
    // Re-home the instant a scroll settles (snappier than the debounce); the
    // debounce in scheduleRecenter is the fallback for browsers without scrollend.
    t.addEventListener('scrollend', recenter)
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        relayout()
        startAutoplay()
      })
      observer.observe(t, { childList: true })
    }
  }
  window.addEventListener('resize', onResize)
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  observer?.disconnect()
  if (raf) cancelAnimationFrame(raf)
  clearTimeout(settleTimer)
  trackRef.value?.removeEventListener('scrollend', recenter)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    :class="cn('group/carousel relative', className)"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    @pointerenter="stopAutoplay"
    @pointerleave="startAutoplay"
    @focusin="stopAutoplay"
    @focusout="startAutoplay"
  >
    <!-- overflow-anchor:none is set INLINE (not as a Tailwind class) on purpose:
         it's a correctness fix, not styling, and a headless consumer's Tailwind
         may not regenerate an arbitrary utility from our compiled JS — an inline
         style always applies and can never be purged. Why it matters: this is a
         scroll-JACKED container — the seamless loop programmatically reorders
         slides (`order`) and resets scrollLeft. On Chromium the default scroll-
         anchoring re-adjusts scrollLeft to keep an "anchor" element in view on
         that reorder/reflow, which the re-home logic would misread as a slide
         change → runaway auto-advance (wild flicker, Chrome/Edge). Disabling it
         hands scroll control to us; the re-entrancy lock + circuit breaker in the
         script are the structural backstops for any other scrollLeft drift. -->
    <ul
      ref="trackRef"
      class="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
      :style="{ gap, overflowAnchor: 'none' }"
      @scroll.passive="onScroll"
    >
      <slot />
    </ul>

    <!-- Arrows -->
    <template v-if="arrowsVisible">
      <button
        type="button"
        aria-label="上一张"
        :disabled="!loopActive && activeDot <= 0"
        class="border-kun bg-background/80 text-foreground absolute top-1/2 left-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-kun-sm backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 hover:scale-105"
        @click="prev"
      >
        <KunIcon name="lucide:chevron-left" class="size-5" />
      </button>
      <button
        type="button"
        aria-label="下一张"
        :disabled="!loopActive && activeDot >= maxIndex"
        class="border-kun bg-background/80 text-foreground absolute top-1/2 right-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-kun-sm backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 hover:scale-105"
        @click="next"
      >
        <KunIcon name="lucide:chevron-right" class="size-5" />
      </button>
    </template>

    <!-- Dot indicators -->
    <div
      v-if="dotsVisible"
      class="mt-3 flex items-center justify-center gap-2"
      role="group"
      aria-label="轮播导航"
    >
      <button
        v-for="i in dotCount"
        :key="i"
        type="button"
        :aria-label="`跳到第 ${i} 张`"
        :aria-current="activeDot === i - 1 ? 'true' : undefined"
        :class="
          cn(
            'h-2 rounded-full transition-all',
            activeDot === i - 1
              ? 'bg-primary w-5'
              : 'bg-default-300 hover:bg-default-400 w-2'
          )
        "
        @click="goToDot(i - 1)"
      />
    </div>
  </div>
</template>
