<script setup lang="ts">
import { ref } from 'vue'

const base = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>'
)}`

// `skeleton` 默认开启：图片加载完成前显示脉冲骨架占位。
// 点击按钮重新挂载组件以重新触发一次加载过程。
const key = ref(0)
const reload = () => (key.value += 1)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunImage
      :key="key"
      :src="`${base}#${key}`"
      alt="骨架屏示例"
      provider="none"
      aspect-ratio="4 / 3"
      :skeleton="true"
      class-name="w-56 rounded-kun-lg"
    />
  </div>
</template>
