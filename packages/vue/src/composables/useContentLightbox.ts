import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

interface ImageItem {
  src: string
  alt?: string
}

// Makes every <img> inside a v-html prose container open in KunLightbox, via
// event delegation (so images added after mount — pagination / async render —
// still work; the <img> set is scanned live on each click). KunContent wires
// this internally. Framework-neutral DOM interaction.
export const useContentLightbox = (containerRef: Ref<HTMLElement | null>) => {
  const images = ref<ImageItem[]>([])
  const isLightboxOpen = ref(false)
  const currentImageIndex = ref(0)

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target || target.tagName !== 'IMG') return

    const container = containerRef.value
    if (!container) return

    const imgs = Array.from(container.querySelectorAll('img'))
    const index = imgs.indexOf(target as HTMLImageElement)
    if (index < 0) return

    // Clicking an image means "open the viewer", not "activate the
    // surrounding card / link" — stop bubbling to ancestor handlers.
    e.stopPropagation()
    e.preventDefault()

    images.value = imgs.map((img) => ({
      src: img.getAttribute('src') || img.src,
      alt: img.getAttribute('alt') || '',
    }))
    currentImageIndex.value = index
    isLightboxOpen.value = true
  }

  // Bind on the container (clicks on inner <img> bubble up); innerHTML
  // changes don't replace the container, so the listener survives swaps.
  onMounted(() => {
    containerRef.value?.addEventListener('click', onClick)
  })
  onBeforeUnmount(() => {
    containerRef.value?.removeEventListener('click', onClick)
  })

  return { images, isLightboxOpen, currentImageIndex }
}
