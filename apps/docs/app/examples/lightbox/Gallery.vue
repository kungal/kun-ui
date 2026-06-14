<script setup lang="ts">
// 多张缩略图组成画廊：每个 KunLightboxGalleryItem 点击后打开共享的
// Lightbox,并定位到该项;在大图中可用 ←/→、缩略图条切换上一张/下一张。
// 离线安全的内联 SVG data URI 作为图片源。
const colors = ['7c3aed', '22c55e', 'f59e0b', 'ef4444', '0ea5e9', 'ec4899']
const imgs = colors.map(
  (c) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23${c}"/></svg>`
    )}`
)
</script>

<template>
  <KunLightboxGallery>
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
      <KunLightboxGalleryItem
        v-for="(src, i) in imgs"
        :key="i"
        :src="src"
        :alt="`Photo ${i + 1}`"
      >
        <img
          :src="src"
          class="aspect-square w-full cursor-zoom-in rounded-lg object-cover"
          alt=""
        />
      </KunLightboxGalleryItem>
    </div>
  </KunLightboxGallery>
</template>
