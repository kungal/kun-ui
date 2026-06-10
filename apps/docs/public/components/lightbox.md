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

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `images` * | `KunLightboxImage[]` | — |
| `isOpen` * | `boolean` | — |
| `initialIndex` | `number` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/lightbox
