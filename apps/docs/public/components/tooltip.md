# Tooltip (文字提示)

> 围绕触发元素的悬停 / 聚焦提示,可定位到任意一侧。

## 示例

### Basic.vue

```vue
<template>
  <KunTooltip text="Hello from a tooltip" position="top">
    <KunButton variant="bordered">Hover me</KunButton>
  </KunTooltip>
  <KunTooltip text="On the right" position="right">
    <KunButton variant="bordered">And me</KunButton>
  </KunTooltip>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `delayHide` | `number` | `0` |
| `delayShow` | `number` | `100` |
| `hideOnMobile` | `boolean` | `true` |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `text` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/tooltip
