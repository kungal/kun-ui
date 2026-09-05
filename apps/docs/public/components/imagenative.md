# ImageNative (原生图片)

> 原生 <img> + class 合并,适用于无需优化管线的场景。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// KunImageNative 是一个最简的原生 <img> 包装，不含骨架屏 / 优化逻辑。
const img = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="240" height="240" rx="24" fill="url(#g)"/></svg>'
)}`
</script>

<template>
  <KunImageNative :src="img" alt="原生图片" :width="120" :height="120" />
</template>
```

### ClassMerge.vue

```vue
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
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `src` * | `string` | — |
| `alt` | `string` | `"image"` |
| `ariaLabel` | `string` | — |
| `className` | `string` | — |
| `height` | `string \| number` | — |
| `loading` | `"lazy" \| "eager"` | `"lazy"` |
| `width` | `string \| number` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/imagenative
