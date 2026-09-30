<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import { cn, resolveKunSplitSize } from '@kungal/ui-core'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import { useKunLocale } from '../locale/useKunLocale'
import { lockDocumentForDrag, unlockDocumentForDrag } from '../utils/dragDocumentLock'
import type { KunSplitPaneProps } from './types'

// Two panes with a draggable divider. The width is a prop the server knows, so
// the SSR HTML already has the layout; persisting it (a cookie read back into
// the prop) is the app's job. Stacking is a container query on this
// component's own width, so a split nested in a side column stacks by the room
// it has, not by the window.
defineOptions({ name: 'KunSplitPane' })

const props = withDefaults(defineProps<KunSplitPaneProps>(), {
  primary: 'start',
  minSize: 240,
  maxSize: 480,
  snapPoints: () => [],
  snapThreshold: 8,
  step: 10,
  stackBelow: 'md',
  showPane: 'start',
  ariaLabel: undefined,
})

/** Width of the primary pane in px. Updated on every pointer move while
 *  dragging; persist from `resize-end`. */
const size = defineModel<number>('size', { default: 360 })

const emit = defineEmits<{
  /** A drag or a key press finished with this width — the one to persist. */
  'resize-end': [size: number]
}>()

defineSlots<{
  /** The left pane. */
  start?: () => unknown
  /** The right pane. */
  end?: () => unknown
}>()

const { t } = useKunLocale()
const uid = useKunUniqueId('kun-split-')

const lo = computed(() => Math.min(props.minSize, props.maxSize))
const hi = computed(() => Math.max(props.minSize, props.maxSize))
const shownSize = computed(() => Math.round(Math.min(Math.max(size.value, lo.value), hi.value)))
const resolve = (raw: number, from?: number) =>
  resolveKunSplitSize(raw, {
    min: props.minSize,
    max: props.maxSize,
    snapPoints: props.snapPoints,
    snapThreshold: props.snapThreshold,
    from,
  })

const dragging = ref(false)
let pointerId: number | null = null
let startX = 0
let startSize = 0

const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0 || pointerId !== null) return
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  pointerId = e.pointerId
  startX = e.clientX
  startSize = shownSize.value
  dragging.value = true
  lockDocumentForDrag('col-resize')
}

const onPointerMove = (e: PointerEvent) => {
  if (e.pointerId !== pointerId) return
  const delta = (e.clientX - startX) * (props.primary === 'start' ? 1 : -1)
  const next = resolve(startSize + delta)
  if (next !== size.value) size.value = next
}

const endDrag = (e?: PointerEvent) => {
  if (pointerId === null || (e && e.pointerId !== pointerId)) return
  pointerId = null
  dragging.value = false
  unlockDocumentForDrag()
  if (shownSize.value !== startSize) emit('resize-end', shownSize.value)
}

onBeforeUnmount(() => {
  if (pointerId === null) return
  pointerId = null
  unlockDocumentForDrag()
})

const onKeydown = (e: KeyboardEvent) => {
  const current = shownSize.value
  const grow = props.primary === 'start' ? 'ArrowRight' : 'ArrowLeft'
  const shrink = props.primary === 'start' ? 'ArrowLeft' : 'ArrowRight'
  const step = props.step * (e.shiftKey ? 5 : 1)
  let next: number
  if (e.key === grow) next = resolve(current + step, current)
  else if (e.key === shrink) next = resolve(current - step, current)
  else if (e.key === 'Home') next = lo.value
  else if (e.key === 'End') next = hi.value
  else return
  e.preventDefault()
  if (next === current) return
  size.value = next
  emit('resize-end', next)
}

const primaryId = computed(() => `${uid.value}-${props.primary}`)

const paneStyle = (pane: 'start' | 'end'): CSSProperties => ({
  ...(pane === props.primary
    ? { flex: '0 0 auto', width: `${shownSize.value}px` }
    : { flex: '1 1 0%' }),
  // An iframe under the pointer takes the moves (react-resizable-panels #340).
  ...(dragging.value ? { pointerEvents: 'none' } : {}),
})
</script>

<template>
  <div class="kun-split-pane h-full min-h-0 w-full" :style="{ containerType: 'inline-size', containerName: 'kun-split' }">
    <div
      class="kun-split-pane__layout"
      :data-stack="stackBelow || undefined"
      :data-show="showPane"
    >
      <div :id="`${uid}-start`" class="kun-split-pane__pane kun-split-pane__start" :style="paneStyle('start')">
        <slot name="start" />
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        :aria-valuenow="shownSize"
        :aria-valuemin="lo"
        :aria-valuemax="hi"
        :aria-controls="primaryId"
        :aria-label="ariaLabel ?? t('splitPane.handle')"
        :data-dragging="dragging || undefined"
        :class="
          cn(
            'kun-split-pane__handle bg-default/20 cursor-col-resize outline-none transition-colors',
            'hover:bg-primary/60 focus-visible:bg-primary focus-visible:ring-primary/40 focus-visible:ring-2 data-[dragging]:bg-primary'
          )
        "
        :style="{ touchAction: 'none' }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @lostpointercapture="endDrag"
        @keydown="onKeydown"
      />
      <div :id="`${uid}-end`" class="kun-split-pane__pane kun-split-pane__end" :style="paneStyle('end')">
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.kun-split-pane__layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.kun-split-pane__pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
/* Above the panes' positioned content: KunChatLayout's message rows are
   `relative` and came later in the tree, so they took the grab area. */
.kun-split-pane__handle {
  position: relative;
  z-index: 1;
  flex: 0 0 1px;
  width: 1px;
}
/* The line is 1px; the grab area is 9px on a mouse and 21px on a finger,
   reaching over both panes' edges. */
.kun-split-pane__handle::after {
  content: '';
  position: absolute;
  inset: 0 -4px;
}
@media (pointer: coarse) {
  .kun-split-pane__handle::after {
    inset: 0 -10px;
  }
}

/* Inline widths are overridden while stacked, hence !important. */
@container kun-split (width < 48rem) {
  .kun-split-pane__layout[data-stack='md'] > .kun-split-pane__handle {
    display: none;
  }
  .kun-split-pane__layout[data-stack='md'] > .kun-split-pane__pane {
    flex: 1 1 auto !important;
    width: 100% !important;
  }
  .kun-split-pane__layout[data-stack='md'][data-show='start'] > .kun-split-pane__end,
  .kun-split-pane__layout[data-stack='md'][data-show='end'] > .kun-split-pane__start {
    display: none;
  }
}
@container kun-split (width < 64rem) {
  .kun-split-pane__layout[data-stack='lg'] > .kun-split-pane__handle {
    display: none;
  }
  .kun-split-pane__layout[data-stack='lg'] > .kun-split-pane__pane {
    flex: 1 1 auto !important;
    width: 100% !important;
  }
  .kun-split-pane__layout[data-stack='lg'][data-show='start'] > .kun-split-pane__end,
  .kun-split-pane__layout[data-stack='lg'][data-show='end'] > .kun-split-pane__start {
    display: none;
  }
}
</style>
