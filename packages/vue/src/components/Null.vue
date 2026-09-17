<script setup lang="ts">
import KunImageNative from './ImageNative.vue'
import { KUN_NULL_IMAGE } from '../assets/nullImage'
import { useKunLocale } from '../locale/useKunLocale'
import type { KunNullProps } from './types'

// Empty-state placeholder. The default image is bundled (base64 data URI) —
// no network/CDN request, no consumer asset. Rendered as a plain <img>
// (KunImageNative) since a data URI needs no optimization pipeline. Override
// the image via `src`, or hide it entirely with `isShowSticker={false}`.
defineOptions({ name: 'KunNull' })

const { t } = useKunLocale()

withDefaults(defineProps<KunNullProps>(), {
  isShowSticker: true,
  src: KUN_NULL_IMAGE,
})
</script>

<template>
  <div class="m-auto flex flex-col items-center gap-3">
    <!-- Decorative: the text below says it. With alt="empty", screen readers
         announced an English "empty" before it in every locale. -->
    <KunImageNative
      v-if="isShowSticker"
      :src="src"
      class-name="w-72 h-auto rounded-kun-lg"
      alt=""
    />
    <span class="text-default-500">{{ description ?? t('null.description') }}</span>
  </div>
</template>
