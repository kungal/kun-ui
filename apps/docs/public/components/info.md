# Info (提示框)

> 带颜色、图标、标题与描述的内联提示框。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunInfo color="primary" icon="lucide:info" title="Heads up" description="A primary info callout." />
    <KunInfo color="success" variant="flat" icon="lucide:circle-check" title="Success" description="Your changes were saved." />
    <KunInfo color="danger" variant="bordered" icon="lucide:circle-x" title="Error" description="Something went wrong." />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `description` | `string` | `""` |
| `icon` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |
| `title` | `string` | `""` |
| `variant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/info
