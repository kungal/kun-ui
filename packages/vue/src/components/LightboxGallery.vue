<script lang="ts">
import type { InjectionKey } from 'vue'

// Shape registered by each <KunLightboxGalleryItem>. `id` is a per-item
// Symbol so two items with identical src/alt stay distinguishable.
export interface RegisteredItem {
  id: symbol
  src: string
  alt?: string
}

export interface GalleryContext {
  register: (item: RegisteredItem) => () => void
  open: (item: RegisteredItem) => void
}

// Exported from the SFC itself so the injection key lives with the Gallery.
export const KunLightboxGalleryKey: InjectionKey<GalleryContext> = Symbol(
  'KunLightboxGallery'
)
</script>

<script setup lang="ts">
import { provide, ref } from 'vue'
import KunLightbox from './Lightbox.vue'

// Declarative wrapper: child <KunLightboxGalleryItem>s register on mount;
// clicking any item opens the single shared lightbox at that item's current
// index. Items auto-deregister on unmount; src/alt changes stay in sync.
defineOptions({ name: 'KunLightboxGallery' })

const items = ref<RegisteredItem[]>([])
const isOpen = ref(false)
const initialIndex = ref(0)

const register = (item: RegisteredItem) => {
  items.value.push(item)
  return () => {
    const i = items.value.findIndex((x) => x.id === item.id)
    if (i >= 0) items.value.splice(i, 1)
  }
}

const open = (item: RegisteredItem) => {
  const i = items.value.findIndex((x) => x.id === item.id)
  if (i < 0) return
  initialIndex.value = i
  isOpen.value = true
}

provide(KunLightboxGalleryKey, { register, open })
</script>

<template>
  <!-- display:contents — the Gallery is a logical group, not a layout box. -->
  <div class="contents">
    <slot />
  </div>

  <KunLightbox v-model:is-open="isOpen" :images="items" :initial-index="initialIndex" />
</template>
