<script setup lang="ts">
import { ref } from 'vue'

// ThumbHash 是一段 ~25 字节的紧凑哈希,通常由后端随图片元数据一起下发。
// KunImage 在客户端把它解码成一张极小的图,放大成「模糊占位」,真实图片加载完成后淡出。
// (这串 base64 即 banner.webp 的 ThumbHash。)
const thumbhash = 'eBeCA4AmyAaYeIcLy20KVwg3inaCelc='

// 重新挂载以再看一次「模糊 → 清晰」的过程(慢速网络下尤为明显)。
const key = ref(0)
const reload = () => (key.value += 1)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunImage
      :key="key"
      :src="`/banner.webp?${key}`"
      alt="ThumbHash 模糊占位示例"
      provider="none"
      aspect-ratio="16 / 9"
      :thumbhash="thumbhash"
      class-name="w-72 rounded-kun-lg"
    />
  </div>
</template>
