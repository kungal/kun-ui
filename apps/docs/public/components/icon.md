# Icon (图标)

> 来自内置注册表的内联 SVG 图标 —— 绝不联网请求;继承文字颜色。

## 示例

### Basic.vue

```vue
<template>
  <KunIcon name="lucide:check" class="text-success text-2xl" />
  <KunIcon name="lucide:info" class="text-primary text-2xl" />
  <KunIcon name="lucide:triangle-alert" class="text-warning text-2xl" />
  <KunIcon name="lucide:circle-x" class="text-danger text-2xl" />
  <KunIcon name="svg-spinners:90-ring-with-bg" class="text-primary text-2xl" />
</template>
```

### Sizes.vue

```vue
<template>
  <!-- 默认 1em,随字号缩放。用 text-* 或 size-* 控制大小。 -->
  <div class="flex items-center gap-4">
    <KunIcon name="lucide:home" class="text-base" />
    <KunIcon name="lucide:home" class="text-xl" />
    <KunIcon name="lucide:home" class="text-2xl" />
    <KunIcon name="lucide:home" class="text-4xl" />
    <KunIcon name="lucide:home" class="size-12" />
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <!-- 图标以 currentColor 绘制,继承文字颜色。用 text-* 直接上色,
       或包裹在带 text-* 的元素里。 -->
  <div class="flex items-center gap-4 text-2xl">
    <KunIcon name="lucide:circle-check" class="text-primary" />
    <KunIcon name="lucide:circle-check" class="text-success" />
    <KunIcon name="lucide:triangle-alert" class="text-warning" />
    <KunIcon name="lucide:circle-x" class="text-danger" />
    <span class="text-secondary"><KunIcon name="lucide:info" /></span>
  </div>
</template>
```

### Gallery.vue

```vue
<script setup lang="ts">
// 仅展示已注册的图标(@kungal/ui-core 内置 + 本站 plugins/icons.ts 注册)。
// 未注册的名称会渲染为空,请勿使用。
const icons = [
  'lucide:check',
  'lucide:x',
  'lucide:info',
  'lucide:search',
  'lucide:copy',
  'lucide:download',
  'lucide:upload',
  'lucide:calendar',
  'lucide:eye',
  'lucide:eye-off',
  'lucide:arrow-right',
  'lucide:chevron-right',
  'lucide:plus',
  'lucide:minus',
  'lucide:external-link',
  'lucide:refresh-ccw',
  'lucide:home',
  'lucide:settings',
  'lucide:github',
  'lucide:bot',
  'lucide:zap',
  'lucide:palette',
  'lucide:moon',
  'svg-spinners:90-ring-with-bg',
]
</script>

<template>
  <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
    <div
      v-for="name in icons"
      :key="name"
      class="rounded-kun-md border-default-200 flex flex-col items-center gap-2 border p-3"
    >
      <KunIcon :name="name" class="text-2xl" />
      <span class="text-default-400 break-all text-center text-xs">{{ name }}</span>
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `name` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/icon
