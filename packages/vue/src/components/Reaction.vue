<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { cn, kunTextClasses, type KunUIColor } from '@kungal/ui-core'
import KunIcon from './Icon.vue'
import type { KunReactionProps } from './types'

// A like / reaction control: a compact pill (icon + optional count), NOT a full
// padded text button — so it stays small. The like is a TOGGLE (`aria-pressed`),
// the icon fills + colours when active, and the whole thing animates on click:
// a bouncy pop, a one-shot burst (expanding ring + radiating sparks, on like
// only), and a count that rolls in the direction it changed. All pure CSS/Vue,
// no external library; everything is disabled under `prefers-reduced-motion`.
defineOptions({ name: 'KunReaction' })

const props = withDefaults(defineProps<KunReactionProps>(), {
  icon: 'lucide:heart',
  color: 'danger',
  toggle: true,
  size: 'md',
  disabled: false,
  disableAnimation: false,
  label: '点赞',
})

const active = defineModel<boolean>({ default: false })
const count = defineModel<number | undefined>('count', { default: undefined })
const emit = defineEmits<{ change: [active: boolean] }>()

const prefersReduced = ref(false)
onMounted(() => {
  prefersReduced.value =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
})
const animate = computed(() => !props.disableAnimation && !prefersReduced.value)

const popping = ref(false)
const bursting = ref(false)
const sparks = [0, 1, 2, 3, 4, 5]

// Number-roll direction: a higher count rolls up, a lower one rolls down.
const rollDir = ref<'up' | 'down'>('up')
watch(count, (n, o) => {
  if (typeof n === 'number' && typeof o === 'number') rollDir.value = n >= o ? 'up' : 'down'
})

const pop = () => {
  if (!animate.value) return
  // Restart the animation from frame 0 (off → next frame on).
  popping.value = false
  requestAnimationFrame(() => (popping.value = true))
}

const handleClick = () => {
  if (props.disabled) return
  if (!props.toggle) {
    // Action mode (share / more …): a tactile pop only — no pressed state, no
    // count change, no burst. The consumer handles it via a native @click.
    pop()
    return
  }
  const next = !active.value
  active.value = next
  if (typeof count.value === 'number') {
    count.value = Math.max(0, count.value + (next ? 1 : -1))
  }
  emit('change', next)
  pop()
  if (next && animate.value) {
    bursting.value = false
    requestAnimationFrame(() => (bursting.value = true))
  }
}

// "On" = the filled/coloured active skin, driven by `active` in BOTH modes. In
// toggle mode the click flips `active`; in action mode the CONSUMER controls it —
// e.g. a 收藏 button used as a KunPopover trigger, whose "collected" skin reflects
// membership in ≥1 list while the click opens the folder picker instead of self-
// toggling. Existing action-mode buttons (share / more …) pass no `active`, so it
// defaults false and their skin stays neutral exactly as before.
const isOn = computed(() => active.value)

const sizeMap = {
  sm: { btn: 'gap-1 px-1.5 py-0.5 text-xs', icon: '1rem' },
  md: { btn: 'gap-1.5 px-2 py-1 text-sm', icon: '1.15rem' },
  lg: { btn: 'gap-2 px-2.5 py-1.5 text-base', icon: '1.4rem' },
} as const
const sz = computed(() => sizeMap[props.size])

const accessibleName = computed(() =>
  typeof count.value === 'number' ? `${props.label},${count.value}` : props.label
)

// The active colour can be a palette key (→ a `text-*` class) or any CSS colour
// (→ inline `color`). Either way it becomes `currentColor`, which the icon fill,
// the burst ring (border-current) and the sparks (bg-current) all follow — so a
// brand colour works everywhere with zero extra plumbing.
const isPaletteColor = computed(() => props.color in kunTextClasses)
const activeColorStyle = computed(() =>
  isOn.value && !isPaletteColor.value ? { color: props.color } : undefined
)

const rootClasses = computed(() =>
  cn(
    'relative inline-flex items-center rounded-full transition-colors select-none',
    sz.value.btn,
    props.disabled
      ? 'cursor-not-allowed opacity-50'
      : cn('cursor-pointer hover:bg-default-100', isOn.value && 'hover:bg-default-100/60'),
    isOn.value
      ? isPaletteColor.value
        ? kunTextClasses[props.color as KunUIColor]
        : ''
      : 'text-default-500'
  )
)
</script>

