<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useEventListener, useMediaQuery } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { cn, kunRoundedClasses } from '@kungal/ui-core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { useKunOverlayZIndex } from '../composables/useKunOverlayZIndex'
import { useKunBackgroundInert } from '../composables/useKunBackgroundInert'
import { useKunUniqueId } from '../composables/useKunUniqueId'
import KunButton from './Button.vue'
import KunIcon from './Icon.vue'
import type {
  KunDrawerPlacement,
  KunDrawerProps,
  KunDrawerSize,
} from './types'

// Nuxt-decoupled Drawer (modal mechanics: scroll-lock + focus-trap + Esc).
// Responsive: below md it becomes a bottom sheet by default.
defineOptions({ name: 'KunDrawer' })

const props = withDefaults(defineProps<KunDrawerProps>(), {
  placement: 'right',
  responsive: true,
  size: 'md',
  title: '',
  isDismissable: true,
  isShowCloseButton: true,
  withContainer: true,
  rounded: undefined,
  className: '',
  innerClassName: '',
})

// Match Tailwind's md breakpoint. Below it the drawer becomes a bottom
// sheet by default — the "right on desktop, bottom on mobile" pattern.
const isMobile = useMediaQuery('(max-width: 47.99rem)')

const effectivePlacement = computed<KunDrawerPlacement>(() =>
  props.responsive && isMobile.value ? 'bottom' : props.placement
)

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const modelValue = defineModel<boolean>({ required: true })

const emits = defineEmits<{
  close: []
}>()

const kunUniqueId = useKunUniqueId('kun-drawer')
const titleId = computed(() => `${kunUniqueId.value}-title`)

// Geometry — static lookup maps keep the Tailwind JIT happy.
const widthClassMap: Record<KunDrawerSize, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[40rem]',
  full: 'w-full',
}
const heightClassMap: Record<KunDrawerSize, string> = {
  sm: 'h-80',
  md: 'h-96',
  lg: 'h-[32rem]',
  xl: 'h-[40rem]',
  full: 'h-full',
}
const placementAnchorMap: Record<KunDrawerPlacement, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
}
// Round only the corners on the side opposite the anchored edge.
const placementRoundedSideMap: Record<KunDrawerPlacement, string> = {
  left: 'rounded-r-kun-lg',
  right: 'rounded-l-kun-lg',
  top: 'rounded-b-kun-lg',
  bottom: 'rounded-t-kun-lg',
}

const panelGeometry = computed(() => {
  const placement = effectivePlacement.value
  const isHorizontal = placement === 'left' || placement === 'right'
  const sizeClass = isHorizontal
    ? widthClassMap[props.size]
    : heightClassMap[props.size]
  return [
    'absolute',
    placementAnchorMap[placement],
    sizeClass,
    props.size === 'full' ? '' : placementRoundedSideMap[placement],
  ]
    .filter(Boolean)
    .join(' ')
})

const transitionName = computed(() => `kun-drawer-${effectivePlacement.value}`)

// Modal mechanics — refcounted body scroll-lock + focus-trap + Escape.
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

// Claim a fresh z-index on open so the most-recently-opened overlay always
// wins the stack, regardless of template/DOM order (see useKunOverlayZIndex).
// `claimed` keeps claim/release symmetric across modelValue toggles.
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

// Mark the page background `inert` while open (stronger than aria-modal alone).
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

const trapEl = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(trapEl, {
  immediate: false,
  escapeDeactivates: false,
  allowOutsideClick: true,
  returnFocusOnDeactivate: true,
})

const handleClose = () => {
  if (props.isDismissable) {
    modelValue.value = false
    emits('close')
  }
}

// Close button always closes (isDismissable controls backdrop + Esc only).
const handleCloseButton = () => {
  modelValue.value = false
  emits('close')
}

useEventListener('keydown', (e: KeyboardEvent) => {
  // Only the topmost overlay reacts to Escape (see useKunOverlayZIndex).
  if (e.key === 'Escape' && modelValue.value && isTopmost.value) handleClose()
})

