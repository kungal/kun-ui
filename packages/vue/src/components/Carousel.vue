<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
} from 'vue'
import { cn } from '@kungal/ui-core'
import { KUN_CAROUSEL } from '../composables/carouselContext'
import KunIcon from './Icon.vue'
import type { KunCarouselProps } from './types'

// Horizontal slider. Put <KunCarouselItem>s inside. The track is native CSS
// scroll-snap, so touch swipe + momentum work with zero JS and it renders
// server-side; the arrows, dot indicators and optional autoplay are progressive
// enhancements layered on top. Active slide is read from scroll position (no
// per-frame measurement beyond a rAF-throttled scroll handler).
defineOptions({ name: 'KunCarousel' })

const props = withDefaults(defineProps<KunCarouselProps>(), {
  slidesPerView: 1,
  gap: '1rem',
  showArrows: true,
  showIndicators: true,
  autoplay: 0,
  ariaLabel: '轮播',
  className: '',
})

provide(KUN_CAROUSEL, {
  slidesPerView: computed(() => Math.max(1, props.slidesPerView)),
  gap: computed(() => props.gap),
})

const trackRef = ref<HTMLElement | null>(null)
const count = ref(0)
const active = ref(0)

const maxIndex = computed(() => Math.max(0, count.value - props.slidesPerView))
const showArrows = computed(
  () => props.showArrows && count.value > props.slidesPerView
)

let reduced = false
const stride = (t: HTMLElement) => {
  const first = t.children[0] as HTMLElement | undefined
  if (!first) return 0
  const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0
  return first.getBoundingClientRect().width + gap
}

const goTo = (i: number, smooth = true) => {
  const t = trackRef.value
  if (!t) return
  const clamped = Math.max(0, Math.min(i, count.value - 1))
  const s = stride(t)
  t.scrollTo({ left: clamped * s, behavior: smooth && !reduced ? 'smooth' : 'auto' })
}
const prev = () => goTo(active.value - 1)
const next = () => goTo(active.value + 1)

let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const t = trackRef.value
    if (!t) return
    const s = stride(t)
    if (s > 0) active.value = Math.round(t.scrollLeft / s)
  })
}

// Autoplay (paused on hover / focus; off under reduced-motion or when all slides
// already fit).
let timer: ReturnType<typeof setInterval> | undefined
const canAutoplay = () =>
  props.autoplay > 0 && !reduced && count.value > props.slidesPerView
const startAutoplay = () => {
  stopAutoplay()
  if (!canAutoplay()) return
  timer = setInterval(() => {
    goTo(active.value >= maxIndex.value ? 0 : active.value + 1)
  }, props.autoplay)
}
const stopAutoplay = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}

let observer: MutationObserver | null = null
const updateCount = () => {
  count.value = trackRef.value?.children.length ?? 0
}

onMounted(() => {
  reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  updateCount()
  if (trackRef.value && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => {
      updateCount()
      startAutoplay()
    })
    observer.observe(trackRef.value, { childList: true })
  }
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  observer?.disconnect()
  if (raf) cancelAnimationFrame(raf)
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
    <ul
      ref="trackRef"
      class="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
      :style="{ gap }"
      @scroll.passive="onScroll"
    >
      <slot />
    </ul>

    <!-- Arrows -->
    <template v-if="showArrows">
      <button
        type="button"
        aria-label="上一张"
        :disabled="active <= 0"
        class="border-kun bg-background/80 text-foreground absolute top-1/2 left-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-kun-sm backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 hover:scale-105"
        @click="prev"
      >
        <KunIcon name="lucide:chevron-left" class="size-5" />
      </button>
      <button
        type="button"
        aria-label="下一张"
        :disabled="active >= maxIndex"
        class="border-kun bg-background/80 text-foreground absolute top-1/2 right-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-kun-sm backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 hover:scale-105"
        @click="next"
      >
        <KunIcon name="lucide:chevron-right" class="size-5" />
      </button>
    </template>

    <!-- Dot indicators -->
    <div
      v-if="showIndicators && count > slidesPerView"
      class="mt-3 flex items-center justify-center gap-2"
      role="tablist"
      aria-label="轮播导航"
    >
      <button
        v-for="i in count"
        :key="i"
        type="button"
        role="tab"
        :aria-label="`第 ${i} 张`"
        :aria-selected="active === i - 1"
        :class="
          cn(
            'h-2 rounded-full transition-all',
            active === i - 1
              ? 'bg-primary dark:bg-primary-400 w-5'
              : 'bg-default-300 hover:bg-default-400 w-2'
          )
        "
        @click="goTo(i - 1)"
      />
    </div>
  </div>
</template>
