# Content (内容)

> 渲染可信 HTML(支持剧透与内联图片灯箱)。不做 sanitize —— 不可信 HTML 请自行处理。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// Trusted, author-written HTML. For user/untrusted HTML, sanitize it yourself
// first (e.g. DOMPurify) — KunContent does NOT sanitize.
const html =
  '<h3>Rich content</h3><p>KunContent renders trusted HTML, with <strong>spoiler</strong> and inline-image lightbox support.</p>'
</script>

<template>
  <KunContent :content="html" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `content` * | `string` | — |
| `className` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/content
