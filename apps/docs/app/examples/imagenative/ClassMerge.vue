<script setup lang="ts">
// 通过 className 自定义样式（圆形、边框、阴影等），className 会被合并到 <img> 上。
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunImageNative
      :src="img"
      alt="圆形"
      class-name="size-20 rounded-full ring-2 ring-primary"
    />
    <KunImageNative
      :src="img"
      alt="圆角阴影"
      class-name="size-20 rounded-kun-lg shadow-lg"
    />
  </div>
</template>
