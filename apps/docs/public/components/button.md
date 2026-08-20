# Button (按钮)

> 按钮,支持颜色、变体与尺寸、加载状态,并可通过 href 渲染为链接。

## 示例

### Basic.vue

```vue
<template>
  <KunButton color="primary">Primary</KunButton>
  <KunButton color="secondary">Secondary</KunButton>
  <KunButton>Default</KunButton>
</template>
```

### Colors.vue

```vue
<template>
  <KunButton color="primary">primary</KunButton>
  <KunButton color="secondary">secondary</KunButton>
  <KunButton color="success">success</KunButton>
  <KunButton color="warning">warning</KunButton>
  <KunButton color="danger">danger</KunButton>
  <KunButton color="info">info</KunButton>
  <KunButton color="default">default</KunButton>
</template>
```

### Variants.vue

```vue
<template>
  <KunButton color="primary" variant="solid">solid</KunButton>
  <KunButton color="primary" variant="bordered">bordered</KunButton>
  <KunButton color="primary" variant="light">light</KunButton>
  <KunButton color="primary" variant="flat">flat</KunButton>
  <KunButton color="primary" variant="shadow">shadow</KunButton>
</template>
```

### Sizes.vue

```vue
<template>
  <KunButton color="primary" size="xs">xs</KunButton>
  <KunButton color="primary" size="sm">sm</KunButton>
  <KunButton color="primary" size="md">md</KunButton>
  <KunButton color="primary" size="lg">lg</KunButton>
  <KunButton color="primary" size="xl">xl</KunButton>
</template>
```

### States.vue

```vue
<template>
  <KunButton color="primary" loading>Loading</KunButton>
  <KunButton color="primary" disabled>Disabled</KunButton>
  <!-- useKunMessage is auto-imported by the Nuxt layer; KunMessageProvider is
       mounted in app.vue. -->
  <KunButton color="primary" @click="useKunMessage('点击成功!', 'success')">
    Click me
  </KunButton>
</template>
```

### AsLink.vue

```vue
<template>
  <!-- With an `href`, KunButton renders as a link (NuxtLink under the Nuxt
       layer, a native <a> in a plain Vue app). -->
  <KunButton color="primary" href="/components/button">Internal link</KunButton>
  <KunButton variant="bordered" href="https://github.com/kungal/kun-ui" target="_blank">
    External ↗
  </KunButton>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `""` |  |
| `className` | `string` | `""` |  |
| `color` | `KunUIColor` | `"primary"` |  |
| `disabled` | `boolean` | `false` |  |
| `fullWidth` | `boolean` | `false` |  |
| `href` | `string` | `""` |  |
| `icon` | `boolean` | `false` |  |
| `iconPosition` | `"right" \| "left"` | `"left"` |  |
| `isIconOnly` | `boolean` | `false` |  |
| `loading` | `boolean` | `false` |  |
| `rel` | `string` | `undefined` | `rel` for the rendered link. Replaces the default rather than adding to it, matching NuxtLink: with `target="_blank"` and no `rel`, KunUI emits `noopener noreferrer`; passing `rel="noopener"` emits exactly that, which is how you keep the `Referer` header (analytics on the other side count the visit as a referral instead of direct traffic). `noopener` is still added back to any `_blank` link unless the value contains the spec's `opener` token; `rel=""` removes the attribute entirely. |
| `rounded` | `KunUIRounded` | — |  |
| `size` | `KunUISize` | `"md"` |  |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` |  |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` |  |
| `variant` | `KunUIVariant` | `"solid"` |  |

---
本页来源 · KunUI · https://ui.kungal.com/components/button
