# FileInput (文件选择)

> 样式化的文件选择按钮(v-model File | File[]),触发器可自定义。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const file = ref<File | null>(null)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <KunFileInput v-model="file" />
    <KunFileInput
      v-model="file"
      trigger-text="Upload avatar"
      trigger-color="secondary"
      accept="image/*"
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `accept` | `string` | `""` |
| `className` | `string` | `""` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `files` | `File[]` | `[]` |
| `fullWidth` | `boolean` | `false` |
| `hint` | `string` | `""` |
| `maxSize` | `number` | `undefined` |
| `modelValue` | `File \| null` | `null` |
| `multiple` | `boolean` | `false` |
| `showFileName` | `boolean` | `true` |
| `triggerColor` | `KunUIColor` | `"primary"` |
| `triggerIcon` | `string` | `"lucide:upload"` |
| `triggerSize` | `KunUISize` | `"md"` |
| `triggerText` | `string` | `"选择文件"` |
| `triggerVariant` | `KunUIVariant` | `"flat"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/fileinput
