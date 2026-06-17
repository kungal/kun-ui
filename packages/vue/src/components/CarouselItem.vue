<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@kungal/ui-core'
import { KUN_CAROUSEL } from '../composables/carouselContext'
import type { KunCarouselItemProps } from './types'

// One slide. Must live inside <KunCarousel>; it sizes itself from the carousel's
// slidesPerView / gap and snaps to the start. Content is arbitrary (image, card…).
defineOptions({ name: 'KunCarouselItem' })

withDefaults(defineProps<KunCarouselItemProps>(), { className: '' })

const ctx = inject(KUN_CAROUSEL, null)

const basis = computed(() => {
  const n = ctx?.slidesPerView.value ?? 1
  const g = ctx?.gap.value ?? '0px'
  return n <= 1 ? '100%' : `calc((100% - ${n - 1} * ${g}) / ${n})`
})
</script>

<template>
  <li
    :class="cn('shrink-0 snap-start', className)"
    :style="{ flexBasis: basis }"
    aria-roledescription="slide"
  >
    <slot />
  </li>
</template>