watch(modelValue, async (v) => {
  applyLock(v)
  applyZIndex(v)
  if (v) {
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
    <Transition :name="transitionName">
      <div
        v-if="modelValue"
        ref="trapEl"
        data-kun-overlay
        :class="cn('z-kun-modal fixed inset-0', className)"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        tabindex="0"
      >
        <!-- Backdrop — separate from panel so the slide doesn't fight the
             backdrop fade. -->
        <div
          class="bg-default-800/70 dark:bg-background/70 absolute inset-0 transition-opacity"
          @click="handleClose"
        />

        <div
          :class="
            cn(
              'bg-content1 flex flex-col border shadow-2xl',
              panelGeometry,
              innerClassName,
              size === 'full' ? roundedClass : ''
            )
          "
          @click.stop
        >
          <header
            v-if="title || $slots.header || isShowCloseButton"
            class="border-kun flex items-center justify-between border-b px-6 py-4"
          >
            <div class="flex min-w-0 flex-1 items-center gap-2">
              <h2
                v-if="title"
                :id="titleId"
                class="text-foreground truncate text-lg font-semibold"
              >
                {{ title }}
              </h2>
              <slot name="header" />
            </div>

            <KunButton
              v-if="isShowCloseButton"
              color="default"
              variant="light"
              size="sm"
              rounded="full"
              :is-icon-only="true"
              aria-label="关闭抽屉"
              class-name="shrink-0"
              @click="handleCloseButton"
            >
              <KunIcon name="lucide:x" />
            </KunButton>
          </header>

          <div
            v-if="withContainer"
            class="scrollbar-hide flex-1 overflow-y-auto p-6"
          >
            <slot />
          </div>
          <slot v-else />

          <footer
            v-if="$slots.footer"
            class="border-kun border-t px-6 py-4"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop fades; panel slides. Enter and leave share durations so the two
   finish together; exits run shorter. Panel uses the snappy emphasized settle,
   backdrop a plain decelerate. */
.kun-drawer-left-enter-active,
.kun-drawer-right-enter-active,
.kun-drawer-top-enter-active,
.kun-drawer-bottom-enter-active {
  transition: opacity var(--kun-dur-base) var(--ease-kun-out);
}
.kun-drawer-left-leave-active,
.kun-drawer-right-leave-active,
.kun-drawer-top-leave-active,
.kun-drawer-bottom-leave-active {
  transition: opacity var(--kun-dur-exit) var(--ease-kun-in);
}

.kun-drawer-left-enter-active > div:last-child,
.kun-drawer-right-enter-active > div:last-child,
.kun-drawer-top-enter-active > div:last-child,
.kun-drawer-bottom-enter-active > div:last-child {
  transition: transform var(--kun-dur-base) var(--ease-kun-emphasized);
}
.kun-drawer-left-leave-active > div:last-child,
.kun-drawer-right-leave-active > div:last-child,
.kun-drawer-top-leave-active > div:last-child,
.kun-drawer-bottom-leave-active > div:last-child {
  transition: transform var(--kun-dur-exit) var(--ease-kun-in);
}

.kun-drawer-left-enter-from,
.kun-drawer-left-leave-to {
  opacity: 0;
}
.kun-drawer-left-enter-from > div:last-child,
.kun-drawer-left-leave-to > div:last-child {
  transform: translateX(-100%);
}

.kun-drawer-right-enter-from,
.kun-drawer-right-leave-to {
  opacity: 0;
}
.kun-drawer-right-enter-from > div:last-child,
.kun-drawer-right-leave-to > div:last-child {
  transform: translateX(100%);
}

.kun-drawer-top-enter-from,
.kun-drawer-top-leave-to {
  opacity: 0;
}
.kun-drawer-top-enter-from > div:last-child,
.kun-drawer-top-leave-to > div:last-child {
  transform: translateY(-100%);
}

.kun-drawer-bottom-enter-from,
.kun-drawer-bottom-leave-to {
  opacity: 0;
}
.kun-drawer-bottom-enter-from > div:last-child,
.kun-drawer-bottom-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
