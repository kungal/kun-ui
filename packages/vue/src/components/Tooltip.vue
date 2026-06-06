<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
} from '@floating-ui/vue'
import { cn, kunRoundedClasses } from '@kungal/core'
import { useResolvedRounded } from '../composables/useResolvedRounded'
import type { KunTooltipProps } from './types'

// Nuxt-decoupled Tooltip — explicit imports (vue / @floating-ui/vue /
// @kungal/core). No Nuxt coupling in the original; this just swaps auto-
// imports for explicit ones.
defineOptions({ name: 'KunTooltip' })

const props = withDefaults(defineProps<KunTooltipProps>(), {
  text: '',
  position: 'top',
  className: '',
  delayShow: 100,
  delayHide: 0,
  hideOnMobile: true,
  rounded: undefined,
})

const rounded = useResolvedRounded(() => props.rounded)
const roundedClass = computed(() => kunRoundedClasses[rounded.value])

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const placement = computed<Placement>(() => props.position)

const { floatingStyles } = useFloating(triggerRef, tooltipRef, {
  placement,
  open: isVisible,
  whileElementsMounted: autoUpdate,
  middleware: [offset(8), flip(), shift({ padding: 8 })],
})

const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const show = () => {
  clearTimers()
  if (props.delayShow > 0) {
    showTimer = setTimeout(() => (isVisible.value = true), props.delayShow)
  } else {
    isVisible.value = true
  }
}

const hide = () => {
  clearTimers()
  if (props.delayHide > 0) {
    hideTimer = setTimeout(() => (isVisible.value = false), props.delayHide)
  } else {
    isVisible.value = false
  }
}
</script>

<template>
  <div
    ref="triggerRef"
    :class="cn('relative inline-block', className)"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot />

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVisible"
          ref="tooltipRef"
          role="tooltip"
          :class="
            cn(
              'bg-content1 border-default-200 z-kun-popover border px-3 py-2 text-sm font-medium whitespace-nowrap shadow-md',
              roundedClass,
              hideOnMobile && 'hidden sm:block'
            )
          "
          :style="floatingStyles"
        >
          <slot name="content">{{ text }}</slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
