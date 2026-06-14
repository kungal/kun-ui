<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunMessageType } from '../composables/useKunMessage'

// Internal toast item rendered by <KunMessageProvider>. Decoupled: explicit
// imports (vue / @kungal/ui-core / sibling KunIcon) instead of Nuxt auto-imports.
defineOptions({ name: 'KunMessageItem' })

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
const progressBarRef = ref<HTMLDivElement | null>(null)

// error / warn interrupt (assertive); info / success are polite.
const isUrgent = computed(() => props.type === 'error' || props.type === 'warn')

// Swipe-to-dismiss (mainly touch): drag horizontally; past the threshold the
// toast is removed, otherwise it snaps back.
const SWIPE_DISMISS_PX = 80
const dragX = ref(0)
const dragging = ref(false)
let startX = 0
const dragStyle = computed(() =>
  dragX.value !== 0
    ? {
        transform: `translateX(${dragX.value}px)`,
        opacity: String(Math.max(0, 1 - Math.abs(dragX.value) / 200)),
        transition: dragging.value ? 'none' : 'transform 0.2s, opacity 0.2s',
      }
    : {}
)

const onPointerDown = (e: PointerEvent) => {
  // Ignore drags that start on the close button.
  if ((e.target as HTMLElement).closest('[data-kun-toast-close]')) return
  dragging.value = true
  startX = e.clientX
  pauseTimer()
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
    emit('remove', props.id)
  } else {
    dragX.value = 0
    resumeTimer()
  }
}

// `ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout` so this carries
// no @types/node dependency — it runs in the browser.
let timer: ReturnType<typeof setTimeout> | null = null
const remainingTime = ref(props.duration)
const startTime = ref(0)

// Idempotent: pause/resume are each wired to multiple events (mouseenter +
// pointerdown both pause; mouseleave + pointerup both resume). Without the
// `!timer` / `timer` guards a single gesture would fire pause twice — each
// subtracting `Date.now() - startTime` against the SAME startTime — so
// `remainingTime` is debited twice and the toast dismisses early.
const pauseTimer = () => {
  if (props.duration <= 0 || !timer) return
  clearTimeout(timer)
  timer = null
  if (progressBarRef.value) {
    progressBarRef.value.style.animationPlayState = 'paused'
  }
  remainingTime.value -= Date.now() - startTime.value
}

const resumeTimer = () => {
  if (props.duration <= 0 || timer) return
  startTime.value = Date.now()
  if (progressBarRef.value) {
    progressBarRef.value.style.animationPlayState = 'running'
  }
  timer = setTimeout(() => emit('remove', props.id), remainingTime.value)
}

onMounted(() => {
  if (props.duration > 0) {
    resumeTimer()
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

watch(
  () => props.count,
  () => {
    if (timer) clearTimeout(timer)
    timer = null // null it so the idempotent resumeTimer below re-arms
    remainingTime.value = props.duration
    resumeTimer()
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
        iconName: 'lucide:circle-check',
      }
    case 'error':
      return {
        bg: 'bg-danger-50 dark:bg-danger-50/90',
        text: 'text-danger-800',
        icon: 'text-danger-500',
        progress: 'bg-danger-400',
        iconName: 'lucide:circle-x',
      }
    case 'warn':
      return {
        bg: 'bg-warning-50 dark:bg-warning-50/90',
        text: 'text-warning-800',
        icon: 'text-warning-500',
        progress: 'bg-warning-400',
        iconName: 'lucide:triangle-alert',
      }
    case 'info':
    default:
      return {
        bg: 'bg-primary-50 dark:bg-primary-50/90',
        text: 'text-primary-800',
        icon: 'text-primary-500',
        progress: 'bg-primary-400',
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
        'group relative mb-3 flex w-full touch-pan-y items-center overflow-hidden rounded-kun-lg p-4 shadow-lg ring-1 ring-black/5 transition-all duration-300 dark:ring-white/10',
        typeStyles.bg,
        typeStyles.text
      )
    "
    :style="dragStyle"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <KunIcon
      :name="typeStyles.iconName"
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
      class="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs font-bold dark:bg-white/10"
    >
      {{ count }}
    </span>

    <button
      type="button"
      data-kun-toast-close
      aria-label="关闭"
      class="ml-2 flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition hover:bg-black/10 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:bg-white/10"
      @click="emit('remove', id)"
    >
      <KunIcon name="lucide:x" class="size-4" />
    </button>

    <div
      ref="progressBarRef"
      :key="count"
      class="progress-bar absolute bottom-0 left-0 h-1 w-full origin-left"
      :class="typeStyles.progress"
    />
  </div>
</template>

<style scoped>
:deep(*) {
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
  animation-play-state: running;
}
</style>
