<script setup lang="ts">
import { ref } from 'vue'

// 独立用法:不依赖画廊,直接受控 KunLightbox。传入 images 数组,用
// v-model:is-open 控制开关,initialIndex 决定打开时定位到第几张。
const colors = ['0ea5e9', 'f97316', '8b5cf6']
const images = colors.map((c, i) => ({
  src: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23${c}"/></svg>`
  )}`,
  alt: `Slide ${i + 1}`,
}))

const isOpen = ref(false)
const initialIndex = ref(0)

const openAt = (i: number) => {
  initialIndex.value = i
  isOpen.value = true
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunButton color="primary" @click="openAt(0)">打开查看器</KunButton>
    <KunButton variant="bordered" @click="openAt(2)">从第 3 张打开</KunButton>
  </div>

  <KunLightbox
    v-model:is-open="isOpen"
    :images="images"
    :initial-index="initialIndex"
  />
</template>
