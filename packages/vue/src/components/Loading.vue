<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn, type KunUISize } from '@kungal/ui-core'
import KunImageNative from './ImageNative.vue'
import KunIcon from './Icon.vue'
import { KUN_LOADING_IMAGE } from '../assets/loadingImage'
import type { KunLoadingProps } from './types'

// Three modes:
//   default slot      → overlay spinner/image over the wrapped content
//   no slot           → standalone centered loader
//   spinner=true      → compact spinner icon instead of the mascot image
// Uses KunImageNative so the loading image is a plain <img>. The default image
// is bundled (base64 data URI) — no network/CDN request, no consumer asset.
// Announced to assistive tech via role="status" + aria-busy.
defineOptions({ name: 'KunLoading' })

const props = withDefaults(defineProps<KunLoadingProps>(), {
  loading: false,
  description: '正在摸鱼中...咕咕咕',
  src: KUN_LOADING_IMAGE,
  spinner: false,
  size: 'md',
})

const slots = useSlots()
const isWrapperMode = computed(() => !!slots.default)

const spinnerSize: Record<KunUISize, string> = {
  xs: 'size-4',
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
  xl: 'size-12',
}
</script>

<template>
  <div class="contents">
    <div v-if="isWrapperMode" class="relative min-h-24">
      <div :class="cn('transition-opacity', loading && 'opacity-50')">
        <slot />
      </div>

      <transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-0"
      >
        <div
          v-if="loading"
          class="bg-background/50 absolute inset-0 z-50 flex items-center justify-center rounded-lg"
          role="status"
          aria-live="polite"
          :aria-busy="loading"
        >
          <div class="flex flex-col items-center gap-3">
            <KunIcon
              v-if="spinner"
              name="svg-spinners:90-ring-with-bg"
              :class="cn('text-primary', spinnerSize[size])"
              aria-hidden="true"
            />
            <KunImageNative
              v-else
              alt=""
              aria-hidden="true"
              :src="src"
              class-name="w-80 h-auto rounded-lg"
            />
            <span :class="spinner ? 'text-default-600 text-sm' : 'info text-xl'">
              {{ description }}
            </span>
          </div>
        </div>
      </transition>
    </div>

    <div
      v-else
      class="m-auto flex flex-col items-center gap-3"
      role="status"
      aria-live="polite"
      :aria-busy="true"
    >
      <KunIcon
        v-if="spinner"
        name="svg-spinners:90-ring-with-bg"
        :class="cn('text-primary', spinnerSize[size])"
        aria-hidden="true"
      />
      <KunImageNative
        v-else
        alt=""
        aria-hidden="true"
        :src="src"
        class-name="w-80 h-auto rounded-lg"
      />
      <span :class="spinner ? 'text-default-600 text-sm' : 'info'">{{ description }}</span>
    </div>
  </div>
</template>

<style scoped>
.info {
  color: var(--color-white);
  text-shadow:
    0 1px var(--color-foreground),
    1px 0 var(--color-foreground),
    -1px 0 var(--color-foreground),
    0 -1px var(--color-foreground),
    1px 2px var(--color-foreground);
}
</style>
