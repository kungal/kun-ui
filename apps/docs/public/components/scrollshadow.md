# ScrollShadow (滚动阴影)

> 带边缘渐隐阴影的滚动容器,仅在有更多内容时出现。

## 示例

### Basic.vue

```vue
<template>
  <KunScrollShadow class-name="max-w-md">
    <KunCard v-for="n in 12" :key="n" color="default" class-name="w-32 shrink-0">
      Item {{ n }}
    </KunCard>
  </KunScrollShadow>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `axis` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `className` | `string` | `""` |
| `contentClass` | `string` | `""` |
| `shadowColor` | `string` | `"var(--color-background)"` |
| `shadowSize` | `string` | `"2rem"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/scrollshadow
