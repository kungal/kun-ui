<script setup lang="ts">
import { ref } from 'vue'
import type { KunLightboxImage } from '@kungal/ui-vue'

// thumbhash 在原图加载完成前占住它自己的位置;带上 width / height,占位在解码前
// 就是原图的形状和大小。veiled 的图片在读者点「显示图片」之前不会请求 src,
// 只画 thumbhash 和 #veil 插槽,缩放、旋转、拖动和下载都不可用,翻页和关闭照常。
// reveal 只在本次打开期间有效;要记住它,在 @reveal 里把 veiled 改成 false。
const images = ref<KunLightboxImage[]>([
  {
    src: '/banner.webp',
    alt: 'KunUI banner',
    thumbhash: 'eBeCA4AmyAaYeIcLy20KVwg3inaCelc=',
    width: 1920,
    height: 1080,
  },
  {
    src: '/kungalgame.webp',
    alt: 'KunGalgame',
    thumbhash: '+AcGDIKp5qefZ3h/loaPRvkqcg==',
    width: 1920,
    height: 1080,
    veiled: true,
  },
])

const isOpen = ref(false)
const initialIndex = ref(0)

const openAt = (i: number) => {
  initialIndex.value = i
  isOpen.value = true
}

const onReveal = (index: number) => {
  images.value[index] = { ...images.value[index]!, veiled: false }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunButton color="primary" @click="openAt(0)">打开查看器</KunButton>
    <KunButton variant="bordered" @click="openAt(1)">打开遮罩的图片</KunButton>
  </div>

  <KunLightbox
    v-model:is-open="isOpen"
    :images="images"
    :initial-index="initialIndex"
    @reveal="onReveal"
  />
</template>
