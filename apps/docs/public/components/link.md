# Link (链接)

> 样式化链接,经由注入的链接组件渲染(Nuxt 下为 NuxtLink)。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunLink href="/components/button">内部链接</KunLink>
    <KunLink href="#" underline="hover">悬停显示下划线</KunLink>
    <KunLink href="#" :underline="'none'">无下划线</KunLink>
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunLink href="#" color="primary">primary</KunLink>
    <KunLink href="#" color="secondary">secondary</KunLink>
    <KunLink href="#" color="success">success</KunLink>
    <KunLink href="#" color="warning">warning</KunLink>
    <KunLink href="#" color="danger">danger</KunLink>
    <KunLink href="#" color="info">info</KunLink>
    <KunLink href="#" color="default">default</KunLink>
  </div>
</template>
```

### External.vue

```vue
<template>
  <KunLink
    href="https://github.com/kungal/kun-ui"
    target="_blank"
    is-show-anchor-icon
  >
    KunUI on GitHub
  </KunLink>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `href` | `string` | `undefined` |
| `isShowAnchorIcon` | `boolean` | `false` |
| `rel` | `string` | `""` |
| `size` | `KunUISize` | `"md"` |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` |
| `to` | `string \| Record<string, string>` | `""` |
| `underline` | `"none" \| "always" \| "hover"` | `"always"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/link
