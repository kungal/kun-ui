# Lightbox (灯箱)

> 图片灯箱,可用画廊容器 + 项,或独立使用。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// Wrap thumbnails in KunLightboxGallery; each KunLightboxGalleryItem opens the
// shared lightbox on click (the gallery manages the Lightbox for you).
const imgs = ['7c3aed', '22c55e', 'f59e0b'].map(
  (c) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="%23${c}"/></svg>`
    )}`
)
</script>

<template>
  <KunLightboxGallery>
    <div class="flex gap-3">
      <KunLightboxGalleryItem
        v-for="(src, i) in imgs"
        :key="i"
        :src="src"
        :alt="`Image ${i + 1}`"
      >
        <img :src="src" class="size-24 cursor-zoom-in rounded-lg" alt="" />
      </KunLightboxGalleryItem>
    </div>
  </KunLightboxGallery>
</template>
```

### Gallery.vue

```vue
<script setup lang="ts">
// 多张缩略图组成画廊：每个 KunLightboxGalleryItem 点击后打开共享的
// Lightbox,并定位到该项;在大图中可用 ←/→、缩略图条切换上一张/下一张。
// 离线安全的内联 SVG data URI 作为图片源。
const colors = ['7c3aed', '22c55e', 'f59e0b', 'ef4444', '0ea5e9', 'ec4899']
const imgs = colors.map(
  (c) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23${c}"/></svg>`
    )}`
)
</script>

<template>
  <KunLightboxGallery>
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
      <KunLightboxGalleryItem
        v-for="(src, i) in imgs"
        :key="i"
        :src="src"
        :alt="`Photo ${i + 1}`"
      >
        <img
          :src="src"
          class="aspect-square w-full cursor-zoom-in rounded-lg object-cover"
          alt=""
        />
      </KunLightboxGalleryItem>
    </div>
  </KunLightboxGallery>
</template>
```

### Standalone.vue

```vue
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
```

### Veiled.vue

```vue
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
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `images` * | `KunLightboxImage[]` | — |
| `isOpen` * | `boolean` | — |
| `initialIndex` | `number` | — |

## Events

| 事件 | 回调参数 | 说明 |
| --- | --- | --- |
| `reveal` | `index: number` | A veiled image was revealed; `index` is its position in `images`. |
| `update:isOpen` | `value: boolean` |  |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#veil` | `{ index: number; image: KunLightboxImage; reveal: () => void; }` | Drawn over a veiled image, above its thumbhash. Call `reveal` to load and show the picture. Defaults to a "Show image" button. |

---
本页来源 · KunUI · https://ui.kungal.com/components/lightbox
