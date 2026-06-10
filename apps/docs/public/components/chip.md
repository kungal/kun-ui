# Chip (胶囊)

> 小巧的标签 / 胶囊,支持颜色、变体与尺寸。

## 示例

### Colors.vue

```vue
<template>
  <KunChip color="primary">primary</KunChip>
  <KunChip color="secondary">secondary</KunChip>
  <KunChip color="success">success</KunChip>
  <KunChip color="warning">warning</KunChip>
  <KunChip color="danger">danger</KunChip>
  <KunChip color="info">info</KunChip>
  <KunChip color="default">default</KunChip>
</template>
```

### Variants.vue

```vue
<template>
  <KunChip color="primary" variant="solid">solid</KunChip>
  <KunChip color="primary" variant="flat">flat</KunChip>
  <KunChip color="primary" variant="bordered">bordered</KunChip>
  <KunChip color="primary" variant="shadow">shadow</KunChip>
</template>
```

### Sizes.vue

```vue
<template>
  <KunChip color="primary" size="xs">xs</KunChip>
  <KunChip color="primary" size="sm">sm</KunChip>
  <KunChip color="primary" size="md">md</KunChip>
  <KunChip color="primary" size="lg">lg</KunChip>
  <KunChip color="primary" size="xl">xl</KunChip>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `size` | `KunUISize` | `"sm"` |
| `variant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/chip
