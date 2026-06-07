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

withDefaults(defineProps<KunContentProps>(), { className: '' })

const articleRef = ref<HTMLElement | null>(null)

useSpoilerContent(articleRef)
const { isLightboxOpen, images, currentImageIndex } =
  useContentLightbox(articleRef)
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html — trusted HTML, see note above -->
    <article ref="articleRef" :class="cn('kun-prose', className)" v-html="content" />
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

  & :deep(.kun-spoiler) {
    position: relative;
    display: inline-block;
    border-radius: 0.5rem;
    overflow: hidden;
    vertical-align: middle;

    & .spoiler-frost {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: rgb(150, 150, 150);
      border-radius: inherit;
      transform: translateZ(0);
      z-index: 5;
    }

    & > *:not(.spoiler-canvas) {
      transition: filter 0.3s ease-in-out;
      filter: blur(0);
    }

    & .spoiler-canvas {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
      background-color: rgba(150, 150, 150, 0.1);

      &.fade-out {
        opacity: 0;
      }
    }
  }

  & :deep(.kun-spoiler.kun-spoiler-hidden) {
    cursor: pointer;

    & > *:not(.spoiler-canvas) {
      filter: blur(52px);
      user-select: none;
    }
  }

  & :deep(div.kun-spoiler) {
    display: block;
    width: fit-content;
  }
}
</style>
