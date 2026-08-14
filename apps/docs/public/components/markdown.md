# Markdown (Markdown 字形)

> KunUI markdown 字形(内联 SVG)。

## 示例

### Basic.vue

```vue
<template>
  <KunMarkdown class="text-primary size-8" />
</template>
```

### Sizes.vue

```vue
<template>
  <!-- KunMarkdown 是内联 SVG 字形,无属性 —— 用 size-* 或 text-* 控制尺寸。 -->
  <div class="flex items-center gap-4">
    <KunMarkdown class="size-4" />
    <KunMarkdown class="size-6" />
    <KunMarkdown class="size-8" />
    <KunMarkdown class="size-12" />
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <!-- 字形以 currentColor 绘制,因此 text-* 类即可改色。 -->
  <div class="flex items-center gap-4">
    <KunMarkdown class="size-8 text-primary" />
    <KunMarkdown class="size-8 text-success" />
    <KunMarkdown class="size-8 text-warning" />
    <KunMarkdown class="size-8 text-danger" />
  </div>
</template>
```

---
本页来源 · KunUI · https://ui.kungal.com/components/markdown
