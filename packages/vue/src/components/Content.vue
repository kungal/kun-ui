<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@kungal/ui-core'
import { useSpoilerContent } from '../composables/useSpoilerContent'
import { useContentLightbox } from '../composables/useContentLightbox'
import { useContentBlurUp } from '../composables/useContentBlurUp'
import KunLightbox from './Lightbox.vue'
import type { KunContentProps } from './types'

// Rich prose renderer for trusted HTML: click-to-reveal spoilers + inline-
// image lightbox, wired in for free.
//
// IMPORTANT: `content` is rendered with v-html and is NOT sanitized by KunUI —
// by design, not an oversight. A library-side sanitizer would have to run in the
// SSR render, where DOMPurify needs a server DOM (jsdom) that leaks memory badly
// under sustained load — so KunUI ships none (see docs/architecture.md). The
// CALLER must pass trusted HTML, sanitized server-side at write time. Never pass
// raw user input here.
defineOptions({ name: 'KunContent' })

withDefaults(defineProps<KunContentProps>(), { className: '', compact: false })

const articleRef = ref<HTMLElement | null>(null)

useSpoilerContent(articleRef)
useContentBlurUp(articleRef)
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

  /* Spoiler shell. The covered/revealed state is driven entirely by the
     `kun-spoiler-hidden` class present in the (server-rendered) HTML — no JS
     needed to hide. A REVEALED spoiler must leave no trace, so everything that
     affects layout lives in the state rules below; only the reveal transition
     is unconditional. */
  & :deep(.kun-spoiler) {
    transition: color var(--kun-dur-base) var(--ease-kun-standard);
  }

  /* Cover box — needed while the cover is up (`-hidden`) and while the particle
     canvas dissolves after reveal (`-live`, dropped by destroyField in the same
     breath as the canvas). It has to be a block box: the canvas is sized from
     clientWidth/clientHeight — 0 on a non-replaced inline box — and positioned
     against this element, whose containing block would otherwise be stitched
     from the first and last inline fragments and cover only the first line.

     Deliberately NO `overflow` and NO `vertical-align`. `overflow` was here to
     clip a `border-radius` that's since been dropped (the cover stays
     rectangular so it lines up with the browser's text-selection highlight),
     and any non-`visible` overflow moves an inline-block's baseline to its
     bottom margin edge (CSS 2.1 §10.8.1) — which is what `vertical-align:
     middle` was compensating for. Without either, the cover sits exactly on the
     surrounding text's baseline. Nothing needs clipping: the canvas is sized to
     the element and children are hidden with `visibility`. */
  & :deep(.kun-spoiler-hidden),
  & :deep(.kun-spoiler-live) {
    position: relative;
    display: inline-block;
  }

  /* Block-level spoiler (a whole <div> of paragraphs): shrink-wrapped so the
     mask doesn't stretch past the text, and `flow-root` for a BFC that keeps
     the child <p> margins *inside* the covered box — without the clipping and
     scroll-container side effects `overflow: hidden` would drag along. */
  & :deep(div.kun-spoiler-hidden),
  & :deep(div.kun-spoiler-live) {
    display: flow-root;
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
