<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@kungal/ui-core'
import { useSpoilerContent } from '../composables/useSpoilerContent'
import { useContentLightbox } from '../composables/useContentLightbox'
import KunLightbox from './Lightbox.vue'
import type { KunContentProps } from './types'

// Rich prose renderer for trusted HTML: click-to-reveal spoilers + inline-
// image lightbox, wired in for free.
//
// IMPORTANT: `content` is rendered with v-html and is NOT sanitized by KunUI
// (SSR-side sanitization is problematic — see docs/architecture.md). The
// CALLER must pass trusted / already-sanitized HTML. Never pass raw user
// input here.
defineOptions({ name: 'KunContent' })

withDefaults(defineProps<KunContentProps>(), { className: '', compact: false })

const articleRef = ref<HTMLElement | null>(null)

useSpoilerContent(articleRef)
const { isLightboxOpen, images, currentImageIndex } =
  useContentLightbox(articleRef)
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html — trusted HTML, see note above -->
    <article
      ref="articleRef"
      :class="cn('kun-prose', compact && 'kun-prose-compact', className)"
      v-html="content"
    />
    <KunLightbox
      v-model:is-open="isLightboxOpen"
      :images="images"
      :initial-index="currentImageIndex"
    />
  </div>
</template>

<style scoped>
.kun-prose {
  & :deep(img) {
    cursor: zoom-in;
  }

  /* Spoiler shell — a positioned, clipped box so the noise overlay can fill it.
     The covered/revealed state is driven entirely by the `kun-spoiler-hidden`
     class present in the (server-rendered) HTML — no JS needed to hide. */
  & :deep(.kun-spoiler) {
    position: relative;
    display: inline-block;
    /* No rounded corners — the cover stays rectangular so it lines up with the
       browser's text-selection highlight (which is always rectangular). */
    overflow: hidden;
    vertical-align: middle;
    transition: color var(--kun-dur-base) var(--ease-kun-standard);
  }

  & :deep(div.kun-spoiler) {
    display: block;
    width: fit-content;
  }

  /* Covered: text (and any child) goes transparent; a light tint marks the
     region. This is the cover-of-record — pure CSS, present in the SSR HTML, so
     the secret is hidden on first paint and with JS disabled. The drifting
     particle canvas (.kun-spoiler-canvas) is layered on top by JS as a pure
     client-side enhancement. */
  & :deep(.kun-spoiler-hidden) {
    cursor: pointer;
    color: transparent !important;
    user-select: none;
    background-color: rgb(150 150 150 / 0.18);
  }
  /* Hide element children (e.g. images) without hiding the particle canvas. */
  & :deep(.kun-spoiler-hidden > :not(.kun-spoiler-canvas)) {
    visibility: hidden;
  }

  & :deep(.kun-spoiler-hidden:hover) {
    background-color: rgb(150 150 150 / 0.26);
  }

  /* Once the per-word particle canvas is live it draws its own tint inside each
     word/line rect, so drop the block-wide tint — the gaps (spaces, ragged line
     ends) must stay clear. The block tint above remains the pre-JS / image-only
     fallback. */
  & :deep(.kun-spoiler-hidden.kun-spoiler-live),
  & :deep(.kun-spoiler-hidden.kun-spoiler-live:hover) {
    background-color: transparent;
  }
}
</style>
