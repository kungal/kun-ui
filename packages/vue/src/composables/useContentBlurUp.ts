import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { thumbHashToDataURL } from 'thumbhash'

// Blur-up for body images inside a v-html prose container: any
// `<img data-thumbhash="…">` gets its decoded ThumbHash painted as the image's
// OWN background, which shows behind the (not-yet-loaded) replaced content and is
// cleared once the real image paints over it.
//
// Why a background instead of a wrapper: it's zero DOM restructuring — we only set
// an inline style on the existing <img>, so it coexists with the lightbox / spoiler
// passes and never disturbs prose layout. The flip side: the blur is only visible
// if the <img> already reserves space (width/height attributes), which is exactly
// the same backend metadata that ships the hash — so the two travel together.
//
// KunContent wires this internally; exported so apps building their own prose
// renderer can reuse it. Client-only. The hash is decoded SYNCHRONOUSLY so the blur
// is painted in the same tick as the scan — a lazy `import('thumbhash')` would lose
// the race to a fast/cached image (it finishes during the import, and then there's
// no point painting a blur over an already-shown image).
export const useContentBlurUp = (containerRef: Ref<HTMLElement | null>) => {
  const done = new WeakSet<HTMLImageElement>()
  let observer: MutationObserver | null = null
  let queued = false

  const apply = (img: HTMLImageElement) => {
    if (done.has(img)) return
    done.add(img)
    const hash = img.getAttribute('data-thumbhash')
    // Skip if there's no hash, or the image already loaded — its `load` won't fire
    // again, so we'd have no moment to clear the blur back off.
    if (!hash || (img.complete && img.naturalWidth > 0)) return
    try {
      img.style.backgroundImage = `url(${thumbHashToDataURL(Uint8Array.from(atob(hash), (c) => c.charCodeAt(0)))})`
      img.style.backgroundSize = 'cover'
      img.style.backgroundPosition = 'center'
      const clear = () => {
        img.style.backgroundImage = ''
        img.removeEventListener('load', clear)
        img.removeEventListener('error', clear)
      }
      img.addEventListener('load', clear)
      img.addEventListener('error', clear)
    } catch {
      /* invalid hash → no blur; the image just loads normally */
    }
  }

  const scan = () => {
    queued = false
    containerRef.value?.querySelectorAll<HTMLImageElement>('img[data-thumbhash]').forEach(apply)
  }
  // Coalesce a burst of mutations (a v-html swap is one big record) into one scan.
  const schedule = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(scan)
  }

  onMounted(() => {
    const root = containerRef.value
    if (!root) return
    scan() // initial pass
    // Re-scan when the prose changes (v-html swap, async pagination append) — the
    // observer watches childList only, so setting/clearing our own styles can't
    // retrigger it.
    observer = new MutationObserver(schedule)
    observer.observe(root, { childList: true, subtree: true })
  })
  onBeforeUnmount(() => observer?.disconnect())
}
