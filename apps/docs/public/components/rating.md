# Rating (评分)

> 星级评分输入(v-model number),支持只读与尺寸。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const rating = ref(3)
</script>

<template>
  <div class="flex items-center gap-3">
    <KunRating v-model="rating" />
    <span class="text-default-500 text-sm">{{ rating }} / 5</span>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `ariaLabel` | `string` | `"rating"` |
| `disabled` | `boolean` | `false` |
| `max` | `number` | `5` |
| `modelValue` | `number` | `0` |
| `readonly` | `boolean` | `false` |
| `size` | `"md" \| "sm" \| "lg"` | `"md"` |

---
本页来源 · KunUI · https://ui.kungal.com/components/rating
