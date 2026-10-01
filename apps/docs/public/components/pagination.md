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

### Few.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <KunPagination v-model:current-page="page" :total-page="5" />
</template>
```

### Loading.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(3)
</script>

<template>
  <KunPagination v-model:current-page="page" :total-page="20" :is-loading="true" />
</template>
```

### Crawlable.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
const pageHref = (n: number) => `#/page/${n}`
</script>

<template>
  <KunPagination
    v-model:current-page="page"
    :total-page="20"
    :page-href="pageHref"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentPage` * | `number` | — |  |
| `totalPage` * | `number` | — |  |
| `isLoading` | `boolean` | — |  |
| `pageHref` | `((page: number) => string)` | — | Map a page number to its URL. When provided, the page numbers and the prev / next controls render real <a href> (crawlable pagination) instead of plain buttons. A plain click still emits `update:currentPage` while the link navigates; a click with Ctrl, Cmd, Shift or Alt held does not, because the browser opens that page elsewhere and this view stays where it is. |

## Events

| 事件 | 回调参数 |
| --- | --- |
| `update:currentPage` | `page: number` |

---
本页来源 · KunUI · https://ui.kungal.com/components/pagination
