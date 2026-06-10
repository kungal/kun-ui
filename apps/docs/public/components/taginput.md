# TagInput (标签输入)

> 标签输入(v-model string[]),支持分隔符、校验与计数。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['vue', 'nuxt'])
</script>

<template>
  <KunTagInput
    v-model="tags"
    label="Tags"
    placeholder="Add a tag, press Enter…"
    :max-tags="8"
    show-counter
    class-name="max-w-md"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `allowDuplicates` | `boolean` | `false` |
| `caseSensitive` | `boolean` | `false` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"primary"` |
| `confirmOnBlur` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `helperText` | `string` | `""` |
| `label` | `string` | `""` |
| `maxTagLength` | `number` | `100` |
| `maxTags` | `number` | `Number.POSITIVE_INFINITY` |
| `minTagLength` | `number` | `1` |
| `modelValue` | `string[]` | `[]` |
| `placeholder` | `string` | `""` |
| `readonly` | `boolean` | `false` |
| `respectComposition` | `boolean` | `true` |
| `rounded` | `KunUIRounded` | `undefined` |
| `showCounter` | `boolean` | `false` |
| `size` | `KunUISize` | `"md"` |
| `splitChars` | `(string \| RegExp)[]` | `["\n", ",", "，", ";"]` |
| `splitOnPaste` | `boolean` | `true` |
| `transform` | `((raw: string) => string)` | `undefined` |
| `trim` | `boolean` | `true` |
| `validate` | `KunTagInputValidator` | `undefined` |
| `variant` | `KunTagInputVariant` | `"bordered"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/taginput
