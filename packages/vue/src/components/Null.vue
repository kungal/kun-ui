<script setup lang="ts">
import { computed } from 'vue'
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

const props = withDefaults(defineProps<KunNullProps>(), {
  isShowSticker: true,
})

// The bundled sticker's box is reserved before it decodes: with `w-72 h-auto`
// alone the <img> is 0px tall until then, and its growth to 192px measured
// CLS 0.12–0.16 on a letmoe profile page. Resolved here, not as a
// withDefaults default, because telling the default apart from a consumer's
// src then takes a second reference to KUN_NULL_IMAGE, and the bundler
// inlined a second 30 KB copy of the data URI for it.
const sticker = computed(() =>
  props.src === undefined
    ? { src: KUN_NULL_IMAGE, style: { aspectRatio: 'auto 500 / 333' } }
    : { src: props.src, style: undefined }
)
</script>

<template>
  <div class="m-auto flex flex-col items-center gap-3">
    <!-- Decorative: the text below says it. With alt="empty", screen readers
         announced an English "empty" before it in every locale. -->
    <KunImageNative
      v-if="isShowSticker"
      :src="sticker.src"
      :style="sticker.style"
      class-name="w-72 h-auto rounded-kun-lg"
      alt=""
    />
    <span class="text-foreground-muted">{{ description ?? t('null.description') }}</span>
  </div>
</template>
