<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunMessageType } from '../composables/useKunMessage'

// Internal toast item rendered by <KunMessageProvider>. Decoupled: explicit
// imports (vue / @kungal/ui-core / sibling KunIcon) instead of Nuxt auto-imports.
defineOptions({ name: 'KunMessageItem' })

const { t } = useKunLocale()

const props = defineProps<{
  id: string
  message: string
  type: KunMessageType
  duration: number
  richText?: boolean
  count: number
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const isRichText = computed(() => props.richText ?? false)
const cssDuration = computed(() => `${props.duration}ms`)

// error / warn interrupt (assertive); info / success are polite.
const isUrgent = computed(() => props.type === 'error' || props.type === 'warn')

// Swipe-to-dismiss (mainly touch): drag horizontally; past the threshold the
// toast carries on the way it was thrown and fades, otherwise it snaps back.
const SWIPE_DISMISS_PX = 80
const SWIPE_EXIT =
  'transform var(--kun-dur-exit, 180ms) var(--ease-kun-in, ease-in), opacity var(--kun-dur-exit, 180ms) var(--ease-kun-in, ease-in)'
const dragX = ref(0)
const dragging = ref(false)
const exitDirection = ref(0)
let startX = 0
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const dragStyle = computed(() => {
  if (exitDirection.value !== 0) {
    return {
      transform: `translateX(calc(${dragX.value}px + ${exitDirection.value * 100}%))`,
      opacity: '0',
      transition: prefersReducedMotion() ? 'none' : SWIPE_EXIT,
    }
  }
  return dragX.value !== 0
    ? {
        transform: `translateX(${dragX.value}px)`,
        opacity: String(Math.max(0, 1 - Math.abs(dragX.value) / 200)),
        transition: 'none',
      }
    : {}
})

const onPointerDown = (e: PointerEvent) => {
  // Ignore drags that start on the close button.
  if ((e.target as HTMLElement).closest('[data-kun-toast-close]')) return
  dragging.value = true
  startX = e.clientX
  syncTimer()
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value) return
  dragX.value = e.clientX - startX
}
const onPointerUp = () => {
  if (!dragging.value) return
  dragging.value = false
  if (Math.abs(dragX.value) > SWIPE_DISMISS_PX) {
    exitDirection.value = Math.sign(dragX.value)
    // The provider unmounts this item in the flush that removes it, discarding
    // any render still queued here. Emitted at once, the exit style never
    // reached the DOM: the leave transition read the drag's `transition: none`
    // and the toast vanished where it was released, 48 ms later.
    nextTick(() => emit('remove', props.id))
  } else {
    dragX.value = 0
    syncTimer()
  }
}

// `ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout` so this carries
// no @types/node dependency — it runs in the browser.
let timer: ReturnType<typeof setTimeout> | null = null
const timerRunning = ref(false)
const remainingTime = ref(props.duration)
const startTime = ref(0)
let hovered = false

// Idempotent: syncTimer runs on every enter, leave, press and release, so one
// gesture reaches pause or resume more than once (mouseenter + pointerdown both
// pause). Without the `!timer` / `timer` guards pause would run twice — each
// subtracting `Date.now() - startTime` against the SAME startTime — so
// `remainingTime` is debited twice and the toast dismisses early.
const pauseTimer = () => {
  if (props.duration <= 0 || !timer) return
  clearTimeout(timer)
  timer = null
  timerRunning.value = false
  remainingTime.value -= Date.now() - startTime.value
}

const resumeTimer = () => {
  if (props.duration <= 0 || timer) return
  startTime.value = Date.now()
  timerRunning.value = true
  timer = setTimeout(() => emit('remove', props.id), remainingTime.value)
}

// The countdown runs only while no mouse rests on the toast and no pointer is
// pressed on it. Resuming on pointerup alone restarted it under a mouse that
// had just clicked the toast, and a repeat of the toast restarted it likewise.
const syncTimer = () =>
  hovered || dragging.value || exitDirection.value !== 0
    ? pauseTimer()
    : resumeTimer()

