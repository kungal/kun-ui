<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type { KunLightboxProps } from './types'

// Modern <dialog>-based image viewer (focus trap / ESC / inert / ::backdrop
// from the browser; we own scroll-lock, ←/→ nav, backdrop-click close, and
// the viewer mechanics: wheel zoom, drag/pan, pinch, swipe, double-tap zoom,
// rotate, download). No Nuxt coupling — explicit imports only.
defineOptions({ name: 'KunLightbox' })

const props = defineProps<KunLightboxProps>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const MIN_SCALE = 1
const MAX_SCALE = 5
const SWIPE_THRESHOLD = 50
const ZOOM_STEP = 0.5

const currentIndex = ref(props.initialIndex || 0)
const scale = ref(1)
const isPinching = ref(false)
let lastTapTime = 0
let lastTapX = 0
let lastTapY = 0
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_PX = 30
// Rotation kept unbounded so CSS transitions take the short path; snapped to
// the nearest 360-multiple on reset.
const rotation = ref(0)
const position = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })
const lastTouch = reactive({ x: 0, y: 0 })
const lastTouchDistance = ref(0)
const dragStartTime = ref(0)
const initialDragPosition = reactive({ x: 0, y: 0 })

const slideDir = ref<'slide-next' | 'slide-prev'>('slide-next')

const dialogRef = ref<HTMLDialogElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const currentImage = computed(() => props.images[currentIndex.value]?.src || '')
const currentAlt = computed(() => props.images[currentIndex.value]?.alt || '')

