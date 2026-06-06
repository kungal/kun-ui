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
  description: '请填满这只萝莉吧, 因为这里空空如也',
  isShowSticker: true,
  src: KUN_NULL_IMAGE,
})
</script>

<template>
  <div class="m-auto flex flex-col items-center gap-3">
    <KunImageNative
      v-if="isShowSticker"
      :src="src"
      class-name="w-60 h-auto rounded-2xl"
      alt="empty"
    />
    <span class="text-default-500">{{ description }}</span>
  </div>
</template>
