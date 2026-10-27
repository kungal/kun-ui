# SkeletonSwap (骨架切换)

> 区域级的骨架与内容切换:超过 delay 才显示骨架、显示后至少停留 minDuration,交叉淡入淡出不跳动,服务端渲染时直接给出内容。

## 示例

### FirstLoad.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { demoTopicPage, type DemoTopic } from './topics'
import TopicRows from './TopicRows.vue'

// The page starts with its data, as a server render would. "进入页面" remounts
// the region with `loading` true, the way a client-side navigation enters it.
const topics = ref<DemoTopic[] | null>(demoTopicPage(1))
const loading = ref(false)
const visit = ref(0)

const enter = (latency: number) => {
  const current = ++visit.value
  topics.value = null
  loading.value = true
  setTimeout(() => {
    if (current !== visit.value) return
    topics.value = demoTopicPage(1)
    loading.value = false
  }, latency)
}
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      <KunButton size="sm" variant="bordered" @click="enter(80)">进入页面(80ms 请求)</KunButton>
      <KunButton size="sm" variant="bordered" @click="enter(1200)">进入页面(1.2s 请求)</KunButton>
    </div>
    <KunCard bordered padding="md">
      <KunSkeletonSwap :key="visit" :loading="loading">
        <TopicRows :topics="topics ?? []" />
        <template #skeleton>
          <TopicRows />
        </template>
      </KunSkeletonSwap>
    </KunCard>
  </div>
</template>
```

### Refetch.vue

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { demoTopicPage } from './topics'
import TopicRows from './TopicRows.vue'

const page = ref(1)
const topics = ref(demoTopicPage(1))
const loading = ref(false)
const fast = ref(false)

let request = 0
watch(page, (next) => {
  const current = ++request
  loading.value = true
  setTimeout(() => {
    if (current !== request) return
    topics.value = demoTopicPage(next)
    loading.value = false
  }, fast.value ? 100 : 900)
})
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-3">
    <KunSwitch v-model="fast" label="快速请求(100ms,否则 900ms)" />
    <KunCard bordered padding="md">
      <KunSkeletonSwap :loading="loading">
        <TopicRows :topics="topics" />
        <template #skeleton>
          <TopicRows />
        </template>
      </KunSkeletonSwap>
    </KunCard>
    <KunPagination v-model:current-page="page" :total-page="3" :is-loading="loading" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `loading` * | `boolean` | — | True while the region's data is loading. If it is false when the component is created, the default slot renders straight away, with no skeleton and no fade. |
| `className` | `string` | `""` | Classes for the root. Its display is an inline grid that stacks the two layers, so a display class has no effect; lay the content out inside the slots. |
| `delay` | `number` | `150` | ms of loading before the skeleton shows. A load that ends sooner never shows it. While it waits, previous content stays as it is; with no content yet, the skeleton is laid out invisibly, so its arrival does not move the page. A server render and the hydration that follows skip the delay: they cannot wait it out. |
| `minDuration` | `number` | `300` | ms a shown skeleton stays before the content replaces it, so it does not flash on and off. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#default` | `any` | The real content. Also rendered while a reload waits out `delay`, so it must render from the previous data. |
| `#skeleton` | `any` | The placeholder layout, built from KunSkeleton, in the content's shape. |

---
本页来源 · KunUI · https://ui.kungal.com/components/skeletonswap
