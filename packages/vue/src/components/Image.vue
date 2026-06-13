<script setup lang="ts">
import { computed, ref, watch, type ComponentPublicInstance } from 'vue'
import { cn } from '@kungal/ui-core'
import { useImageLoadingStatus } from '../composables/useImageLoadingStatus'
import { useKunUIConfig } from '../config/useKunUIConfig'
import type { KunImageProps } from './types'

// Nuxt-decoupled image. The framework-neutral value (skeleton 3-state
// cross-fade, aspect-ratio box, object-fit) lives here; the actual <img>
// element is `config.imageComponent` — native `<img>` by default, or an
// `@nuxt/image` <NuxtImg> wrapper injected by the Nuxt layer.
//
// The @nuxt/image-only optimization props (provider/format/quality/...) are
// forwarded ONLY when a component is injected; a native <img> gets just the
// standard HTML attributes (so we don't render junk attributes on it).
defineOptions({ name: 'KunImage' })

const props = withDefaults(defineProps<KunImageProps>(), {
  alt: 'image',
  fallbackSrc: undefined,
  // Lazy by default: most images (grids, lists, anything below the fold)
  // shouldn't all load eagerly at once and saturate the connection, starving
  // the above-the-fold ones. The aspect-ratio box + skeleton already reserve
  // space, so deferring causes no layout shift. Pass loading="eager" (and
  // fetchpriority="high") on the LCP / hero image to opt that one back in.
  loading: 'lazy',
  className: undefined,
  ariaLabel: undefined,
  width: undefined,
  height: undefined,
  skeleton: true,
  aspectRatio: undefined,
  objectFit: 'cover',
  imageClassName: undefined,
  decoding: undefined,
  fetchpriority: undefined,
  placeholder: undefined,
  format: undefined,
  quality: undefined,
  preload: undefined,
  provider: undefined,
  densities: undefined,
  sizes: undefined,
})

const config = useKunUIConfig()
const imageComponent = computed(() => config.imageComponent ?? 'img')
const isNative = computed(() => typeof imageComponent.value === 'string')

const imgEl = ref<ComponentPublicInstance | HTMLImageElement | null>(null)

// On load error, swap to `fallbackSrc` (once); reset when `src` changes.
const failed = ref(false)
const effectiveSrc = computed(() =>
  failed.value && props.fallbackSrc ? props.fallbackSrc : props.src
)
watch(
  () => props.src,
  () => (failed.value = false)
)

const srcRef = computed(() => effectiveSrc.value)
const { status, onLoad, onError } = useImageLoadingStatus(imgEl, srcRef)

const handleError = () => {
  onError()
  if (!failed.value && props.fallbackSrc) failed.value = true
}

// Standard HTML <img> attributes — safe on both native and injected.
const baseBindings = computed<Record<string, unknown>>(() => ({
  src: effectiveSrc.value,
  alt: props.alt,
  loading: props.loading,
  width: props.width,
  height: props.height,
  decoding: props.decoding,
  fetchpriority: props.fetchpriority,
  'aria-label': props.ariaLabel,
}))

// @nuxt/image-only props — added only when an image component is injected.
const imgBindings = computed<Record<string, unknown>>(() =>
  isNative.value
    ? baseBindings.value
    : {
        ...baseBindings.value,
        placeholder: props.placeholder,
        format: props.format,
        quality: props.quality,
        preload: props.preload,
        provider: props.provider,
        densities: props.densities,
        sizes: props.sizes,
      }
)

const objectFitClass = computed(() => {
  switch (props.objectFit) {
    case 'contain':
      return 'object-contain'
    case 'fill':
      return 'object-fill'
    case 'none':
      return 'object-none'
    case 'scale-down':
      return 'object-scale-down'
    case 'cover':
    default:
      return 'object-cover'
  }
})

const wrapperStyle = computed(() =>
  props.aspectRatio ? { aspectRatio: props.aspectRatio } : undefined
)

// skeleton off → bare element, no wrapper (pre-skeleton single-element DOM).
const wrap = computed(() => props.skeleton)
</script>

<template>
  <component
    :is="imageComponent"
    v-if="!wrap"
    v-bind="imgBindings"
    :class="cn(className, imageClassName)"
    @error="handleError"
  />
  <div
    v-else
    :class="
      cn(
        'relative overflow-hidden',
        aspectRatio ? 'block w-full' : 'inline-block',
        className
      )
    "
    :style="wrapperStyle"
  >
    <!-- Sibling skeleton layer: animates the OVERLAY (not the painted image)
         and sits behind transparent PNGs. Cross-fades out on `loaded`. -->
    <div
      v-if="status !== 'loaded'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 transition-opacity duration-300"
      :class="
        status === 'error'
          ? 'opacity-0'
          : 'bg-default-200 animate-pulse opacity-100'
      "
    />
    <component
      :is="imageComponent"
      ref="imgEl"
      v-bind="imgBindings"
      :class="
        cn(
          'block size-full transition-opacity duration-300',
          aspectRatio ? 'absolute inset-0' : '',
          objectFitClass,
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imageClassName
        )
      "
      @load="onLoad"
      @error="handleError"
    />
  </div>
</template>
