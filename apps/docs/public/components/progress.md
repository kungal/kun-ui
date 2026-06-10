# Progress (进度条)

> 进度条:实心 / 条纹 / 渐变 / 环形,支持不确定态与标签。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <KunProgress :value="60" show-label />
    <KunProgress :value="40" variant="striped" color="success" />
    <KunProgress :value="80" variant="gradient" color="secondary" />
    <KunProgress indeterminate color="primary" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `indeterminate` | `boolean` | `false` |
| `max` | `number` | `100` |
| `rounded` | `KunUIRounded` | `undefined` |
| `showLabel` | `boolean` | `false` |
| `size` | `KunUISize` | `"md"` |
| `value` | `number` | `0` |
| `variant` | `KunUIVariant \| "gradient" \| "circle" \| "striped"` | `"solid"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/progress