<template>
  <button
    type="button"
    :class="rootClasses"
    :style="activeColorStyle"
    :aria-pressed="toggle ? active : undefined"
    :aria-label="$slots.default ? undefined : accessibleName"
    :disabled="disabled"
    @click="handleClick"
  >
    <span
      class="kun-reaction-fx relative inline-flex shrink-0"
      :class="popping && 'kun-reaction-pop'"
      :style="{ fontSize: sz.icon }"
      @animationend="popping = false"
    >
      <!-- Replace the whole glyph (emoji / image / per-state) via #icon. -->
      <slot name="icon" :active="isOn">
        <KunIcon
          :name="icon"
          :class="cn('transition-colors', isOn && 'fill-current')"
        />
      </slot>

      <!-- One-shot burst (on like): an expanding ring + radiating sparks. Both
           use currentColor, so they follow the active colour (palette or brand). -->
      <template v-if="bursting">
        <span
          aria-hidden="true"
          class="kun-reaction-ring border-2 border-current"
          @animationend="bursting = false"
        />
        <span
          v-for="n in sparks"
          :key="n"
          aria-hidden="true"
          class="kun-reaction-spark bg-current"
          :style="{ '--kun-spark-a': `${n * 60}deg` }"
        />
      </template>
    </span>

    <!-- Optional visible label (default slot), rendered INSIDE the button so
         clicking the text toggles too — and it inherits currentColor (the active
         colour when on). Omit it to keep the compact icon-(+count) reaction. -->
    <span v-if="$slots.default" class="whitespace-nowrap">
      <slot />
    </span>

    <!-- Count, rolling in the direction it changed. -->
    <span
      v-if="typeof count === 'number'"
      aria-hidden="true"
      class="kun-reaction-count relative inline-block overflow-hidden text-center leading-[1.2] tabular-nums"
    >
      <Transition :name="animate ? `kun-roll-${rollDir}` : ''">
        <span :key="count" class="block">{{ count }}</span>
      </Transition>
    </span>
  </button>
</template>

<style scoped>
/* Bouncy pop on the icon group. */
.kun-reaction-pop {
  animation: kun-reaction-pop 0.45s var(--ease-kun-standard, ease);
}
@keyframes kun-reaction-pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.35);
  }
  65% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* Expanding ring behind the icon. */
.kun-reaction-ring {
  position: absolute;
  inset: -2px;
  border-radius: 9999px;
  pointer-events: none;
  animation: kun-reaction-ring 0.5s ease-out forwards;
}
@keyframes kun-reaction-ring {
  0% {
    transform: scale(0.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Six dots radiating outward (placed via --kun-spark-a). */
.kun-reaction-spark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  pointer-events: none;
  animation: kun-reaction-spark 0.5s ease-out forwards;
}
@keyframes kun-reaction-spark {
  0% {
    transform: translate(-50%, -50%) rotate(var(--kun-spark-a)) translateY(-2px);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--kun-spark-a)) translateY(-15px);
    opacity: 0;
  }
}

/* Count roll: the leaving number is taken out of flow so the entering one
   occupies the (fixed-height) slot; they slide opposite ways. */
.kun-reaction-count :deep(.kun-roll-up-enter-active),
.kun-reaction-count :deep(.kun-roll-up-leave-active),
.kun-reaction-count :deep(.kun-roll-down-enter-active),
.kun-reaction-count :deep(.kun-roll-down-leave-active) {
  transition:
    transform 0.25s var(--ease-kun-standard, ease),
    opacity 0.25s ease;
}
.kun-reaction-count :deep(.kun-roll-up-leave-active),
.kun-reaction-count :deep(.kun-roll-down-leave-active) {
  position: absolute;
  inset: 0;
}
.kun-reaction-count :deep(.kun-roll-up-enter-from) {
  transform: translateY(100%);
  opacity: 0;
}
.kun-reaction-count :deep(.kun-roll-up-leave-to) {
  transform: translateY(-100%);
  opacity: 0;
}
.kun-reaction-count :deep(.kun-roll-down-enter-from) {
  transform: translateY(-100%);
  opacity: 0;
}
.kun-reaction-count :deep(.kun-roll-down-leave-to) {
  transform: translateY(100%);
  opacity: 0;
}
</style>
