# Badge (徽标)

> 包裹触发元素的计数或圆点角标;max 限制显示的最大计数。

## 示例

### Basic.vue

```vue
<template>
  <KunBadge :count="5">
    <KunButton variant="bordered">Inbox</KunButton>
  </KunBadge>
  <KunBadge :count="120" :max="99" color="primary">
    <KunButton variant="bordered">Messages</KunButton>
  </KunBadge>
  <KunBadge variant="dot" color="success">
    <KunButton variant="bordered">Status</KunButton>
  </KunBadge>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"danger"` |
| `count` | `number` | `0` |
| `max` | `number` | `99` |
| `placement` | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left"` | `"top-right"` |
| `show` | `boolean` | `true` |
| `showZero` | `boolean` | `false` |
| `size` | `"md" \| "sm" \| "lg"` | `"md"` |
| `variant` | `"count" \| "dot"` | `"count"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/badge
