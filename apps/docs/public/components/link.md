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
  <div class="flex flex-wrap items-center gap-4">
    <KunLink
      href="https://github.com/kungal/kun-ui"
      target="_blank"
      is-show-anchor-icon
    >
      默认 noopener noreferrer
    </KunLink>

    <!-- `rel` replaces that default rather than adding to it (NuxtLink's rule).
         Dropping `noreferrer` keeps the Referer header, so the destination's
         analytics records a referral from your site instead of direct traffic.
         `noopener` is added back to any target="_blank" link anyway. -->
    <KunLink
      href="https://github.com/kungal/kun-ui"
      target="_blank"
      rel="noopener"
      is-show-anchor-icon
    >
      rel="noopener"，保留来源
    </KunLink>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` |  |
| `href` | `string` | — |  |
| `isShowAnchorIcon` | `boolean` | `false` |  |
| `rel` | `string` | `undefined` | `rel` for the rendered link. Replaces the default rather than adding to it, matching NuxtLink: with `target="_blank"` and no `rel`, KunUI emits `noopener noreferrer`; passing `rel="noopener"` emits exactly that, which is how you keep the `Referer` header (analytics on the other side count the visit as a referral instead of direct traffic). `noopener` is still added back to any `_blank` link unless the value contains the spec's `opener` token; `rel=""` removes the attribute entirely. |
| `size` | `KunUISize` | `"md"` |  |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` |  |
| `to` | `string \| Record<string, string>` | `""` |  |
| `underline` | `"none" \| "always" \| "hover"` | `"always"` |  |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |
| `#prefix` | — |
| `#suffix` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/link
