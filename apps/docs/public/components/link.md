# Link (链接)

> 样式化链接,经由注入的链接组件渲染(Nuxt 下为 NuxtLink)。

## 示例

### Basic.vue

```vue
<template>
  <KunLink href="/components/button">Internal link</KunLink>
  <KunLink href="https://github.com/kungal/kun-ui" target="_blank" is-show-anchor-icon>
    External
  </KunLink>
  <KunLink href="#" color="danger" underline="hover">Danger, underline on hover</KunLink>
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
