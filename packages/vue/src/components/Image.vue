<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { thumbHashToDataURL } from 'thumbhash'
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
  thumbhash: undefined,
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

// `src` is the reliable payload; `event` is the native DOM event when there is
// one. The cache-race path below reaches `loaded` / `error` by re-reading the
// DOM rather than by a fired event, so it has no event to forward — hence
// optional. Emitting `src` (rather than only the event) also lets a listener
// tell an original-image failure from a `fallbackSrc` failure.
const emit = defineEmits<{
  load: [src: string, event?: Event]
  error: [src: string, event?: Event]
}>()

const config = useKunUIConfig()
const imageComponent = computed(() => config.imageComponent ?? 'img')
const isNative = computed(() => typeof imageComponent.value === 'string')

const imgEl = ref<ComponentPublicInstance | HTMLImageElement | null>(null)

// A single failure can be observed twice — once as a fired `@error`, once as
// the cache-race path flipping `status` — so each outcome is announced at most
// once per src. Tracked by src (not a boolean) because `fallbackSrc` is a
// second, separately-reportable attempt after the original one fails.
let reportedLoadSrc: string | undefined
let reportedErrorSrc: string | undefined

// On load error, swap to `fallbackSrc` (once); reset when `src` changes.
const failed = ref(false)
const effectiveSrc = computed(() =>
  failed.value && props.fallbackSrc ? props.fallbackSrc : props.src
)
watch(
  () => props.src,
  () => {
    failed.value = false
    reportedLoadSrc = undefined
    reportedErrorSrc = undefined
  }
)

const srcRef = computed(() => effectiveSrc.value)
const { status, onLoad, onError } = useImageLoadingStatus(imgEl, srcRef)

const reportLoad = (src: string, event?: Event) => {
  if (!src || reportedLoadSrc === src) return
  reportedLoadSrc = src
  emit('load', src, event)
}

const reportError = (src: string, event?: Event) => {
  if (!src || reportedErrorSrc === src) return
  reportedErrorSrc = src
  emit('error', src, event)
}

// Report BEFORE handing the status machine the outcome: the watcher below runs
// synchronously off that status change and would otherwise win the dedup and
// drop the DOM event we have here.
const handleLoad = (event?: Event) => {
  reportLoad(effectiveSrc.value, event)
  onLoad()
}

const handleError = (event?: Event) => {
  reportError(effectiveSrc.value, event)
  onError()
}

// Single settlement point for BOTH routes into a terminal status: a fired
// @load / @error, and the cache-race path where syncFromDom settles a src that
// was already complete in cache and no event ever fires. The `reported*` guards
// make it a no-op for whichever route already announced this src.
//
// `flush: 'sync'` is load-bearing, not a micro-optimization. `effectiveSrc`
// swaps to `fallbackSrc` the instant we mark the original failed, so a deferred
// watcher would wake up holding the NEW src while reporting the OLD src's
// failure — emitting a bogus `error` for a fallback that loads perfectly well.
// Running synchronously keeps status and src describing the same attempt.
watch(
  status,
  (s) => {
    if (s === 'error') {
      reportError(effectiveSrc.value)
      // Swap to the fallback (once). Kept here rather than in `handleError` so
      // a cache-race failure — which never fires @error — swaps too.
      if (!failed.value && props.fallbackSrc) failed.value = true
    } else if (s === 'loaded') {
      reportLoad(effectiveSrc.value)
    }
  },
  { flush: 'sync' }
)

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

// ── ThumbHash blur-up placeholder ────────────────────────────────────────────
// Decode the (base64) ThumbHash to a tiny data-URL image, upscaled by `bg-cover`
// into a smooth blurred placeholder shown until the real image loads. Decoded
// SYNCHRONOUSLY on mount / prop change so the blur is ready before a fast (cached
// CDN) image can finish loading — a lazy import would lose that race and the blur
// would never show. Invalid hash → no blur (the pulse skeleton covers it). The
// decode uses a canvas, so it only runs on the client (onMounted / watch).
const thumbUrl = ref<string | null>(null)
const decodeThumb = (hash?: string) => {
  if (!hash) {
    thumbUrl.value = null
    return
  }
  try {
    thumbUrl.value = thumbHashToDataURL(Uint8Array.from(atob(hash), (c) => c.charCodeAt(0)))
  } catch {
    thumbUrl.value = null
  }
}
onMounted(() => decodeThumb(props.thumbhash))
watch(() => props.thumbhash, (h) => decodeThumb(h))

// skeleton off → bare element, no wrapper. A thumbhash also needs the wrapper.
const wrap = computed(() => props.skeleton || !!props.thumbhash)
</script>

<template>
  <component
    :is="imageComponent"
    v-if="!wrap"
    ref="imgEl"
    v-bind="imgBindings"
    :class="cn(className, imageClassName)"
    @load="handleLoad"
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
    <!-- ThumbHash blur-up: the decoded placeholder, upscaled by bg-cover. Cross-
         fades out on load; until it decodes the pulse skeleton below shows. -->
    <div
      v-if="status !== 'loaded' && thumbUrl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-kun-slow"
      :class="status === 'error' ? 'opacity-0' : 'opacity-100'"
      :style="{ backgroundImage: `url(${thumbUrl})` }"
    />
    <!-- Sibling skeleton layer: animates the OVERLAY (not the painted image)
         and sits behind transparent PNGs. Cross-fades out on `loaded`. -->
    <div
      v-else-if="status !== 'loaded' && (skeleton || thumbhash)"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 transition-opacity duration-kun-slow"
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
          'block size-full transition-opacity duration-kun-slow',
          aspectRatio ? 'absolute inset-0' : '',
          objectFitClass,
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imageClassName
        )
      "
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>
