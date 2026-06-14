<script setup lang="ts">
// Offline-safe inline SVG data URI so the demo renders with no network.
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- provider="none" → a plain <img> with no @nuxt/image optimization. -->
  <KunImage
    :src="img"
    alt="示例图片"
    provider="none"
    :width="240"
    :height="180"
    class-name="rounded-kun-lg"
  />
</template>
