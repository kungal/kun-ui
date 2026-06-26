<script setup lang="ts">
// 最常见的 ACGN 场景:点击打碎一张图片。每个碎片携带它对应的那一块图像切片飞散。
// 直接克隆真实 DOM,无需 canvas 截图,也没有跨域 taint 问题。
</script>

<template>
  <KunShatter
    trigger="click"
    :pieces="30"
    :auto-restore="1400"
    keep-space
    class="cursor-pointer"
  >
    <img
      src="/kungalgame.webp"
      alt="kungalgame"
      width="288"
      height="180"
      draggable="false"
      class="rounded-kun-lg h-[180px] w-72 select-none object-cover shadow-lg"
    />
  </KunShatter>
</template>
