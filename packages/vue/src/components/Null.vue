<script setup lang="ts">
import KunImageNative from './ImageNative.vue'
import { KUN_NULL_IMAGE } from '../assets/nullImage'
import type { KunNullProps } from './types'

// Empty-state placeholder. The default image is bundled (base64 data URI) —
// no network/CDN request, no consumer asset. Rendered as a plain <img>
// (KunImageNative) since a data URI needs no optimization pipeline. Override
// the image via `src`, or hide it entirely with `isShowSticker={false}`.
defineOptions({ name: 'KunNull' })

withDefaults(defineProps<KunNullProps>(), {
  description: '莲说这里什么都没有',
  isShowSticker: true,
  src: KUN_NULL_IMAGE,
})
</script>

<template>
  <div class="m-auto flex flex-col items-center gap-3">
    <KunImageNative
      v-if="isShowSticker"
      :src="src"
      class-name="w-72 h-auto rounded-2xl"
      alt="empty"
    />
    <span class="text-default-500">{{ description }}</span>
  </div>
</template>
