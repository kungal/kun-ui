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

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |
| `content` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/text
