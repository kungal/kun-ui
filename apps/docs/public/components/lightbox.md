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

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `images` * | `KunLightboxImage[]` | — |
| `isOpen` * | `boolean` | — |
| `initialIndex` | `number` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/lightbox
