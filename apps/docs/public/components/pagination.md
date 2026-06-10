# Pagination (分页)

> 分页导航(v-model:current-page + total-page),带快速跳页。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <div>
    <KunPagination v-model:current-page="page" :total-page="20" />
    <p class="text-default-600 mt-3 text-sm">Page: {{ page }}</p>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `currentPage` * | `number` | — |
| `totalPage` * | `number` | — |
| `isLoading` | `boolean` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/pagination
