<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@kungal/ui-core'
import KunImageNative from './ImageNative.vue'
import { KUN_LOADING_IMAGE } from '../assets/loadingImage'
import type { KunLoadingProps } from './types'

// Two modes: with default slot → overlay spinner over the wrapped content;
// without → standalone centered loader. Uses KunImageNative so the loading
// image is a plain <img> (no optimization pipeline needed). The default image
// is bundled (base64 data URI) — no network/CDN request, no consumer asset.
defineOptions({ name: 'KunLoading' })

const props = withDefaults(defineProps<KunLoadingProps>(), {
  loading: false,
  description: '正在摸鱼中...咕咕咕',
  src: KUN_LOADING_IMAGE,
})

const slots = useSlots()
const isWrapperMode = computed(() => !!slots.default)
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
        >
          <div class="flex flex-col items-center gap-3">
            <KunImageNative
              alt="loading"
              :src="src"
              class-name="w-72 h-auto rounded-lg"
            />
            <span class="info text-xl">{{ description }}</span>
          </div>
        </div>
      </transition>
    </div>

    <div v-else class="m-auto flex flex-col items-center gap-3">
      <KunImageNative
        alt="loading"
        :src="src"
        class-name="w-72 h-auto rounded-lg"
      />
      <span class="info">{{ description }}</span>
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
