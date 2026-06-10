# Textarea (文本域)

> 多行输入(v-model),支持自动增高、调整大小与字数统计。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div class="max-w-md">
    <KunTextarea
      v-model="text"
      label="Bio"
      placeholder="Tell us about yourself"
      :rows="4"
      :maxlength="200"
      show-char-count
    />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `autofocus` | `boolean` | `false` |
| `autoGrow` | `boolean` | `false` |
| `darkBorder` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `error` | `string` | `""` |
| `hint` | `string` | `""` |
| `label` | `string` | `""` |
| `maxHeight` | `string` | `""` |
| `maxlength` | `number` | `100007` |
| `minlength` | `number` | `1` |
| `modelValue` | `string` | `""` |
| `name` | `string` | `""` |
| `placeholder` | `string` | `""` |
| `readonly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `resize` | `"none" \| "horizontal" \| "vertical" \| "both"` | `"none"` |
| `rounded` | `KunUIRounded` | `undefined` |
| `rows` | `number` | `4` |
| `showCharCount` | `boolean` | `false` |

---
本页来源 · KunUI · https://ui.kungal.com/components/textarea
