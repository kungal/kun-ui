# Icon (图标)

> 来自内置注册表的内联 SVG 图标 —— 绝不联网请求;继承文字颜色。

## 示例

### Basic.vue

```vue
<template>
  <KunIcon name="lucide:check" class="text-success text-2xl" />
  <KunIcon name="lucide:info" class="text-primary text-2xl" />
  <KunIcon name="lucide:triangle-alert" class="text-warning text-2xl" />
  <KunIcon name="lucide:circle-x" class="text-danger text-2xl" />
  <KunIcon name="svg-spinners:90-ring-with-bg" class="text-primary text-2xl" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `name` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/icon
