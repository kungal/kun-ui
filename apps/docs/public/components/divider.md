# Divider (分割线)

> 横向或纵向分割线,可带居中标签。

## 示例

### Basic.vue

```vue
<template>
  <div class="w-full max-w-md">
    <p class="text-default-600 text-sm">Section one</p>
    <KunDivider />
    <p class="text-default-600 text-sm">Section two</p>
    <KunDivider>or</KunDivider>
    <p class="text-default-600 text-sm">After a labelled divider</p>
    <KunDivider border-style="dashed" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `borderStyle` | `"solid" \| "dashed"` | `"solid"` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `withLabel` | `boolean` | `false` |

---
本页来源 · KunUI · https://ui.kungal.com/components/divider
