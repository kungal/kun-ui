<script setup lang="ts">
// 内联图片灯箱:KunContent 内任意 <img> 都会自动接入 KunLightbox,
// 点击图片即可放大查看(多张图片可左右切换),无需额外接线。
// 这里用离线 data-URI 图片,demo 不需要联网。
const swatch = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`
  )}`

const html = `<p>点击任意图片打开灯箱(可左右切换):</p><div style="display:flex;gap:8px;flex-wrap:wrap"><img src="${swatch('#7c3aed', '#ec4899')}" alt="渐变 1" style="width:120px;border-radius:8px" /><img src="${swatch('#0ea5e9', '#22c55e')}" alt="渐变 2" style="width:120px;border-radius:8px" /></div>`
</script>

<template>
  <KunContent :content="html" />
</template>
