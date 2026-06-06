<script setup lang="ts">
import { inject, onUnmounted, reactive, watchEffect } from 'vue'
import { KunLightboxGalleryKey } from './LightboxGallery.vue'

// Registers itself with the nearest <KunLightboxGallery> so a click opens the
// shared lightbox at this item's current position. Two modes: auto-wrap
// (default) or render-prop via `v-slot="{ open }"` + `:wrap="false"`.
defineOptions({ name: 'KunLightboxGalleryItem' })

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    as?: string
    wrap?: boolean
  }>(),
  { as: 'span', wrap: true }
)

const ctx = inject(KunLightboxGalleryKey)
if (!ctx) {
  throw new Error('KunLightboxGalleryItem must be a child of <KunLightboxGallery>.')
}

const id = Symbol('KunLightboxGalleryItem')
const item = reactive({ id, src: props.src, alt: props.alt })

watchEffect(() => {
  item.src = props.src
  item.alt = props.alt
})

const unregister = ctx.register(item)
onUnmounted(unregister)

const open = () => ctx.open(item)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open()
  }
}
</script>

<template>
  <component
    :is="as"
    v-if="wrap"
    role="button"
    tabindex="0"
    :aria-label="alt || '查看大图'"
    class="cursor-zoom-in"
    @click="open"
    @keydown="onKeydown"
  >
    <slot :open="open" />
  </component>

  <slot v-else :open="open" />
</template>
