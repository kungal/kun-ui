<script setup lang="ts">
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- aspectRatio 让图片在加载前就占据固定比例的空间，避免布局抖动。 -->
  <div class="flex flex-wrap items-start gap-4">
    <KunImage
      :src="img"
      alt="16:9"
      provider="none"
      aspect-ratio="16 / 9"
      class-name="w-56 rounded-kun-lg"
    />
    <KunImage
      :src="img"
      alt="1:1"
      provider="none"
      aspect-ratio="1 / 1"
      class-name="w-40 rounded-kun-lg"
    />
  </div>
</template>
