# ImageNative (原生图片)

> 原生 <img> + class 合并,适用于无需优化管线的场景。

## 示例

### Basic.vue

```vue
<template>
  <KunImageNative src="/favicon.webp" alt="KunUI" class-name="size-24 rounded-2xl" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `src` * | `string` | — |
| `alt` | `string` | `"image"` |
| `ariaLabel` | `string` | `undefined` |
| `className` | `string` | `undefined` |
| `height` | `string \| number` | `undefined` |
| `loading` | `"lazy" \| "eager"` | `"lazy"` |
| `width` | `string \| number` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/imagenative
