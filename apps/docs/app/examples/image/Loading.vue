<script setup lang="ts">
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ec4899"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <!-- loading="eager" 用于首屏 / LCP 图片，立即加载；
       loading="lazy"（默认）用于折叠以下的图片，进入视口才加载。 -->
  <div class="flex flex-wrap items-start gap-4">
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="eager"
        provider="none"
        loading="eager"
        fetchpriority="high"
        aspect-ratio="4 / 3"
        class-name="w-44 rounded-kun-lg"
      />
      <span class="text-default-500 text-sm">eager（即时）</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <KunImage
        :src="img"
        alt="lazy"
        provider="none"
        loading="lazy"
        aspect-ratio="4 / 3"
        class-name="w-44 rounded-kun-lg"
      />
      <span class="text-default-500 text-sm">lazy（懒加载，默认）</span>
    </div>
  </div>
</template>
