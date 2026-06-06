import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'

// 3-state image loading machine.
//   loading — bytes not in, or in but not yet decoded
//   loaded  — fully decoded and paintable (intrinsic size > 0)
//   error   — load failed, no src given, or src resolved to a zero-byte image
export type ImageLoadingStatus = 'loading' | 'loaded' | 'error'

type ImgRef =
  | HTMLImageElement
  | ComponentPublicInstance<unknown, unknown, unknown>
  | { $el?: Element }
  | null
  | undefined

const resolveEl = (v: ImgRef): HTMLImageElement | null => {
  if (!v) return null
  if (v instanceof HTMLImageElement) return v
  const el = (v as { $el?: Element }).$el
  return el instanceof HTMLImageElement ? el : null
}

// Adapted from shadcn/Radix `useImageLoadingStatus` (React). Two invariants
// preserved across the Vue port:
//
// 1) Cache-race fix — when `src` is in HTTP cache the browser may fire
//    `load` synchronously, before `@load` is wired, leaving a naive
//    `ref(false)` stuck and the skeleton pulsing over a painted image. We
//    re-read `.complete` on mount and after any `src` change (both moments
//    happen after the `<img>` exists, so cached state is observable).
//    Issue: radix-ui/primitives#2044.
// 2) Read status off the actually-rendered element (which may be a
//    `<NuxtImg>` negotiating IPX URL / srcset / format) — not a hidden
//    `new Image()` preloader that would double-fetch and report a
//    different URL's status.
//
// `imgEl` accepts a raw `<img>` ref or a component ref whose `$el` is an
// `<img>` (so `<NuxtImg>` / a wrapper works out of the box).
export const useImageLoadingStatus = (
  imgEl: Ref<ImgRef>,
  src: Ref<string | undefined>
) => {
  // Start in `loading` (not `error`) so SSR emits the skeleton layer; on
  // hydration syncFromDom corrects to `loaded` (cached) or leaves `loading`.
  const status = ref<ImageLoadingStatus>(src.value ? 'loading' : 'error')

  const syncFromDom = () => {
    if (!src.value) {
      status.value = 'error'
      return
    }
    const el = resolveEl(imgEl.value)
    if (!el) {
      // Ref not populated yet — the next syncFromDom call will catch up.
      return
    }
    if (!el.complete) {
      status.value = 'loading'
      return
    }
    // `.complete && naturalWidth === 0` = decode failure or broken img.
    status.value = el.naturalWidth === 0 ? 'error' : 'loaded'
  }

  onMounted(syncFromDom)

  watch(src, (next) => {
    status.value = next ? 'loading' : 'error'
    void nextTick(syncFromDom)
  })

  return {
    status: computed(() => status.value),
    onLoad: () => {
      status.value = 'loaded'
    },
    onError: () => {
      status.value = 'error'
    },
  }
}
