<script setup lang="ts">
// 当 src 加载失败时，自动切换到 fallbackSrc。
// 这里故意用一个无法加载的地址触发回退。
const broken = 'https://invalid.kungal.example/not-found.png'
const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23e5e7eb"/><text x="200" y="160" font-size="28" fill="%236b7280" text-anchor="middle">回退图片</text></svg>'
)}`
</script>

<template>
  <KunImage
    :src="broken"
    :fallback-src="fallback"
    alt="加载失败回退"
    provider="none"
    aspect-ratio="4 / 3"
    class-name="w-56 rounded-kun-lg"
  />
</template>
