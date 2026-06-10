# Image (图片)

> 带骨架屏、宽高比与 object-fit 的图片;在 Nuxt 层下经由 @nuxt/image 渲染。

## 示例

### Basic.vue

```vue
<template>
  <!-- provider="none" → plain optimized-less <img> (the Nuxt layer also wires
       @nuxt/image, so you can pass provider/format/quality/etc. when needed). -->
  <KunImage
    src="/favicon.webp"
    alt="KunUI"
    provider="none"
    class-name="size-24 rounded-2xl"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `src` * | `string` | — |
| `alt` | `string` | `"image"` |
| `ariaLabel` | `string` | `undefined` |
| `aspectRatio` | `string` | `undefined` |
| `className` | `string` | `undefined` |
| `decoding` | `"sync" \| "async" \| "auto"` | `undefined` |
| `densities` | `string` | `undefined` |
| `fetchpriority` | `"auto" \| "high" \| "low"` | `undefined` |
| `format` | `string` | `undefined` |
| `height` | `string \| number` | `undefined` |
| `imageClassName` | `string` | `undefined` |
| `loading` | `"lazy" \| "eager"` | `undefined` |
| `objectFit` | `"fill" \| "none" \| "cover" \| "contain" \| "scale-down"` | `"cover"` |
| `placeholder` | `string \| number \| boolean \| [w: number, h: number, q?: number, b?: number]` | `undefined` |
| `preload` | `boolean \| { fetchPriority: "auto" \| "high" \| "low"; }` | `undefined` |
| `provider` | `"none" \| "ipx" \| (string & {})` | `undefined` |
| `quality` | `string \| number` | `undefined` |
| `sizes` | `string` | `undefined` |
| `skeleton` | `boolean` | `true` |
| `width` | `string \| number` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/image
