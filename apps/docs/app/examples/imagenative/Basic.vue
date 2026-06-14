<script setup lang="ts">
// KunImageNative 是一个最简的原生 <img> 包装，不含骨架屏 / 优化逻辑。
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="240" height="240" rx="24" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <KunImageNative :src="img" alt="原生图片" :width="120" :height="120" />
</template>
