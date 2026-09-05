# Header (标题)

> 带样式的区块标题(h1–h3),可带描述。

## 示例

### Basic.vue

```vue
<template>
  <KunHeader name="组件库" />
</template>
```

### Scale.vue

```vue
<template>
  <div class="flex flex-col gap-4">
    <KunHeader name="一级标题" scale="h1" />
    <KunHeader name="二级标题" scale="h2" />
    <KunHeader name="三级标题" scale="h3" />
  </div>
</template>
```

### WithDescription.vue

```vue
<template>
  <KunHeader
    name="账号设置"
    description="管理你的个人资料、安全选项与通知偏好。"
    scale="h2"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `description` | `string` | `""` |
| `name` | `string` | `""` |
| `scale` | `"h1" \| "h2" \| "h3"` | `"h1"` |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#description` | — |
| `#endContent` | — |
| `#headerEndContent` | — |
| `#title` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/header
