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
| `ariaLabel` | `string` | `""` | Accessible name. Falls back to the slot text, or to `"button"` for `isIconOnly`; set it whenever the button carries no readable text. |
| `className` | `string` | `""` | Extra classes, merged after the component's own classes so yours wins the conflict — KunUI's `rounded-kun-*` / `shadow-kun-*` scales included. |
| `color` | `KunUIColor` | `"primary"` | Semantic colour the variant is painted in. |
| `disabled` | `boolean` | `false` | Blocks clicks and dims the button. In link mode the block is a JS guard, because `disabled` is a no-op on an `<a>` and the link would still navigate. |
| `fullWidth` | `boolean` | `false` | Stretch to the container's full width. |
| `href` | `string` | `""` | Render an `<a>` (NuxtLink under Nuxt) instead of a `<button>`, keeping the button's appearance. |
| `icon` | `boolean` | `false` | Render the `#icon` slot beside the label. Without it that slot is not rendered at all. |
| `iconPosition` | `"right" \| "left"` | `"left"` | Which side of the label the `#icon` slot sits on. |
| `isIconOnly` | `boolean` | `false` | Fixed square button, sized to the same-`size` text button's height so icon and text buttons line up in a row. Give it an `ariaLabel` — it has no text of its own. |
| `loading` | `boolean` | `false` | Prepends a spinner and blocks clicks. The label stays in place, so a row of buttons does not reflow mid-request. |
| `rel` | `string` | `undefined` | `rel` for the rendered link. Replaces the default rather than adding to it, matching NuxtLink: with `target="_blank"` and no `rel`, KunUI emits `noopener noreferrer`; passing `rel="noopener"` emits exactly that, which is how you keep the `Referer` header (analytics on the other side count the visit as a referral instead of direct traffic). `noopener` is still added back to any `_blank` link unless the value contains the spec's `opener` token; `rel=""` removes the attribute entirely. |
| `rounded` | `KunUIRounded` | — | Corner radius. Left unset it follows the app-wide config (default `md`) so every KunUI surface shares one radius. |
| `size` | `KunUISize` | `"md"` | Height, padding and font size. It is the shared form-control scale, so a button lines up with an input or select of the same `size`. |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Link target — link mode only. `_blank` also picks a safe default `rel`. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native `type` of the rendered `<button>` — `submit` is what makes a button submit its surrounding form. Ignored in link mode (`href`). |
| `variant` | `KunUIVariant` | `"solid"` | Visual style: `solid` filled, `bordered` outline, `light` text-only with a tinted hover, `flat` a soft tint, `shadow` filled with elevation. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `click` | `event: MouseEvent` |

## Slots

| 插槽 | 作用域 |
| --- | --- |
| `#default` | — |
| `#icon` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/button
