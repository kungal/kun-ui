# Copy (复制)

> 一键复制到剪贴板,带成功反馈。

## 示例

### Basic.vue

```vue
<template>
  <KunCopy text="https://github.com/kungal/kun-ui" name="Copy the URL" />
</template>
```

### CopiedText.vue

```vue
<template>
  <KunCopy text="kungal@example.com" name="复制邮箱" copied-text="复制成功！" />
</template>
```

### Colors.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunCopy text="primary" name="primary" color="primary" />
    <KunCopy text="secondary" name="secondary" color="secondary" />
    <KunCopy text="success" name="success" color="success" />
    <KunCopy text="warning" name="warning" color="warning" />
    <KunCopy text="danger" name="danger" color="danger" />
  </div>
</template>
```

### Variants.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunCopy text="solid" name="solid" variant="solid" />
    <KunCopy text="light" name="light" variant="light" />
    <KunCopy text="bordered" name="bordered" variant="bordered" />
    <KunCopy text="flat" name="flat" variant="flat" />
  </div>
</template>
```

### Sizes.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunCopy text="sm" name="sm" size="sm" />
    <KunCopy text="md" name="md" size="md" />
    <KunCopy text="lg" name="lg" size="lg" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` * | `string` | — |  |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` |  |
| `copiedText` | `string` | `"已复制"` | Label shown briefly after a successful copy. Default '已复制'. |
| `name` | `string` | `""` |  |
| `rounded` | `KunUIRounded` | — |  |
| `size` | `KunUISize` | `"md"` |  |
| `variant` | `KunUIVariant` | `"light"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/copy
