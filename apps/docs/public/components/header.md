# Header (标题)

> 带样式的区块标题(h1–h3),可带描述。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex flex-col gap-4">
    <KunHeader name="Heading h1" description="A section heading with a description" scale="h1" />
    <KunHeader name="Heading h2" scale="h2" />
    <KunHeader name="Heading h3" scale="h3" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `description` | `string` | `""` |
| `name` | `string` | `""` |
| `scale` | `"h1" \| "h2" \| "h3"` | `"h1"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/header
