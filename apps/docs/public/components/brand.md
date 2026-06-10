# Brand (品牌)

> logo + 名称的品牌块,点击回到首页,可带徽标。

## 示例

### Basic.vue

```vue
<template>
  <KunBrand name="KunUI" badge="Docs" to="/" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `name` * | `string` | — |
| `badge` | `string` | `""` |
| `badgeColor` | `KunUIColor` | `"primary"` |
| `iconAlt` | `string` | `"logo"` |
| `iconClass` | `string` | `"size-10 rounded-2xl"` |
| `iconSrc` | `string` | `"/favicon.webp"` |
| `nameClass` | `string` | `"text-xl"` |
| `to` | `string` | `"/"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/brand
