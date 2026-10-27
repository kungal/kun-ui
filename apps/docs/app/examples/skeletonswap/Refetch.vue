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
