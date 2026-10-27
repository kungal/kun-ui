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
