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

### InPlace.vue

```vue
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { demoTopicPage } from '../skeletonswap/topics'
import TopicRows from '../skeletonswap/TopicRows.vue'

const loadPage = (page: number) =>
  Array.from({ length: 6 }, (_, i) => demoTopicPage((page - 1) * 6 + i + 1)).flat()

const page = ref(1)
const topics = ref(loadPage(1))
const loading = ref(false)
const heading = ref<HTMLElement | null>(null)

const revealListStart = () => {
  const el = heading.value
  if (!el) return
  const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  if (el.getBoundingClientRect().top >= offset) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  el.focus({ preventScroll: true })
  el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
}

let request = 0
watch(page, (next) => {
  const current = ++request
  loading.value = true
  setTimeout(async () => {
    if (current !== request) return
    topics.value = loadPage(next)
    loading.value = false
    await nextTick()
    revealListStart()
  }, 700)
})
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <h3 ref="heading" tabindex="-1" class="scroll-mt-20 font-semibold outline-none">
      最新话题 · 第 {{ page }} 页
    </h3>
    <KunLoading :loading="loading" spinner>
      <KunCard bordered padding="md">
        <TopicRows :topics="topics" />
      </KunCard>
    </KunLoading>
    <KunPagination v-model:current-page="page" :total-page="5" :is-loading="loading" />
  </div>
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
