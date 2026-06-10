# Card (卡片)

> 带颜色、边框与悬停效果的容器;传入 href 即变为链接。

## 示例

### Basic.vue

```vue
<template>
  <KunCard class-name="max-w-sm">
    <h3 class="font-semibold">Card title</h3>
    <p class="text-default-600 mt-1 text-sm">
      A simple container with a border and padding.
    </p>
  </KunCard>
</template>
```

### Colors.vue

```vue
<template>
  <KunCard color="primary" class-name="w-32">primary</KunCard>
  <KunCard color="success" class-name="w-32">success</KunCard>
  <KunCard color="warning" class-name="w-32">warning</KunCard>
  <KunCard color="danger" class-name="w-32">danger</KunCard>
</template>
```

### Hoverable.vue

```vue
<template>
  <!-- With an `href`, the card becomes a link (NuxtLink under the layer). -->
  <KunCard is-hoverable clickable href="/components/button" class-name="max-w-sm">
    <h3 class="font-semibold">Hoverable + link →</h3>
    <p class="text-default-600 mt-1 text-sm">Hover me, then click to navigate.</p>
  </KunCard>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `bordered` | `boolean` | `true` |
| `className` | `string` | `""` |
| `clickable` | `boolean` | `false` |
| `color` | `KunUIColor \| "background"` | `"background"` |
| `contentClass` | `string` | `""` |
| `darkBorder` | `boolean` | `false` |
| `href` | `string` | `undefined` |
| `isHoverable` | `boolean` | `false` |
| `isTransparent` | `boolean` | `false` |
| `rounded` | `KunUIRounded` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/card
