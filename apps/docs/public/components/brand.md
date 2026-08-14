# Brand (品牌)

> logo + 名称的品牌块,点击回到首页,可带徽标。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// A bundled data-URI logo (no network request for the demo). In a real app
// `iconSrc` defaults to `/favicon.webp`.
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="%237c3aed"/><text x="20" y="27" font-size="20" fill="%23fff" text-anchor="middle" font-family="sans-serif">K</text></svg>'
)}`
</script>

<template>
  <!-- Logo + name; the whole thing is a crawlable home link (`to`, default "/"). -->
  <KunBrand name="KunUI" :icon-src="logo" to="/" />
</template>
```

### Badge.vue

```vue
<script setup lang="ts">
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="%237c3aed"/><text x="20" y="27" font-size="20" fill="%23fff" text-anchor="middle" font-family="sans-serif">K</text></svg>'
)}`
</script>

<template>
  <!-- A `badge` chip sits after the name; `badgeColor` is any KunUIColor. -->
  <div class="flex flex-col gap-4">
    <KunBrand name="KunUI" :icon-src="logo" badge="Beta" badge-color="primary" />
    <KunBrand name="KunUI" :icon-src="logo" badge="Docs" badge-color="secondary" />
    <KunBrand name="KunUI" :icon-src="logo" badge="New" badge-color="success" />
  </div>
</template>
```

### Custom.vue

```vue
<script setup lang="ts">
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="%237c3aed"/><text x="20" y="27" font-size="20" fill="%23fff" text-anchor="middle" font-family="sans-serif">K</text></svg>'
)}`
</script>

<template>
  <!-- `iconClass` and `nameClass` let you resize/restyle the logo and the name.
       `iconAlt` sets the logo's alt text for accessibility. -->
  <KunBrand
    name="KunUI"
    :icon-src="logo"
    icon-alt="KunUI 标志"
    icon-class="size-14 rounded-kun-lg"
    name-class="text-3xl font-bold"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `name` * | `string` | — |
| `badge` | `string` | `""` |
| `badgeColor` | `KunUIColor` | `"primary"` |
| `iconAlt` | `string` | `"logo"` |
| `iconClass` | `string` | `"size-10 rounded-kun-lg"` |
| `iconSrc` | `string` | `"/favicon.webp"` |
| `nameClass` | `string` | `"text-xl"` |
| `to` | `string` | `"/"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/brand