const transformStyle = computed(() => ({
  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale.value}) rotate(${rotation.value}deg)`,
  transition:
    isDragging.value || isPinching.value ? 'none' : 'transform 0.3s ease-out',
}))

const resetTransform = () => {
  rotation.value = Math.round(rotation.value / 360) * 360
  scale.value = MIN_SCALE
  position.x = 0
  position.y = 0
}

const zoomIn = () => {
  const next = Math.min(MAX_SCALE, scale.value + ZOOM_STEP)
  if (next === scale.value) return
  scale.value = next
  const c = constrainPosition(position.x, position.y)
  position.x = c.x
  position.y = c.y
}
const zoomOut = () => {
  const next = Math.max(MIN_SCALE, scale.value - ZOOM_STEP)
  if (next === scale.value) return
  scale.value = next
  const c = constrainPosition(position.x, position.y)
  position.x = c.x
  position.y = c.y
}

const rotateRight = () => {
  rotation.value += 90
}
const rotateLeft = () => {
  rotation.value -= 90
}

const withViewTransition = (mutate: () => void) => {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown
  }
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(mutate)
  } else {
    mutate()
  }
}

const { lock, unlock } = useBodyScrollLock()
let locked = false

watch(
  () => props.isOpen,
  (open) => {
    const dlg = dialogRef.value
    if (!dlg) return
    if (open && !dlg.open) {
      resetTransform()
      withViewTransition(() => dlg.showModal())
      if (!locked) {
        lock()
        locked = true
      }
    } else if (!open && dlg.open) {
      withViewTransition(() => dlg.close())
      if (locked) {
        unlock()
        locked = false
      }
    }
  },
  { flush: 'post' }
)

watch(
  () => props.initialIndex,
  () => {
    currentIndex.value = props.initialIndex || 0
    resetTransform()
  }
)

const onDialogClose = () => {
  if (props.isOpen) {
    emit('update:isOpen', false)
    resetTransform()
  }
  if (locked) {
    unlock()
    locked = false
  }
}

const onDialogClick = (e: MouseEvent) => {
  if (e.target === dialogRef.value) {
    emit('update:isOpen', false)
  }
}

const next = () => {
  slideDir.value = 'slide-next'
  resetTransform()
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  slideDir.value = 'slide-prev'
  resetTransform()
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

const getBounds = () => {
  if (!imageRef.value || !containerRef.value) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }
  const container = containerRef.value.getBoundingClientRect()
  const image = imageRef.value.getBoundingClientRect()
  const scaledWidth = image.width * scale.value
  const scaledHeight = image.height * scale.value
  const maxX = Math.max(0, (scaledWidth - container.width) / 2)
  const maxY = Math.max(0, (scaledHeight - container.height) / 2)
  return { minX: -maxX, maxX, minY: -maxY, maxY }
}

const constrainPosition = (x: number, y: number) => {
  if (scale.value <= 1) return { x: 0, y: 0 }
  const b = getBounds()
  return {
    x: Math.min(Math.max(x, b.minX), b.maxX),
    y: Math.min(Math.max(y, b.minY), b.maxY),
  }
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = -e.deltaY
  const zoomFactor = 0.2
  const newScale = scale.value + (delta > 0 ? zoomFactor : -zoomFactor)
  const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

  if (clampedScale !== scale.value) {
    const rect = containerRef.value?.getBoundingClientRect()
    if (!rect) return
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const scaleChange = clampedScale / scale.value
    const newPosition = {
      x: mouseX - (mouseX - position.x) * scaleChange,
      y: mouseY - (mouseY - position.y) * scaleChange,
    }
    const constrained = constrainPosition(newPosition.x, newPosition.y)
    position.x = constrained.x
    position.y = constrained.y
    scale.value = clampedScale
  }
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  dragStartTime.value = Date.now()
  const point = 'touches' in e ? e.touches[0] : e
  dragStart.x = point!.clientX - position.x
  dragStart.y = point!.clientY - position.y
  initialDragPosition.x = point!.clientX
  initialDragPosition.y = point!.clientY
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const point = 'touches' in e ? e.touches[0] : e
  if (scale.value <= 1) {
    position.x = point!.clientX - initialDragPosition.x
    return
  }
  const newPosition = {
    x: point!.clientX - dragStart.x,
    y: point!.clientY - dragStart.y,
  }
  const constrained = constrainPosition(newPosition.x, newPosition.y)
  position.x = constrained.x
  position.y = constrained.y
}

const stopDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const point =
    'touches' in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent)
  const deltaX = point!.clientX - initialDragPosition.x
  const deltaTime = Date.now() - dragStartTime.value
  const velocity = Math.abs(deltaX) / deltaTime

  if (scale.value <= 1 && Math.abs(deltaX) > SWIPE_THRESHOLD && velocity > 0.2) {
    if (deltaX > 0) prev()
    else next()
    position.x = 0
    position.y = 0
  }
  isDragging.value = false
}

const handleDoubleClickAt = (clientX: number, clientY: number) => {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  if (scale.value > MIN_SCALE) {
    resetTransform()
    return
  }
  const px = clientX - rect.left
  const py = clientY - rect.top
  scale.value = 2
  const constrained = constrainPosition(px - rect.width / 2, py - rect.height / 2)
  position.x = constrained.x
  position.y = constrained.y
}

const handleDoubleClick = (e: MouseEvent) =>
  handleDoubleClickAt(e.clientX, e.clientY)

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length >= 2) {
    isDragging.value = false
    isPinching.value = true
    const [t1, t2] = [e.touches[0]!, e.touches[1]!]
    lastTouchDistance.value = Math.hypot(
      t2.clientX - t1.clientX,
      t2.clientY - t1.clientY
    )
    lastTouch.x = (t1.clientX + t2.clientX) / 2
    lastTouch.y = (t1.clientY + t2.clientY) / 2
  } else if (e.touches.length === 1 && !isPinching.value) {
    startDrag(e)
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length >= 2 && isPinching.value) {
    const [t1, t2] = [e.touches[0]!, e.touches[1]!]
    const currentDistance = Math.hypot(
      t2.clientX - t1.clientX,
      t2.clientY - t1.clientY
    )
    const centerX = (t1.clientX + t2.clientX) / 2
    const centerY = (t1.clientY + t2.clientY) / 2
    const distRatio = currentDistance / (lastTouchDistance.value || 1)
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * distRatio))

    const rect = containerRef.value?.getBoundingClientRect()
    if (rect) {
      const ax = centerX - rect.left - rect.width / 2
      const ay = centerY - rect.top - rect.height / 2
      const sc = newScale / scale.value
      const zoomedX = ax - (ax - position.x) * sc
      const zoomedY = ay - (ay - position.y) * sc
      const dx = centerX - lastTouch.x
      const dy = centerY - lastTouch.y
      const constrained = constrainPosition(zoomedX + dx, zoomedY + dy)
      position.x = constrained.x
      position.y = constrained.y
    }
    scale.value = newScale
    lastTouchDistance.value = currentDistance
    lastTouch.x = centerX
    lastTouch.y = centerY
  } else if (e.touches.length === 1 && isDragging.value) {
    onDrag(e)
  }
}

const onTouchEnd = (e: TouchEvent) => {
  if (isPinching.value) {
    if (e.touches.length >= 2) return
    isPinching.value = false
    if (e.touches.length === 1) {
      const point = e.touches[0]!
      isDragging.value = true
      dragStartTime.value = Date.now()
      dragStart.x = point.clientX - position.x
      dragStart.y = point.clientY - position.y
      initialDragPosition.x = point.clientX
      initialDragPosition.y = point.clientY
    }
    return
  }

  stopDrag(e)

  if (e.touches.length !== 0) return
  const t = e.changedTouches[0]
  if (!t) return
  const movedDuringTap =
    Math.abs(t.clientX - initialDragPosition.x) > DOUBLE_TAP_PX ||
    Math.abs(t.clientY - initialDragPosition.y) > DOUBLE_TAP_PX
  if (movedDuringTap) {
    lastTapTime = 0
    return
  }
  const now = Date.now()
  if (
    now - lastTapTime < DOUBLE_TAP_MS &&
    Math.abs(t.clientX - lastTapX) < DOUBLE_TAP_PX &&
    Math.abs(t.clientY - lastTapY) < DOUBLE_TAP_PX
  ) {
    handleDoubleClickAt(t.clientX, t.clientY)
    lastTapTime = 0
  } else {
    lastTapTime = now
    lastTapX = t.clientX
    lastTapY = t.clientY
  }
}

// Image download with CORS-aware fallback (open in new tab when blocked).
const downloadImage = async () => {
  const url = currentImage.value
  if (!url) return
  const filename = url.split('/').pop() || 'image'

  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.warn(
      '[KunLightbox] direct download blocked (likely CORS), opening in new tab',
      error
    )
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const goToIndex = (i: number) => {
  if (i === currentIndex.value || i < 0 || i >= props.images.length) return
  slideDir.value = i > currentIndex.value ? 'slide-next' : 'slide-prev'
  resetTransform()
  currentIndex.value = i
}

const zoomPercent = computed(() => Math.round(scale.value * 100))

const onDialogKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

onUnmounted(() => {
  if (locked) unlock()
})
</script>

<template>
  <dialog
    ref="dialogRef"
    aria-label="图片查看器"
    class="kun-lightbox-dialog bg-transparent text-foreground p-0 m-0 max-w-none max-h-none w-screen h-screen overflow-hidden backdrop:bg-default-800/80"
    @close="onDialogClose"
    @click="onDialogClick"
    @keydown="onDialogKeydown"
  >
    <div v-if="isOpen" class="relative flex h-full w-full items-center justify-center">
      <div
        ref="containerRef"
        class="kun-lightbox-stage relative flex h-full w-full touch-none items-center justify-center overflow-hidden"
        @wheel.prevent="handleWheel"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart.passive="handleTouchStart"
        @touchmove.passive="handleTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
        @dblclick="handleDoubleClick"
      >
        <Transition :name="slideDir">
          <div
            :key="currentIndex"
            class="kun-lightbox-slide absolute inset-0 flex items-center justify-center"
          >
            <img
              ref="imageRef"
              :src="currentImage"
              :alt="currentAlt"
              class="kun-lightbox-image max-h-full max-w-full will-change-transform"
              :style="transformStyle"
              draggable="false"
              @click.stop
            />
          </div>
        </Transition>
      </div>

      <div
        v-if="images.length > 1"
        class="absolute top-4 left-4 z-50 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md"
        aria-live="polite"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <KunButton
        :is-icon-only="true"
        color="default"
        variant="light"
        size="lg"
        rounded="lg"
        aria-label="关闭"
        class-name="absolute top-4 right-4 z-50 bg-black/70 backdrop-blur-md border border-white/10 shadow-lg"
        @click.stop="emit('update:isOpen', false)"
      >
        <KunIcon name="lucide:x" class="text-white" />
      </KunButton>

      <template v-if="images.length > 1">
        <KunButton
          :is-icon-only="true"
          color="default"
          variant="light"
          size="xl"
          rounded="lg"
          aria-label="上一张"
          class-name="absolute left-4 top-1/2 z-50 hidden -translate-y-1/2 bg-black/70 backdrop-blur-md border border-white/10 shadow-lg md:flex"
          @click.stop="prev"
        >
          <KunIcon name="lucide:chevron-left" class="text-white" />
        </KunButton>
        <KunButton
          :is-icon-only="true"
          color="default"
          variant="light"
          size="xl"
          rounded="lg"
          aria-label="下一张"
          class-name="absolute right-4 top-1/2 z-50 hidden -translate-y-1/2 bg-black/70 backdrop-blur-md border border-white/10 shadow-lg md:flex"
          @click.stop="next"
        >
          <KunIcon name="lucide:chevron-right" class="text-white" />
        </KunButton>
      </template>

      <div
        class="pointer-events-none absolute right-0 bottom-6 left-0 z-50 flex flex-col items-center gap-2"
      >
        <div
          v-if="images.length > 1"
          class="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 shadow-lg backdrop-blur-md md:hidden"
        >
          <button
            v-for="(_, i) in images"
            :key="`dot-${i}`"
            type="button"
            :aria-label="`跳转到第 ${i + 1} 张`"
            :aria-current="i === currentIndex"
            class="size-2 rounded-full transition-colors"
            :class="i === currentIndex ? 'bg-primary-500' : 'bg-default-400/60 hover:bg-default-300'"
            @click.stop="goToIndex(i)"
          />
        </div>

        <div
          v-if="images.length > 1"
          class="pointer-events-auto hidden max-w-[80vw] items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-2 shadow-lg backdrop-blur-md md:flex"
        >
          <button
            v-for="(img, i) in images"
            :key="`thumb-${i}`"
            type="button"
            :aria-label="`跳转到第 ${i + 1} 张`"
            :aria-current="i === currentIndex"
            class="shrink-0 overflow-hidden rounded-md border-2 transition-all"
            :class="
              i === currentIndex
                ? 'border-primary-500 opacity-100'
                : 'border-transparent opacity-60 hover:opacity-100'
            "
            @click.stop="goToIndex(i)"
          >
            <img :src="img.src" :alt="img.alt ?? ''" class="size-14 object-cover" draggable="false" />
          </button>
        </div>

        <div
          class="kun-lightbox-toolbar pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 shadow-lg backdrop-blur-md"
          @click.stop
        >
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="缩小" @click="zoomOut">
            <KunIcon name="lucide:zoom-out" class="text-white" />
          </KunButton>
          <span class="min-w-[3.5rem] text-center text-sm font-medium tabular-nums text-white" aria-live="polite">
            {{ zoomPercent }}%
          </span>
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="放大" @click="zoomIn">
            <KunIcon name="lucide:zoom-in" class="text-white" />
          </KunButton>
          <span class="mx-1 h-5 w-px bg-default-200/30" aria-hidden="true" />
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="向左旋转 90°" @click="rotateLeft">
            <KunIcon name="lucide:rotate-ccw" class="text-white" />
          </KunButton>
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="向右旋转 90°" @click="rotateRight">
            <KunIcon name="lucide:rotate-cw" class="text-white" />
          </KunButton>
          <span class="mx-1 h-5 w-px bg-default-200/30" aria-hidden="true" />
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="重置缩放/旋转/位置" @click="resetTransform">
            <KunIcon name="lucide:refresh-ccw" class="text-white" />
          </KunButton>
          <KunButton :is-icon-only="true" color="default" variant="light" size="lg" rounded="full" aria-label="下载" @click="downloadImage">
            <KunIcon name="lucide:download" class="text-white" />
          </KunButton>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.kun-lightbox-image {
  view-transition-name: kun-lightbox-image;
}

.kun-lightbox-dialog::backdrop {
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(2px);
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