const onMouseEnter = () => {
  hovered = true
  syncTimer()
}
const onMouseLeave = () => {
  hovered = false
  syncTimer()
}

onMounted(syncTimer)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

watch(
  () => props.count,
  () => {
    if (timer) clearTimeout(timer)
    timer = null // null it so the idempotent syncTimer below re-arms
    timerRunning.value = false
    remainingTime.value = props.duration
    syncTimer()
  },
  { flush: 'post' }
)

const typeStyles = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        bg: 'bg-success-50 dark:bg-success-50/90',
        text: 'text-success-800',
        icon: 'text-success-500',
        progress: 'bg-success-400',
        ring: 'ring-success/50',
        countBg: 'bg-success/10',
        iconName: 'lucide:circle-check',
      }
    case 'error':
      return {
        bg: 'bg-danger-50 dark:bg-danger-50/90',
        text: 'text-danger-800',
        icon: 'text-danger-500',
        progress: 'bg-danger-400',
        ring: 'ring-danger/50',
        countBg: 'bg-danger/10',
        iconName: 'lucide:circle-x',
      }
    case 'warn':
      return {
        bg: 'bg-warning-50 dark:bg-warning-50/90',
        text: 'text-warning-800',
        icon: 'text-warning-500',
        progress: 'bg-warning-400',
        ring: 'ring-warning/50',
        countBg: 'bg-warning/10',
        iconName: 'lucide:triangle-alert',
      }
    case 'info':
    default:
      return {
        bg: 'bg-primary-50 dark:bg-primary-50/90',
        text: 'text-primary-800',
        icon: 'text-primary-500',
        progress: 'bg-primary-400',
        ring: 'ring-primary/50',
        countBg: 'bg-primary/10',
        iconName: 'lucide:info',
      }
  }
})
</script>

<template>
  <div
    :role="isUrgent ? 'alert' : 'status'"
    :aria-live="isUrgent ? 'assertive' : 'polite'"
    aria-atomic="true"
    :class="
      cn(
        'group relative mb-3 flex w-full touch-pan-y items-center overflow-hidden rounded-kun-lg p-4 shadow-kun-md ring-1 transition-all duration-kun-slow',
        typeStyles.bg,
        typeStyles.text,
        typeStyles.ring
      )
    "
    :style="dragStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <KunIcon
      :name="typeStyles.iconName"
      data-kun-toast-icon
      :class="cn('mt-0.5 mr-3 h-6 w-6 flex-shrink-0', typeStyles.icon)"
    />

    <div class="flex-1 text-sm font-medium">
      <span v-if="!isRichText">{{ message }}</span>
      <!-- richText: caller-supplied HTML. Must be trusted/sanitized — see
           the note on useKunMessage(). -->
      <div v-else v-html="message" />
    </div>

    <span
      v-if="count > 1"
      :class="
        cn(
          'ml-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
          typeStyles.countBg
        )
      "
    >
      {{ count }}
    </span>

    <button
      type="button"
      data-kun-toast-close
      :aria-label="t('message.close')"
      class="ml-2 flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition hover:bg-black/10 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:bg-white/10"
      @click="emit('remove', id)"
    >
      <KunIcon name="lucide:x" class="size-4" />
    </button>

    <div
      :key="count"
      class="progress-bar absolute bottom-0 left-0 h-1 w-full origin-left"
      :class="typeStyles.progress"
      :style="{ animationPlayState: timerRunning ? 'running' : 'paused' }"
    />
  </div>
</template>

<style scoped>
/* base.css gives every element the foreground color, so the toast's own color
   has to be inherited explicitly. The type icon is left out: its shade is a
   utility class, which this unlayered rule used to override. */
:deep(:not([data-kun-toast-icon])) {
  color: inherit;
}

/* scaleX from the left = same visual as width 100%→0%, but on the compositor.
   linear is correct here — it's a constant-rate countdown. */
@keyframes shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.progress-bar {
  animation: shrink v-bind(cssDuration) linear forwards;
}
</style>
