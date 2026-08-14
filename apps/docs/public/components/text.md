# Text (文本)

> 安全换行的文本块,可正确折行长 URL 与下划线串。

## 示例

### Basic.vue

```vue
<template>
  <KunText
    content="https://example.com/very/long/path/with_underscores_that_should_wrap_cleanly"
    class-name="max-w-xs"
  />
</template>
```

### Wrapping.vue

```vue
<script setup lang="ts">
// KunText 在每个 `_` 和 `/` 后插入零宽空格,因此 URL / snake_case 这类长
// 标记会自动换行,而不会撑破容器。对比下方原生 <span>(会溢出)。
const long =
  'https://example.com/a/very/long/path_with_many_underscores_and_slashes_that_would_overflow'
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="rounded-kun-md border-default-200 w-48 border p-2">
      <KunText :content="long" class-name="text-sm" />
    </div>
    <div class="rounded-kun-md border-default-200 w-48 overflow-hidden border p-2">
      <span class="text-default-400 text-sm">{{ long }}</span>
    </div>
  </div>
</template>
```

### Styling.vue

```vue
<script setup lang="ts">
// content 内的换行会被保留(white-space: pre-wrap),className 透传任意
// Tailwind 类来控制字号 / 字重 / 颜色等样式。
const text = '第一行\n第二行(换行被保留)'
</script>

<template>
  <KunText :content="text" class-name="text-lg font-semibold text-primary" />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `content` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/text
